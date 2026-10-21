export interface ModuleOptions { locale?: string; messages?: Record<string,string>; timeZone?: string; onRetry?: () => void; dir?: 'ltr'|'rtl'; headingLevel?: 2|3|4; title?: string; }
export interface Resource { id: string; title: string; description?: string; owner: string; type: string; updatedAt: string; }
export interface Options extends ModuleOptions { onOpen?: (item: Resource) => void; }
export interface View { query: string; sort: 'newest'|'alphabetical'; view: 'cards'|'list'|'table'; grid?: import('./index.js').GridView | null; }
export interface Controller { getView(): View; restoreView(view: View): void; setState(state: 'content'|'loading'|'refreshing'|'empty'|'error'|'partial'|'cancelled', message?: string): void; getState(): string; load(loader: (signal: AbortSignal) => Promise<{outcome: 'success'|'partial';items: Resource[];message?: string}>): Promise<boolean>; cancel(): void; element: HTMLElement; getSnapshot(): {items: Resource[]; query: string; sort: 'newest'|'alphabetical'; view: 'cards'|'list'|'table';}; update(items: Resource[]): void; destroy(): void; }
export function validateResources(input: unknown): Resource[];
export function mountResources(host: HTMLElement, items: Resource[], options?: Options): Controller;
