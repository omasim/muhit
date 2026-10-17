/** Muhit UI 0.7.0. Rendering methods require a browser DOM; importing does not. */
export type Host = Element | string;
export type TableStatus = "planned" | "active" | "review" | "complete";
export interface TableRow {
  id: string;
  title: string;
  status: TableStatus;
  owner?: string;
  theme?: string;
  note?: string;
  next?: string;
  initials?: string;
  /** Empty string or a real YYYY-MM-DD date. */
  updated?: string;
}
export type NormalizedTableRow = Required<TableRow>;
export interface TableOptions {
  title?: string;
  description?: string;
  rows?: TableRow[];
  demo?: boolean;
  /** Show design guidance and integration code. Default: false. */
  showGuidance?: boolean;
  onChange?: (
    rows: NormalizedTableRow[],
    reason: "bulk-status" | "undo-status",
  ) => void;
}
export interface TableInstance {
  setRows(rows: TableRow[]): TableInstance;
  getRows(): NormalizedTableRow[];
  destroy(): void;
}
export const Muhit: Readonly<{
  /** Returns only the library's fixed SVG markup; unknown names use the grid icon. */
  icon(name: string): string;
  /** duration is milliseconds; 0 means manual dismissal. Default: 7000. */
  toast(
    message: string,
    options?: { container?: Element; duration?: number },
  ): void;
  openDialog(dialog: HTMLDialogElement): void;
  closeDialog(dialog: HTMLDialogElement | null | undefined): void;
}>;
export const MuhitTable: Readonly<{
  mount(host: Host, options?: TableOptions): TableInstance;
}>;
export type ChartPeriod = 6 | 12;
export interface ChartRow {
  date?: string;
  month?: string;
  shortMonth?: string;
  sources: number;
  actions: number;
  connections: number;
  categories?: number[];
  types?: number[];
}
export interface ChartGroup {
  name: string;
  value: number;
}
export interface ChartInput {
  rows: ChartRow[];
  period?: ChartPeriod;
  year?: string | number;
  label?: string;
  source?: string;
  isExample?: boolean;
  categories?: ChartGroup[];
  types?: ChartGroup[];
}
export interface ChartData {
  period: ChartPeriod;
  year: string;
  label: string;
  source: string;
  isExample: boolean;
  rows: (ChartRow & { date: string; month: string; shortMonth: string })[];
  totals: { sources: number; actions: number; connections: number };
  categories: ChartGroup[];
  types: ChartGroup[];
}
export type ChartExampleData = Omit<ChartData, "year"> & { year: number };
export interface ChartOptions {
  getData?: (period: ChartPeriod) => ChartInput | Promise<ChartInput>;
  initialPeriod?: ChartPeriod;
  /** false hides interactive period controls for a fixed snapshot. Default: true. */
  periodControl?: boolean;
  /** Show integration code below the data source. Default: false. */
  showGuidance?: boolean;
  onPeriodChange?: (period: ChartPeriod) => void;
}
export interface ChartInstance {
  /** Null for empty/error/stale requests or an already destroyed instance. */
  refresh(): Promise<ChartData | null>;
  setData(data: ChartInput): Promise<ChartData | null>;
  getData(): ChartData | null;
  destroy(): void;
}
export interface ChartScale {
  min: number;
  max: number;
  step: number;
  ticks: number[];
}
export const MuhitCharts: {
  mount(host: Host, options?: ChartOptions): ChartInstance;
  getExampleData(period?: ChartPeriod): ChartExampleData;
  normalizeData(input: ChartInput, period?: ChartPeriod): ChartData;
  niceScale(values: number[]): ChartScale;
  linePoints(
    values: number[],
    bounds: { x: number; y: number; width: number; height: number },
    maximum: number,
  ): { x: number; y: number; value: number }[];
  toCSV(input: ChartInput): string;
};
export interface ThemeConfig {
  cardSurface: "plain" | "tinted" | "outline";
  layoutGap: "compact" | "balanced" | "airy";
  tableRows: "plain" | "striped";
  tableHeader: "static" | "sticky";
  version: 1;
  preset:
    "grove" | "clay" | "tide" | "atelier" | "sand" | "moss" | "plum" | "slate";
  mode: "light" | "dark";
  accent: null | string;
  font: "editorial" | "humanist" | "system" | "book";
  density: "comfortable" | "compact" | "spacious";
  radius: "soft" | "round" | "square" | "organic";
  scale: 1 | 1.125 | 1.25;
  motion: "system" | "reduced";
  border: "subtle" | "strong";
  elevation: "flat" | "soft" | "raised";
  buttonStyle: "solid" | "soft" | "outline";
  controlSize: "sm" | "md" | "lg";
  headingScale: 0.9 | 1 | 1.15;
  lineHeight: 1.45 | 1.65 | 1.85;
  contentWidth: "focused" | "balanced" | "wide";
  borderWidth: 1 | 2;
  iconWeight: 1.25 | 1.5 | 2;
  accentIntensity: "soft" | "balanced" | "vivid";
  chartPalette: "natural" | "contrast" | "mono";
}
export interface ThemePreset {
  readonly id: ThemeConfig["preset"];
  readonly name: string;
  readonly description: string;
  readonly colors: Readonly<{
    accent: string;
    background: string;
    surface: string;
    text: string;
    secondary: string;
    tertiary: string;
  }>;
}
export interface ThemeResolution {
  readonly config: Readonly<ThemeConfig>;
  readonly tokens: Readonly<Record<string, string>>;
}
export interface ContrastCheck {
  id: string;
  label: string;
  ratio: number;
  minimum: number;
  pass: boolean;
}
export const MuhitTheme: Readonly<{
  version: string;
  presets: readonly ThemePreset[];
  defaults: Readonly<ThemeConfig>;
  normalizeConfig(input?: Partial<ThemeConfig>): Readonly<ThemeConfig>;
  resolve(input?: Partial<ThemeConfig>): ThemeResolution;
  apply(input?: Partial<ThemeConfig>, root?: HTMLElement): ThemeResolution;
  contrast(firstHex: string, secondHex: string): number;
  audit(input?: Partial<ThemeConfig>): readonly Readonly<ContrastCheck>[];
  toCSS(input?: Partial<ThemeConfig>): string;
  toJSON(input?: Partial<ThemeConfig>): string;
  fromJSON(json: string): Readonly<ThemeConfig>;
}>;
export interface AgentCard {
  variant?: "default" | "horizontal" | "sage" | "ink";
  state?: "default" | "selected" | "disabled" | "loading" | "error";
  meta?: string;
  type: "card";
  id: string;
  title: string;
  description?: string;
  action?: { id: string; label: string };
}
export interface AgentMetric {
  type: "metric";
  id: string;
  label: string;
  value: string;
  note?: string;
}
export interface AgentNotice {
  type: "notice";
  id: string;
  title: string;
  message: string;
  tone: "info" | "success" | "warning" | "danger";
}
export interface AgentTable {
  type: "table";
  id: string;
  title: string;
  rows: TableRow[];
}
/** Agent JSON is stricter than the chart helper: year is text and totals are derived. */
export interface AgentChart {
  type: "chart";
  id: string;
  title: string;
  data: Omit<ChartInput, "year"> & { year?: string };
}

