export interface ModuleOptions { locale?: string; messages?: Record<string,string>; timeZone?: string; onRetry?: () => void; dir?: 'ltr'|'rtl'; headingLevel?: 2|3|4; title?: string; }
export interface Activity { id: string; title: string; description?: string; actor: string; type: string; createdAt: string; }
export interface Options extends ModuleOptions {  }
export interface View { query: string; type: string; }
export interface Controller { getView(): View; restoreView(view: View): void; setState(state: 'content'|'loading'|'refreshing'|'empty'|'error'|'partial'|'cancelled', message?: string): void; getState(): string; load(loader: (signal: AbortSignal) => Promise<{outcome: 'success'|'partial';items: Activity[];message?: string}>): Promise<boolean>; cancel(): void; element: HTMLElement; getSnapshot(): {items: Activity[]; query: string; type: string;}; update(items: Activity[]): void; destroy(): void; }
export function validateActivity(input: unknown): Activity[];
export function mountActivity(host: HTMLElement, items: Activity[], options?: Options): Controller;
