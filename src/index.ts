// Component Types
export type QuartzComponentProps = {
  ctx: any
  externalResources: any
  fileData: any
  cfg: any
  children: any
  tree: any
  allFiles: any[]
  displayClass?: "mobile-only" | "desktop-only"
} & Record<string, any>

export type QuartzComponent = ((props: QuartzComponentProps) => any) & {
  css?: string | string[] | undefined
  beforeDOMLoaded?: string | string[] | undefined
  afterDOMLoaded?: string | string[] | undefined
}

export type QuartzComponentConstructor<Options extends object | undefined = undefined> = (
  opts?: Options,
) => QuartzComponent

export type StringResource = string | string[]

// Plugin Types
export interface QuartzTransformerPluginInstance {
  name: string
  markdownPlugins?: () => any[]
  htmlPlugins?: () => any[]
  textTransform?: (ctx: any, text: string) => string
}

export type QuartzTransformerPlugin<Options = undefined> = (
  opts: Options,
) => QuartzTransformerPluginInstance

export interface QuartzFilterPluginInstance {
  name: string
  shouldPublish?: (ctx: any, file: any) => boolean
}

export type QuartzFilterPlugin<Options = undefined> = (opts: Options) => QuartzFilterPluginInstance

export interface QuartzEmitterPluginInstance {
  name: string
  emit?: (ctx: any, content: any[]) => Promise<any[]>
  getDependencies?: (ctx: any, content: any[]) => Promise<string[]>
}

export type QuartzEmitterPlugin<Options = undefined> = (opts: Options) => QuartzEmitterPluginInstance

// Data Types
export interface FileTrieNode {
  slugSegments: string[]
  data: any | null
  children: FileTrieNode[]
  isFolder: boolean
  fileSegmentHint?: string
}

export interface FileTrieConfig {
  sortFn?: (a: FileTrieNode, b: FileTrieNode) => number
  filterFn?: (node: FileTrieNode) => boolean
  mapFn?: (node: FileTrieNode) => void
  order?: Array<"filter" | "map" | "sort">
}

export interface ContentIndexEntry {
  slug: string
  filePath: string
  title: string
  content: string
  tags: string[]
  links: string[]
}

export type ContentIndex = Record<string, ContentIndexEntry>

// Component Options
export interface ComponentOptions {
  title?: string
}

export interface ExplorerOptions extends ComponentOptions {
  folderDefaultState: "collapsed" | "open"
  folderClickBehavior: "collapse" | "link"
  useSavedState: boolean
  sortFn?: (a: FileTrieNode, b: FileTrieNode) => number
  filterFn?: (node: FileTrieNode) => boolean
  mapFn?: (node: FileTrieNode) => void
  order?: Array<"filter" | "map" | "sort">
}

export interface D3Config {
  drag: boolean
  zoom: boolean
  depth: number
  scale: number
  repelForce: number
  centerForce: number
  linkDistance: number
  fontSize: number
  opacityScale: number
  removeTags: string[]
  showTags: boolean
  focusOnHover?: boolean
  enableRadial?: boolean
}

export interface GraphOptions {
  localGraph?: Partial<D3Config>
  globalGraph?: Partial<D3Config>
}

export interface SearchOptions extends ComponentOptions {
  enablePreview: boolean
}

// Utility Types
export type HTMLAttributes = Record<string, string | number | boolean | undefined>

export type EventHandler = (event: Event) => void

export type CleanupFunction = () => void

export type ClassValue = string | number | boolean | undefined | null | ClassValue[]