export type JsonValue =
  null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };
export type WidgetTabs = {
  type: "tabs";
  id: string;
  title: string;
  items: { id: string; label: string; content: string }[];
  selected?: string;
};
export type WidgetAccordion = {
  type: "accordion";
  id: string;
  title: string;
  items: { id: string; title: string; content: string }[];
  multiple?: boolean;
};
export type WidgetTimeline = {
  type: "timeline";
  id: string;
  title: string;
  items: {
    id: string;
    title: string;
    description?: string;
    time?: string;
    state?: "planned" | "active" | "complete";
  }[];
};
export type WidgetKanban = {
  type: "kanban";
  id: string;
  title: string;
  columns: { id: string; title: string }[];
  items: {
    id: string;
    title: string;
    column: string;
    description?: string;
    tag?: string;
  }[];
};
export type WidgetChoices = {
  type: "choices";
  id: string;
  title: string;
  options: { id: string; label: string; description?: string }[];
  multiple?: boolean;
  value?: string[];
};
export type WidgetCommand = {
  type: "command";
  id: string;
  title: string;
  items: { id: string; label: string; description?: string; group?: string }[];
  placeholder?: string;
};
export type WidgetDrawer = {
  type: "drawer";
  id: string;
  title: string;
  description?: string;
  items: { id: string; title: string; description?: string }[];
};
export type WidgetStepper = {
  type: "stepper";
  id: string;
  title: string;
  steps: { id: string; title: string; description?: string }[];
  current?: string;
};
export type WidgetFilepicker = {
  type: "filepicker";
  id: string;
  title: string;
  accept?: "any" | "images" | "documents";
  maxFiles?: number;
  maxSizeMB?: number;
};
export type WidgetPagination = {
  type: "pagination";
  id: string;
  title: string;
  total: number;
  pageSize: number;
  page?: number;
};
export type WidgetSpec =
  | WidgetTabs
  | WidgetAccordion
  | WidgetTimeline
  | WidgetKanban
  | WidgetChoices
  | WidgetCommand
  | WidgetDrawer
  | WidgetStepper
  | WidgetFilepicker
  | WidgetPagination;
