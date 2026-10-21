import type {IconOptions} from './index.js';
export type IconHandle = {element: SVGSVGElement; destroy(): void};
export declare function svg(options?: IconOptions): string;
export declare function mount(host: string | Element, options?: IconOptions): IconHandle;
declare const icon: Readonly<{svg: typeof svg; mount: typeof mount}>;
export default icon;
export declare const MuhitIcons: Readonly<{names: readonly string[]; svg(name: string, options?: IconOptions): string; mount(host: string | Element,name: string,options?: IconOptions): IconHandle}>;
