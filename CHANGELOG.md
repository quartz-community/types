# @quartz-community/types

## 1.2.0

### Minor Changes

- 19f09ca: `PageGenerator` may return a promise of its virtual pages (`VirtualPage[] | Promise<VirtualPage[]>`): Quartz 5.1+ awaits it, so a page type can do async work (run the transformers, bundle with esbuild) in `generate` (jackyzha0/quartz#2575).

## 1.1.0

### Minor Changes

- 0158888: Types for Quartz's built-in processing: `GlobalConfiguration.frontmatter` / `links` / `drafts` / `contentIndex`, and the optional `extendContentIndex` hook on plugin instances that adds fields to `contentIndex.json` entries (`ContentDetails` now allows extra fields). `BuildCtx.contentIndex` types the shared content index emitters can reuse.
- 897233c: `PageFrameProps.sidebars` and `SidebarMode`: the sidebar modes from `layout.sidebars` (Quartz 5.1+), for custom frames to put on their sidebar elements as `data-sidebar-mode`.
- f5f6d5f: `StaticResources.assets` (`StaticAsset { from, to }`): files or directories a plugin ships with the site, copied by Quartz 5.1+ to `static/plugins/<to>` and addressed from client scripts via `window.quartzStaticUrl`.

## 1.0.0

### Major Changes

- Stable 1.0 release. All `@quartz-community/*` dependencies now use `^1.0.0` ranges.

  Pre-1.0 caret ranges pinned the minor version (`^0.2.1` means `>=0.2.1 <0.3.0`), so
  published fixes to shared packages could never be resolved by dependents. Moving the
  ecosystem to 1.0 makes caret ranges behave conventionally.

## 0.3.0

### Minor Changes

- 201e021: Update `PageFrameProps.footer` from `QuartzComponent` to `QuartzComponent[]` to support configurable footer positioning in the unified layout slot architecture.
