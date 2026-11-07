import type { Root as HtmlRoot } from "hast";
import type { Root as MdRoot } from "mdast";
import type { Data, VFile } from "vfile";
import type { PluggableList } from "unified";

// ============================================================================
// Path Types - Branded string types for type-safe file paths
// ============================================================================

export type FilePath = string & { _brand: "FilePath" };
export type FullSlug = string & { _brand: "FullSlug" };
export type SimpleSlug = string & { _brand: "SimpleSlug" };

export function joinSegments(...segments: string[]): FilePath {
  return segments
    .filter((segment) => segment.length > 0)
    .join("/")
    .replace(/\/+/g, "/") as FilePath;
}

// ============================================================================
// Resource Types - CSS/JS resources that plugins can inject
// ============================================================================

export type JSResource =
  | {
      loadTime: "beforeDOMReady" | "afterDOMReady";
      moduleType?: "module";
      spaPreserve?: boolean;
      src: string;
      contentType: "external";
    }
  | {
      loadTime: "beforeDOMReady" | "afterDOMReady";
      moduleType?: "module";
      spaPreserve?: boolean;
      script: string;
      contentType: "inline";
    };

export type CSSResource = {
  content: string;
  inline?: boolean;
  spaPreserve?: boolean;
};

/**
 * A file or directory a plugin ships with the site (Quartz 5.1+), copied to
 * `<output>/static/plugins/<to>`. Client scripts get its URL from `window.quartzStaticUrl`:
 * `new URL("plugins/<to>/…", window.quartzStaticUrl)`. Use it for large or optional client code
 * (loaded with `import()` only where needed) instead of inline scripts, which every page
 * downloads. Older Quartz versions ignore `assets` and leave `quartzStaticUrl` undefined.
 */
export interface StaticAsset {
  /** Absolute path of a file or directory on disk (e.g. resolved from a dependency). */
  from: string;
  /** Destination below `static/plugins/`, e.g. "my-plugin/vendor". */
  to: string;
}

