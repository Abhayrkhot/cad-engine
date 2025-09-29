/* tslint:disable */
/* eslint-disable */
export function create_square(size: number): any;
export function create_triangle(base: number, height: number): any;
export function calculate_area(vertices: any): number;
export function calculate_perimeter(vertices: any): number;
export function calculate_centroid(vertices: any): any;
export function transform_polygon(vertices: any, matrix_data: any): any;
export function create_matrix(translate_x: number, translate_y: number, rotate_angle: number, scale_x: number, scale_y: number): any;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly create_square: (a: number) => any;
  readonly create_triangle: (a: number, b: number) => any;
  readonly calculate_area: (a: any) => number;
  readonly calculate_perimeter: (a: any) => number;
  readonly calculate_centroid: (a: any) => any;
  readonly transform_polygon: (a: any, b: any) => any;
  readonly create_matrix: (a: number, b: number, c: number, d: number, e: number) => any;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
