import type { ContentIndex, FullSlug } from "./dist/index.js";

declare global {
  interface CustomEventMap {
    nav: CustomEvent<{ url: FullSlug }>;
    prenav: CustomEvent<undefined>;
    themechange: CustomEvent<{ theme: "light" | "dark" }>;
    readermodechange: CustomEvent<{ mode: "on" | "off" }>;
    render: CustomEvent<object>;
  }

  interface Document {
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => void,
    ): void;
    removeEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => void,
    ): void;
    dispatchEvent<K extends keyof CustomEventMap>(
      ev: CustomEventMap[K] | UIEvent,
    ): void;
  }

  /** A page fetched ahead by Quartz's prefetching (`url` is where it came from, after redirects). */
  interface PrefetchedPage {
    url: string;
    contentType: string;
    /** The HTML; missing when the link turned out not to be a page. */
    text?: string;
  }

  interface Window {
    addCleanup(fn: (...args: unknown[]) => void): void;
    spaNavigate?(url: URL, isBack: boolean): Promise<void>;
    /**
     * Absolute URL of the site's `static/` folder (ends in `/`), valid across SPA navigations.
     * Plugin assets shipped with `externalResources().assets` live under `static/plugins/<to>`.
     */
    quartzStaticUrl?: string;
    /**
     * Quartz 5.1+, unless `configuration.prefetch` is "off": the page at `url` from the prefetch
     * cache, or fetched now and kept (undefined if it could not be fetched). Use it instead of
     * `fetch()` when a script loads another page of the site, so it is fetched once.
     */
    quartzPrefetch?: {
      load(url: URL): Promise<PrefetchedPage | undefined>;
    };
  }

  const fetchData: Promise<ContentIndex>;
}
