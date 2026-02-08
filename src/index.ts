// ============================================================================
// Core Component Types - The contract between Quartz and plugins
// ============================================================================

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

// ============================================================================
// Plugin Types - What Quartz expects from plugins
// ============================================================================

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

// ============================================================================
// Utility Types - Commonly used helper types
// ============================================================================

export type HTMLAttributes = Record<string, string | number | boolean | undefined>

export type EventHandler = (event: Event) => void

export type CleanupFunction = () => void

export type ClassValue = string | number | boolean | undefined | null | ClassValue[]
