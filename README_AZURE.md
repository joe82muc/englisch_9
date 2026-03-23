# App_Azure (ohne bestehende Dateien zu überschreiben)

Diese Azure-Version wurde separat in diesem Ordner angelegt.

## Enthalten
- backend/api/server.js (mit neuer Route POST /api/tts)
- unit3/vokabulary/vokabeltrainer.html (Azure-TTS-Fallback)
- unit4/vokabeltrainer.html (Azure-TTS-Fallback)
- .env.example

## Start
1. .env.example nach .env kopieren und AZURE_SPEECH_KEY eintragen.
2. AZURE_SPEECH_REGION auf westeurope lassen (oder anpassen).
3. Backend starten (wie bisher in deinem Projekt).
4. Vokabeltrainer testen: Lautsprecher-Button anklicken.

## Hinweis
- Reihenfolge Audio:
  1) Browser speechSynthesis
  2) Azure TTS (/api/tts)
  3) Google translate_tts (alter Fallback)
