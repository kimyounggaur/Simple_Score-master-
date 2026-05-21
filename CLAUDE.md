# Harmony AI Session Rules

- Product: a web score editor that lets users start composing in seconds.
- Stack: Next.js 15 App Router, React 19, TypeScript strict, Tailwind, Zustand, VexFlow adapter layer, Tone/Web Audio, Supabase, IndexedDB.
- Never store screen coordinates in semantic score data.
- Every edit must be represented as a `ScoreOperation` and logged.
- MusicXML is import/export only.
