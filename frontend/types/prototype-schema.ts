export type ViewType = "dashboard" | "list" | "form" | "kanban";

export type KPI = {
  id: string;
  label: string;
  value: string;
  delta?: string;
  icon?: string;
};

export type TableColumn = {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
};

export type TableRow = {
  id: string;
  [key: string]: string | number;
};

export type FormField = {
  id: string;
  name: string;
  label: string;
  type:
    | "text"
    | "many2one"
    | "selection"
    | "monetary"
    | "date"
    | "statusbar"
    | "textarea";
  value?: string;
  readonly?: boolean;
  options?: string[];
  width?: "half" | "full";
};

export type PrototypeSchema = {
  id: string;
  title: string;
  module: string;
  viewType: ViewType;
  menus: string[];
  activeMenu: string;
  breadcrumbs: string[];
  kpis: KPI[];
  chart: {
    title: string;
    subtitle?: string;
    values: number[];
  };
  pipeline: {
    label: string;
    value: string;
    percent: number;
  }[];
  table: {
    title: string;
    columns: TableColumn[];
    rows: TableRow[];
  };
  form: {
    title: string;
    status: string[];
    activeStatus: string;
    fields: FormField[];
  };
  businessRules: {
    id: string;
    description: string;
  }[];
};
