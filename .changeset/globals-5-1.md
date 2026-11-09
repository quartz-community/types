---
"@quartz-community/types": patch
---

`globals.d.ts` declares `window.quartzStaticUrl` (absolute URL of the site's `static/` folder, for plugin assets) and `window.quartzPrefetch` (Quartz 5.1's prefetch cache, with the `PrefetchedPage` type), so client scripts can use them without their own declarations.