export interface WidgetInstance {
  getValue(): JsonValue;
  getFiles(): File[];
  update(spec: WidgetSpec): WidgetInstance;
  destroy(): void;
}
export const MuhitWidgets: Readonly<{
  kinds: readonly WidgetSpec["type"][];
  validate(spec: unknown): ValidationResult;
  mount(
    host: Host,
    spec: WidgetSpec,
    options?: {
      onAction?: (event: {
        type: string;
        componentId: string;
        value: JsonValue;
      }) => void;
    },
  ): WidgetInstance;
}>;

export type AgentComponent =
  | AgentCard
  | AgentMetric
  | AgentNotice
  | AgentTable
  | AgentChart
  | WidgetSpec
  | AgentForm
  | AgentDataGrid
  | AgentPlot;
export interface UISpec {
  page?: { title: string; description?: string; layout?: "stack" | "grid" };
  schemaVersion: "1.0.0" | "1.1.0";
  theme?: Partial<ThemeConfig>;
  components: AgentComponent[];
}
export interface ValidationIssue {
  path: string;
  message: string;
}
export interface ValidationResult {
  valid: boolean;
  errors: ValidationIssue[];
}
export interface AgentInstance {
  update(spec: UISpec): AgentInstance;
  destroy(): void;
}
export const MuhitAgent: Readonly<{
  validate(spec: unknown): ValidationResult;
  render(
    host: Host,
    spec: UISpec,
    options?: {
      onAction?: (action: {
        id: string;
        componentId: string;
        value?: JsonValue;
        signal?: AbortSignal;
      }) =>
        | void
        | { errors?: Record<string, string> }
        | Promise<void | { errors?: Record<string, string> }>;
    },
  ): AgentInstance;
}>;
declare global {
  interface Window {
    Muhit: typeof Muhit;
    MuhitTable: typeof MuhitTable;
    MuhitCharts: typeof MuhitCharts;
    MuhitTheme: typeof MuhitTheme;
    MuhitAgent: typeof MuhitAgent;
    MuhitWidgets: typeof MuhitWidgets;
  }
}

export interface DataColumn {
  key: string;
  label: string;
  type?: "text" | "number" | "date";
  sortable?: boolean;
  editable?: boolean;
}
export type DataRow = { id: string } & Record<string, string | number | null>;
export interface DataGridState {
  query: string;
  sort: string;
  direction: "asc" | "desc";
  page: number;
  pageSize: 5 | 10 | 25 | 50;
  filters?: Record<string, string>;
  locale?: string;
}
export interface DataGridOptions {
  locale?: string;
  selectable?: boolean;
  onSelectionChange?: (ids: string[]) => void;
  onRowsChange?: (
    rows: DataRow[],
    change: { id: string; key: string; value: string | number | null },
  ) => void;
  title?: string;
  description?: string;
  columns: DataColumn[];
  rows?: DataRow[];
  state?: Partial<DataGridState>;
  load?: (
    state: DataGridState,
    signal: AbortSignal,
  ) => Promise<{ rows: DataRow[]; total: number }>;
  onStateChange?: (state: DataGridState) => void;
}
export interface DataGridInstance {
  getSelected(): string[];
  clearSelection(): void;
  setVisibleColumns(keys: string[]): DataGridInstance;
  updateCell(
    id: string,
    key: string,
    value: string | number | null,
  ): DataGridInstance;
  toCSV(options?: { selectedOnly?: boolean }): string;
  getState(): DataGridState;
  setState(state: Partial<DataGridState>): DataGridInstance;
  setRows(rows: DataRow[]): DataGridInstance;
  refresh(): Promise<void>;
  destroy(): void;
}
export const MuhitDataGrid: Readonly<{
  mount(host: Host, options: DataGridOptions): DataGridInstance;
  validateColumns(columns: DataColumn[]): Required<DataColumn>[];
  validateRows(rows: DataRow[], columns: Required<DataColumn>[]): DataRow[];
  query(
    rows: DataRow[],
    columns: Required<DataColumn>[],
    state: DataGridState,
  ): { rows: DataRow[]; total: number };
}>;

