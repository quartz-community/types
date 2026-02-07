/**
 * Core type definitions for Quartz community plugins
 * These types mirror the internal Quartz types but are available as a standalone package
 * to avoid circular dependencies and version conflicts.
 */

// ============================================================================
// Component Types
// ============================================================================

/**
 * Props passed to Quartz components during rendering
 */
export interface QuartzComponentProps {
  /** Quartz context object */
  ctx: any;
  /** Data about the current file being rendered */
  fileData: any;
  /** Global Quartz configuration */
  cfg: any;
  /** Layout configuration */
  layout: any;
  /** File tree for navigation components */
  tree: any;
  /** All files in the site */
  allFiles: any;
}

/**
 * Function type for Quartz components
 */
export type QuartzComponentFunction = (props: QuartzComponentProps) => any;

/**
 * A Quartz component with optional CSS and scripts
 */
export interface QuartzComponent extends QuartzComponentFunction {
  /** CSS styles to inject into the page */
  css?: string;
  /** Script to run after DOM is loaded */
  afterDOMLoaded?: string;
  /** Script to run before DOM is loaded */
  beforeDOMLoaded?: string;
}

/**
 * Resource that can be a single string or array of strings
 */
export type StringResource = string | string[];

// ============================================================================
// Plugin Types
// ============================================================================

/**
 * Transformer plugin that modifies markdown/HTML content
 */
export interface QuartzTransformerPluginInstance {
  name: string;
  /** Markdown processing plugins */
  markdownPlugins?: () => any[];
  /** HTML processing plugins */
  htmlPlugins?: () => any[];
  /** Text transformation function */
  textTransform?: (ctx: any, text: string) => string;
}

export type QuartzTransformerPlugin<Options = undefined> = (
  opts: Options,
) => QuartzTransformerPluginInstance;

/**
 * Filter plugin that determines which files to publish
 */
export interface QuartzFilterPluginInstance {
  name: string;
  /** Returns true if file should be published */
  shouldPublish?: (ctx: any, file: any) => boolean;
}

export type QuartzFilterPlugin<Options = undefined> = (
  opts: Options,
) => QuartzFilterPluginInstance;

/**
 * Emitter plugin that generates output files
 */
export interface QuartzEmitterPluginInstance {
  name: string;
  /** Emit files to the output directory */
  emit?: (ctx: any, content: any[]) => Promise<any[]>;
  /** Get dependencies for incremental builds */
  getDependencies?: (ctx: any, content: any[]) => Promise<string[]>;
}

export type QuartzEmitterPlugin<Options = undefined> = (
  opts: Options,
) => QuartzEmitterPluginInstance;

// ============================================================================
// File/Data Types
// ============================================================================

/**
 * Node in the file tree (used by Explorer component)
 */
export interface FileTrieNode {
  /** URL slug segments */
  slugSegments: string[];
  /** File data object */
  data: any | null;
  /** Child nodes */
  children: FileTrieNode[];
  /** Whether this is a folder */
  isFolder: boolean;
  /** File segment hint for display */
  fileSegmentHint?: string;
}

/**
 * Configuration for file tree operations
 */
export interface FileTrieConfig {
  /** Sort function for entries */
  sortFn?: (a: FileTrieNode, b: FileTrieNode) => number;
  /** Filter function for entries */
  filterFn?: (node: FileTrieNode) => boolean;
  /** Map function for transforming entries */
  mapFn?: (node: FileTrieNode) => void;
  /** Order of operations: filter, map, sort */
  order?: Array<"filter" | "map" | "sort">;
}

/**
 * Content index entry
 */
export interface ContentIndexEntry {
  slug: string;
  filePath: string;
  title: string;
  content: string;
  tags: string[];
  links: string[];
}

/**
 * Full content index
 */
export type ContentIndex = Record<string, ContentIndexEntry>;

// ============================================================================
// Component Option Types
// ============================================================================

/**
 * Common options for all component factory functions
 */
export interface ComponentOptions {
  /** Component title/label */
  title?: string;
}

/**
 * Explorer component options
 */
export interface ExplorerOptions extends ComponentOptions {
  /** Default state for folders: "collapsed" or "open" */
  folderDefaultState: "collapsed" | "open";
  /** Behavior when clicking folders: "collapse" or "link" */
  folderClickBehavior: "collapse" | "link";
  /** Whether to persist folder state in localStorage */
  useSavedState: boolean;
  /** Custom sort function */
  sortFn?: (a: FileTrieNode, b: FileTrieNode) => number;
  /** Custom filter function */
  filterFn?: (node: FileTrieNode) => boolean;
  /** Custom map function */
  mapFn?: (node: FileTrieNode) => void;
  /** Order of operations */
  order?: Array<"filter" | "map" | "sort">;
}

/**
 * D3 graph configuration
 */
export interface D3Config {
  /** Enable node dragging */
  drag: boolean;
  /** Enable zooming */
  zoom: boolean;
  /** Depth of connections (-1 for all) */
  depth: number;
  /** Scale factor */
  scale: number;
  /** Repelling force strength */
  repelForce: number;
  /** Center force strength */
  centerForce: number;
  /** Distance between linked nodes */
  linkDistance: number;
  /** Label font size */
  fontSize: number;
  /** Opacity multiplier */
  opacityScale: number;
  /** Tags to exclude */
  removeTags: string[];
  /** Show tags as nodes */
  showTags: boolean;
  /** Dim non-hovered nodes */
  focusOnHover?: boolean;
  /** Enable radial layout */
  enableRadial?: boolean;
}

/**
 * Graph component options
 */
export interface GraphOptions {
  /** Local page graph configuration */
  localGraph?: Partial<D3Config>;
  /** Global site graph configuration */
  globalGraph?: Partial<D3Config>;
}

/**
 * Search component options
 */
export interface SearchOptions extends ComponentOptions {
  /** Enable content preview panel */
  enablePreview?: boolean;
  /** Custom placeholder text */
  placeholder?: string;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * HTML attributes for components
 */
export interface HTMLAttributes {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Event handler type
 */
export type EventHandler = (event: Event) => void;

/**
 * Cleanup function returned by event listeners
 */
export type CleanupFunction = () => void;

/**
 * Class name value (for classNames utility)
 */
export type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | ClassValue[];
