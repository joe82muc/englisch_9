"use strict";
const fs = require("node:fs");
const path = require("node:path");

// Compare-and-set prevents two server instances from overwriting the same edit.
const CAS = "local old=redis.call('HGET',KEYS[1],ARGV[1]); if (old or '')~=ARGV[2] then return 0 end; if ARGV[3]=='' then redis.call('HDEL',KEYS[1],ARGV[1]) else redis.call('HSET',KEYS[1],ARGV[1],ARGV[3]) end; return 1";
const IMPORT = "local n=0; for i=1,#ARGV,2 do n=n+redis.call('HSETNX',KEYS[1],ARGV[i],ARGV[i+1]) end; return n";

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
    async import(entries) {
      if (!entries.length) return 0;
      if (remote) return Number(await cmd("EVAL", IMPORT, 1, prefix + "termine", ...entries.flatMap((e) => [e.id, JSON.stringify(e)])));
      const d = read(); let n = 0;
      for (const e of entries) if (!d.termine[e.id]) { d.termine[e.id] = JSON.stringify(e); n++; }
      write(d); return n;
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
