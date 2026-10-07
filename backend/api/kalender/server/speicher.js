"use strict";
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const D = require("../kalender-daten");
const digest = (s, algo = "sha256") => crypto.createHash(algo).update(s).digest("hex");
const finger = (e) => digest(D.finger(e));

// Compare-and-set prevents two server instances from overwriting the same edit.
const CAS = "local old=redis.call('HGET',KEYS[1],ARGV[1]); if (old or '')~=ARGV[2] then return 0 end; if ARGV[3]=='' then redis.call('HDEL',KEYS[1],ARGV[1]) else redis.call('HSET',KEYS[1],ARGV[1],ARGV[3]) end; return 1";
// Legacy entries need a verified snapshot; Redis checks it before any write.
const FINGERS = `local rows=redis.call('HGETALL',KEYS[1]); local legacy=cjson.decode(ARGV[1]); local fps={}; local ids={};
for i=1,#rows,2 do
  local e=cjson.decode(rows[i+1]); local fp=e._finger or legacy[redis.sha1hex(rows[i+1])];
  if not fp then return -2 end;
  fps[rows[i]]=fp; ids[rows[i]]=true;
end;`;
const SAVE = `-- grumi-save
${FINGERS}
local old=redis.call('HGET',KEYS[1],ARGV[2]);
if (old or '')~=ARGV[3] then return 0 end;
local next=cjson.decode(ARGV[4]);
for id,fp in pairs(fps) do if id~=ARGV[2] and fp==next._finger then return -1 end end;
if not old and #rows/2>=5000 then return -3 end;
redis.call('HSET',KEYS[1],ARGV[2],ARGV[4]); return 1`;
const IMPORT = `-- grumi-import
${FINGERS}
local seen={}; for id,fp in pairs(fps) do seen[fp]=true end;
local add={}; local input=cjson.decode(ARGV[2]);
for _,item in ipairs(input) do
  local e=cjson.decode(item[2]);
  if not ids[item[1]] and not seen[e._finger] then
    table.insert(add,item); ids[item[1]]=true; seen[e._finger]=true;
  end;
end;
if #rows/2+#add>5000 then return -3 end;
for _,item in ipairs(add) do redis.call('HSETNX',KEYS[1],item[1],item[2]) end; return #add`;

function kalenderSpeicher(options = {}) {
  const redis = options.redis || {}, sessions = new Map();
  const prefix = options.prefix || "grumi:kalender:2026-2027:";
  const file = path.join(options.dataDir || path.join(__dirname, "data"), "kalender-lokal.json");
  const remote = Boolean(redis.url && redis.token);
  if (Boolean(redis.url) !== Boolean(redis.token)) throw new Error("Kalender: Upstash-Zugang unvollständig.");
  async function cmd(...args) {
    const r = await (options.fetch || fetch)(redis.url.replace(/\/+$/, ""), {
      method: "POST", headers: { Authorization: "Bearer " + redis.token, "Content-Type": "application/json" },
      body: JSON.stringify(args), signal: AbortSignal.timeout(15000)
    });
    const d = await r.json();
    if (!r.ok || d.error) throw new Error("Kalender-Speicher nicht erreichbar");
    return d.result;
  }
  function read() {
    if (!fs.existsSync(file)) return { konten: {}, termine: {} };
    const d = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!d.konten || !d.termine) throw new Error("Ungültiger Kalender-Speicher");
    return d;
  }
  function write(d) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file + ".tmp", JSON.stringify(d), { encoding: "utf8", mode: 0o600 });
    fs.renameSync(file + ".tmp", file);
  }
  async function unique(script, ...args) {
    for (let attempt=0; attempt<4; attempt++) {
      const values=await cmd("HVALS",prefix+"termine") || [], legacy={};
      for (const raw of values) { const e=JSON.parse(raw); if (!e._finger) legacy[digest(raw,"sha1")]=finger(e); }
      const result=Number(await cmd("EVAL",script,1,prefix+"termine",JSON.stringify(legacy),...args));
      if (result!==-2) return result;
    }
    throw new Error("Kalender wurde gleichzeitig geaendert. Bitte erneut versuchen.");
  }
  return {
    art: remote ? "upstash" : "datei",
    async all(bucket) {
      const values = remote ? (await cmd("HVALS", prefix + bucket) || []) : Object.values(read()[bucket]);
      return values.map((s) => JSON.parse(s));
    },
    async raw(bucket, id) {
      if (remote) return await cmd("HGET", prefix + bucket, id);
      const b = read()[bucket]; return Object.hasOwn(b, id) ? b[id] : null;
    },
    async cas(bucket, id, old, value) {
      const raw = value === null ? "" : JSON.stringify(value);
      if (remote) return Number(await cmd("EVAL", CAS, 1, prefix + bucket, id, old || "", raw)) === 1;
      const d = read();
      if ((Object.hasOwn(d[bucket], id) ? d[bucket][id] : "") !== (old || "")) return false;
      if (value === null) delete d[bucket][id]; else d[bucket][id] = raw;
      write(d); return true;
    },
    async save(id, old, value) {
      const next={...value,_finger:finger(value)}, raw=JSON.stringify(next);
      if (remote) return unique(SAVE,id,old || "",raw);
      const d=read(), current=Object.hasOwn(d.termine,id) ? d.termine[id] : null;
      if ((current || "")!==(old || "")) return 0;
      if (Object.entries(d.termine).some(([key,s])=>key!==id && finger(JSON.parse(s))===next._finger)) return -1;
      if (!current && Object.keys(d.termine).length>=5000) return -3;
      d.termine[id]=raw; write(d); return 1;
    },
    async import(entries) {
      if (!entries.length) return 0;
      const input=entries.map(e=>[e.id,JSON.stringify({...e,_finger:finger(e)})]);
      if (remote) return unique(IMPORT,JSON.stringify(input));
      const d=read(), ids=new Set(Object.keys(d.termine)), seen=new Set(Object.values(d.termine).map(s=>finger(JSON.parse(s)))), add=[];
      for (const [id,raw] of input) {
        const fp=JSON.parse(raw)._finger;
        if (!ids.has(id) && !seen.has(fp)) { add.push([id,raw]); ids.add(id); seen.add(fp); }
      }
      if (Object.keys(d.termine).length+add.length>5000) return -3;
      for (const [id,raw] of add) d.termine[id]=raw;
      if (add.length) write(d); return add.length;
    },
    async session(id, value, ttl) {
      if (value === undefined) {
        if (remote) { const raw = await cmd("GET", prefix + "s:" + id); return raw ? JSON.parse(raw) : null; }
        const s = sessions.get(id);
        if (!s || s.bis <= Date.now()) { sessions.delete(id); return null; } return s.value;
      }
      if (remote) return value === null ? cmd("DEL", prefix + "s:" + id) : cmd("SET", prefix + "s:" + id, JSON.stringify(value), "EX", ttl);
      if (value === null) sessions.delete(id); else sessions.set(id, { value, bis: Date.now() + ttl * 1000 });
    }
  };
}
module.exports = { kalenderSpeicher };
