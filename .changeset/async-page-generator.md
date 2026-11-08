---
"@quartz-community/types": minor
---

`PageGenerator` may return a promise of its virtual pages (`VirtualPage[] | Promise<VirtualPage[]>`): Quartz 5.1+ awaits it, so a page type can do async work (run the transformers, bundle with esbuild) in `generate` (jackyzha0/quartz#2575).