export interface FormField {
  disabled?: boolean;
  readOnly?: boolean;
  visibleWhen?: { field: string; equals: string | number | boolean | null };
  name: string;
  label: string;
  type?:
    "text" | "email" | "textarea" | "number" | "date" | "select" | "checkbox";
  help?: string;
  required?: boolean;
  min?: number;
  max?: number;
  maxLength?: number;
  options?: Array<{ value: string; label: string }>;
}
export type FormValues = Record<string, string | number | boolean | null>;
export interface FormValidation {
  valid: boolean;
  values: FormValues;
  errors: Record<string, string>;
}
export interface FormInstance {
  getValues(): FormValues;
  isDirty(): boolean;
  setValues(values: FormValues): FormInstance;
  reset(): void;
  validate(): FormValidation;
  destroy(): void;
}
export const MuhitForm: Readonly<{
  normalizeFields(fields: FormField[]): FormField[];
  normalizeValues(fields: FormField[], values?: FormValues): FormValues;
  validate(fields: FormField[], values: FormValues): FormValidation;
  mount(
    host: Host,
    options: {
      fields: FormField[];
      values?: FormValues;
      title?: string;
      submitLabel?: string;
      validate?: (values: FormValues) => Record<string, string>;
      onChange?: (values: FormValues, state: { dirty: boolean }) => void;
      onSubmit?: (
        values: FormValues,
        signal: AbortSignal,
      ) =>
        | void
        | { errors?: Record<string, string> }
        | Promise<void | { errors?: Record<string, string> }>;
    },
  ): FormInstance;
}>;
export interface PreferenceResult {
  config: ThemeConfig;
  source: "default" | "stored";
  error: string | null;
}
export const MuhitPreferences: Readonly<{
  create(options?: {
    key?: string;
    fallback?: Partial<ThemeConfig>;
    storage?: Pick<Storage, "getItem" | "setItem" | "removeItem">;
  }): {
    load(): PreferenceResult;
    save(config: Partial<ThemeConfig>): {
      saved: boolean;
      config: ThemeConfig;
      error: string | null;
    };
    clear(): { cleared: boolean; error: string | null };
    subscribe(listener: (result: PreferenceResult) => void): () => void;
  };
}>;

export interface PlotData {
  title: string;
  description?: string;
  unit: string;
  kind?: "line" | "bar";
  locale?: string;
  labels: string[];
  series: Array<{ id: string; label: string; values: Array<number | null> }>;
}
export interface PlotInstance {
  setData(data: PlotData): PlotInstance;
  getData(): PlotData;
  toCSV(): string;
  destroy(): void;
}
export const MuhitPlot: Readonly<{
  normalize(data: PlotData): PlotData;
  mount(host: Host, data: PlotData): PlotInstance;
  toCSV(data: PlotData): string;
}>;

export interface AgentForm {
  type: "form";
  id: string;
  title: string;
  fields: FormField[];
  values?: FormValues;
  submitLabel?: string;
}
export interface AgentDataGrid {
  type: "datagrid";
  id: string;
  title: string;
  columns: DataColumn[];
  rows: DataRow[];
  selectable?: boolean;
  locale?: string;
}
export interface AgentPlot {
  type: "plot";
  id: string;
  title: string;
  data: PlotData;
}