export interface StaticResources {
  css: CSSResource[];
  js: JSResource[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  additionalHead: any[];
  /** Files copied into the site output (Quartz 5.1+). See StaticAsset. */
  assets?: StaticAsset[];
}

// ============================================================================
// Config Types - Quartz configuration
// ============================================================================

/**
 * Flat configuration object that components receive as `cfg` prop.
 * This matches Quartz's `GlobalConfiguration` — the resolved config
 * passed to components at render time (i.e. `ctx.cfg.configuration`).
 */
export interface GlobalConfiguration {
  pageTitle?: string;
  pageTitleSuffix?: string;
  enableSPA?: boolean;
  enablePopovers?: boolean;
  analytics?: unknown;
  ignorePatterns?: string[];
  defaultDateType?: string;
  baseUrl?: string;
  theme?: unknown;
  locale?: string;
  /** Built-in frontmatter parsing (Quartz 5.1+). */
  frontmatter?: BuiltinFrontmatterConfig | boolean;
  /** Built-in link processing, formerly crawl-links (Quartz 5.1+). */
  links?: BuiltinLinksConfig | boolean;
  /** Built-in draft handling, formerly remove-draft (Quartz 5.1+). */
  drafts?: BuiltinDraftsConfig | boolean;
  /** Built-in content index / sitemap / RSS, formerly content-index (Quartz 5.1+). */
  contentIndex?: BuiltinContentIndexConfig | boolean;
}

interface BuiltinToggle {
  enabled?: boolean;
  order?: number;
}

export interface BuiltinFrontmatterConfig extends BuiltinToggle {
  delimiters?: string | [string, string];
  language?: "yaml" | "toml";
}

export interface BuiltinLinksConfig extends BuiltinToggle {
  markdownLinkResolution?: "absolute" | "relative" | "shortest";
  prettyLinks?: boolean;
  openLinksInNewTab?: boolean;
  lazyLoad?: boolean;
  externalLinkIcon?: boolean;
  disableBrokenWikilinks?: boolean;
}

export interface BuiltinDraftsConfig extends BuiltinToggle {
  publish?: boolean;
}

export interface BuiltinContentIndexConfig extends BuiltinToggle {
  enableSiteMap?: boolean;
  enableRSS?: boolean;
  rssLimit?: number;
  rssFullHtml?: boolean;
  rssSlug?: string;
  includeEmptyFiles?: boolean;
}

/**
 * Full Quartz config with nested `configuration` property.
 * This is what `BuildCtx.cfg` holds — used in plugin hooks
 * (transformers, filters, emitters), NOT in component props.
 */
export interface QuartzConfig {
  configuration: GlobalConfiguration;
  plugins?: unknown;
  externalPlugins?: unknown;
}

// ============================================================================
// Context Types - Build context passed to plugin hooks
// ============================================================================

export interface Argv {
  directory: string;
  verbose: boolean;
  output: string;
  serve: boolean;
  watch: boolean;
  port: number;
  wsPort: number;
  remoteDevHost?: string;
  concurrency?: number;
}

export interface BuildCtx {
  buildId: string;
  argv: Argv;
  cfg: QuartzConfig;
  allSlugs: FullSlug[];
  allFiles: FilePath[];
  incremental: boolean;
  /**
   * The site's content index (Quartz 5.1+): one entry per published page, virtual pages
   * included. Available to emitters (except ComponentResources / PageTypeDispatcher); read-only.
   */
  contentIndex?: ReadonlyMap<FullSlug, Readonly<ContentDetails>>;
}

// ============================================================================
// VFile Types - Content data types
// ============================================================================

export type QuartzPluginData = Data;
export type MarkdownContent = [MdRoot, VFile];
export type ProcessedContent = [HtmlRoot, VFile];

// ============================================================================
// Core Component Types - The contract between Quartz and plugins
// ============================================================================

export type QuartzComponentProps = {
  ctx: unknown;
  externalResources: StaticResources;
  fileData: QuartzPluginData & Record<string, unknown>;
  cfg: GlobalConfiguration;
  children: unknown;
  tree: unknown;
  allFiles: (QuartzPluginData & Record<string, unknown>)[];
  displayClass?: "mobile-only" | "desktop-only";
  [key: string]: unknown;
};

export type QuartzComponent = ((props: QuartzComponentProps) => unknown) & {
  css?: string | string[] | undefined;
  beforeDOMLoaded?: string | string[] | undefined;
  afterDOMLoaded?: string | string[] | undefined;
};

export type QuartzComponentConstructor<
  Options extends object | undefined = undefined,
> = (opts?: Options) => QuartzComponent;

export type StringResource = string | string[];

// ============================================================================
// Plugin Types - What Quartz expects from plugins
// ============================================================================

type OptionType = object | undefined;
type ExternalResourcesFn = (
  ctx: BuildCtx,
) => Partial<StaticResources> | undefined;

export type { ExternalResourcesFn };

export interface PluginTypes {
  transformers: QuartzTransformerPluginInstance[];
  filters: QuartzFilterPluginInstance[];
  emitters: QuartzEmitterPluginInstance[];
  pageTypes: QuartzPageTypePluginInstance[];
}

export type QuartzTransformerPlugin<Options extends OptionType = undefined> = (
  opts?: Options,
) => QuartzTransformerPluginInstance;

/**
 * Optional hook on every plugin instance (Quartz 5.1+): extra JSON-serialisable fields for a page's
 * entry in `static/contentIndex.json`. Core fields cannot be overridden; on key collisions between
 * plugins the first (in plugin order) wins.
 */
export type ContentIndexExtension = (args: {
  ctx: BuildCtx;
  fileData: QuartzPluginData;
  entry: Readonly<ContentDetails>;
}) => Record<string, unknown> | undefined | void;

interface PluginHooks {
  extendContentIndex?: ContentIndexExtension;
}

export type QuartzTransformerPluginInstance = PluginHooks & {
  name: string;
  textTransform?: (ctx: BuildCtx, src: string) => string;
  markdownPlugins?: (ctx: BuildCtx) => PluggableList;
  htmlPlugins?: (ctx: BuildCtx) => PluggableList;
  externalResources?: ExternalResourcesFn;
};

export type QuartzFilterPlugin<Options extends OptionType = undefined> = (
  opts?: Options,
) => QuartzFilterPluginInstance;

export type QuartzFilterPluginInstance = PluginHooks & {
  name: string;
  shouldPublish(ctx: BuildCtx, content: ProcessedContent): boolean;
};

export type ChangeEvent = {
  type: "add" | "change" | "delete";
  path: FilePath;
  file?: VFile;
};

export type QuartzEmitterPlugin<Options extends OptionType = undefined> = (
  opts?: Options,
) => QuartzEmitterPluginInstance;

export type QuartzEmitterPluginInstance = PluginHooks & {
  name: string;
  emit: (
    ctx: BuildCtx,
    content: ProcessedContent[],
    resources: StaticResources,
  ) => Promise<FilePath[]> | AsyncGenerator<FilePath>;
  partialEmit?: (
    ctx: BuildCtx,
    content: ProcessedContent[],
    resources: StaticResources,
    changeEvents: ChangeEvent[],
  ) => Promise<FilePath[]> | AsyncGenerator<FilePath> | null;
  getQuartzComponents?: (ctx: BuildCtx) => QuartzComponent[];
  externalResources?: ExternalResourcesFn;
};

// ============================================================================
// PageType Plugin Types - Declarative page rendering plugins
// ============================================================================

/**
 * Matcher function: determines if a source file belongs to a page type.
 * Returns true if the page type should own this file.
 */
export type PageMatcher = (args: {
  slug: FullSlug;
  fileData: QuartzPluginData & Record<string, unknown>;
  cfg: GlobalConfiguration;
}) => boolean;

/**
 * Virtual page descriptor for page types that generate pages
 * from aggregated data (e.g., tag indexes, folder listings).
 */
export interface VirtualPage {
  slug: FullSlug;
  title: string;
  data: Partial<QuartzPluginData> & Record<string, unknown>;
}

/**
 * Generator function: produces virtual pages from all processed content.
 * Used by page types that don't match source files but instead create
 * synthetic pages (e.g., one page per tag, one page per folder).
 */
export type PageGenerator = (args: {
  content: ProcessedContent[];
  cfg: GlobalConfiguration;
  ctx: BuildCtx;
}) => VirtualPage[];

/** A function that mutates a HAST tree at render time, when allFiles is available. */
export type TreeTransform = (
  root: HtmlRoot,
  slug: FullSlug,
  componentData: QuartzComponentProps,
) => void;

/**
 * A PageType plugin definition.
 *
 * PageTypes are a declarative abstraction over page-rendering emitters.
 * Each PageType declares which files it owns (via `match`), optionally
 * generates virtual pages (via `generate`), and provides a body component
 * and layout reference for rendering.
 */
export type QuartzPageTypePlugin<Options extends OptionType = undefined> = (
  opts?: Options,
) => QuartzPageTypePluginInstance;

export type QuartzPageTypePluginInstance = PluginHooks & {
  name: string;
  /** Higher priority wins when multiple page types match the same file. Default: 0. */
  priority?: number;
  /** File extensions this page type handles (e.g. [".canvas"]). Files with these extensions are excluded from the default asset emitter and processed by generate() instead. */
  fileExtensions?: string[];
  /** Determines which source files this page type owns. */
  match: PageMatcher;
  /** Produces virtual pages from aggregated content data. */
  generate?: PageGenerator;
  /** Layout key — references a key in `layout.byPageType`. */
  layout: string;
  /** Optional page frame name (e.g. "default", "full-width", "canvas"). Defaults to "default". */
  frame?: string;
  /** The body component constructor for this page type. */
  body: QuartzComponentConstructor;
  /** Optional render-time HAST tree transforms (e.g. resolving inline codeblocks). */
  treeTransforms?: (ctx: BuildCtx) => TreeTransform[];
};

// ============================================================================
// PageFrame Types — Custom page layout frames
// ============================================================================

/**
 * Props passed to a PageFrame's render function.
 * Contains the resolved layout components and the shared component data.
 */
export interface PageFrameProps {
  /** Component data shared across all components on the page */
  componentData: QuartzComponentProps;
  /** The Head component (rendered in <head>) — NOT used by frames, included for completeness */
  head: QuartzComponent;
  /** Header slot components (rendered inside <header>) */
  header: QuartzComponent[];
  /** Components rendered before the page body */
  beforeBody: QuartzComponent[];
  /** The page body component (Content) */
  pageBody: QuartzComponent;
  /** Components rendered after the page body */
  afterBody: QuartzComponent[];
  /** Left sidebar components */
  left: QuartzComponent[];
  /** Right sidebar components */
  right: QuartzComponent[];
  /** Footer components */
  footer: QuartzComponent[];
}

/**
 * A PageFrame defines the inner HTML structure of a page inside the
 * `<div id="quartz-root">` shell. Different frames can produce completely
 * different layouts (e.g. with/without sidebars, horizontal scroll, etc.)
 * while the outer shell (html, head, body, quartz-root) remains stable
 * for SPA navigation.
 *
 * The `render` function returns `unknown` to avoid coupling to a specific
 * JSX runtime (Preact, React, etc.). Quartz core casts this to JSX.Element.
 */
export interface PageFrame {
  /** Unique name for this frame (e.g. "default", "full-width", "canvas") */
  name: string;
  /** Render the inner page structure. Returns a JSX tree to be placed inside Body > #quartz-body. */
  render: (props: PageFrameProps) => unknown;
  /** Optional CSS string to include when this frame is active */
  css?: string;
}

export type HTMLAttributes = Record<
  string,
  string | number | boolean | undefined
>;

export type EventHandler = (event: Event) => void;

export type CleanupFunction = () => void;

export type ClassValue =
  string | number | boolean | undefined | null | ClassValue[];

// ============================================================================
// Content Index Types - Data shape for contentIndex.json
// ============================================================================

export type ContentDetails = {
  slug: FullSlug;
  filePath: FilePath;
  title: string;
  links: string[];
  tags: string[];
  content: string;
  richContent?: string;
  date?: Date;
  description?: string;
  /** Fields added by plugins through `extendContentIndex` (Quartz 5.1+). */
  [extra: string]: unknown;
};

export type ContentIndex = Record<FullSlug, ContentDetails>;

// ============================================================================
// Sort & Theme Types
// ============================================================================

export type SortFn = (f1: QuartzPluginData, f2: QuartzPluginData) => number;

export type ThemeKey = "lightMode" | "darkMode";

export type ValidDateType = "created" | "modified" | "published";

// ============================================================================
// VFile DataMap Augmentation — canonical vfile shape for Quartz
// ============================================================================

declare module "vfile" {
  interface DataMap {
    slug: FullSlug;
    filePath: FilePath;
    relativePath: FilePath;
    description: string;
    text: string;
    links: SimpleSlug[];
    toc: { depth: number; text: string; slug: string }[];
    collapseToc: boolean;
    blocks: Record<string, import("hast").Element>;
    htmlAst: import("hast").Root;
    hasMermaidDiagram: boolean | undefined;
    frontmatter: { [key: string]: unknown } & {
      title: string;
    } & Partial<{
        tags: string[];
        aliases: string[];
        modified: string;
        created: string;
        published: string;
        description: string;
        socialDescription: string;
        publish: boolean | string;
        draft: boolean | string;
        lang: string;
        enableToc: string;
        cssclasses: string[];
        socialImage: string;
        comments: boolean | string;
      }>;
    dates: {
      created: Date;
      modified: Date;
      published: Date;
    };
    defaultDateType?: ValidDateType;
  }
}
