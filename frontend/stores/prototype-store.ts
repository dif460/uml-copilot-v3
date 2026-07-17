"use client";

import { create } from "zustand";
import type { PrototypeSchema, ViewType } from "@/types/prototype-schema";

export const defaultSchema: PrototypeSchema = {
  id: "sales-dashboard",
  title: "Sales Dashboard",
  module: "Sales",
  viewType: "dashboard",
  menus: ["Sales", "Orders", "To Invoice", "Products", "Customers", "Reporting", "Configuration"],
  activeMenu: "Sales",
  breadcrumbs: ["Sales", "Dashboard"],
  kpis: [
    { id: "revenue", label: "Total Revenue", value: "$284,921", delta: "+12.5% vs last month" },
    { id: "orders", label: "Sales Orders", value: "1,429", delta: "+0.2% vs last month" },
    { id: "customers", label: "New Customers", value: "342", delta: "+23.1% vs last month" },
    { id: "stock", label: "Items in Stock", value: "8,764", delta: "-3.4% vs last month" },
  ],
  chart: {
    title: "Revenue Overview",
    subtitle: "Monthly gross revenue in thousands (USD)",
    values: [28, 36, 32, 43, 45, 39, 51, 47, 56, 53, 61, 58],
  },
  pipeline: [
    { label: "New", value: "128 · $412K", percent: 100 },
    { label: "Qualified", value: "86 · $318K", percent: 74 },
    { label: "Proposition", value: "54 · $236K", percent: 52 },
    { label: "Negotiation", value: "31 · $164K", percent: 35 },
    { label: "Won", value: "19 · $98K", percent: 21 },
  ],
  table: {
    title: "Recent Sales Orders",
    columns: [
      { key: "customer", label: "Customer" },
      { key: "order", label: "Order" },
      { key: "amount", label: "Amount", align: "right" },
      { key: "status", label: "Status", align: "right" },
    ],
    rows: [
      { id: "1", customer: "Acme Corporation", order: "SO-4921", amount: "$12,400", status: "Confirmed" },
      { id: "2", customer: "Globex Industries", order: "SO-4820", amount: "$8,150", status: "Pending" },
      { id: "3", customer: "Soylent Ltd.", order: "SO-4319", amount: "$4,920", status: "Confirmed" },
      { id: "4", customer: "Initech LLC", order: "SO-4918", amount: "$21,760", status: "Draft" },
      { id: "5", customer: "Umbrella Co.", order: "SO-4017", amount: "$3,300", status: "Confirmed" },
    ],
  },
  form: {
    title: "Sales Order",
    status: ["Quotation", "Waiting Approval", "Sales Order"],
    activeStatus: "Quotation",
    fields: [
      { id: "customer", name: "partner_id", label: "Customer", type: "many2one", value: "Acme Corporation", width: "half" },
      { id: "date", name: "date_order", label: "Order Date", type: "date", value: "2026-07-12", width: "half" },
      { id: "amount", name: "amount_total", label: "Total", type: "monetary", value: "$12,400", readonly: true, width: "half" },
      { id: "salesperson", name: "user_id", label: "Salesperson", type: "many2one", value: "Mitchell Admin", width: "half" },
    ],
  },
  businessRules: [],
};

function fingerprint(schema: PrototypeSchema): string {
  return JSON.stringify(schema);
}

type PrototypeState = {
  schema: PrototypeSchema;
  versions: PrototypeSchema[];
  setViewType: (viewType: ViewType) => void;
  replaceSchema: (schema: PrototypeSchema, recordVersion?: boolean) => void;
  reset: () => void;
};

export const usePrototypeStore = create<PrototypeState>((set) => ({
  schema: defaultSchema,
  versions: [defaultSchema],

  setViewType: (viewType) =>
    set((state) => ({
      schema: { ...state.schema, viewType },
    })),

  replaceSchema: (schema, recordVersion = true) =>
    set((state) => {
      if (!recordVersion) return { schema };

      const previous = state.versions[state.versions.length - 1];
      const changed = !previous || fingerprint(previous) !== fingerprint(schema);

      return {
        schema,
        versions: changed ? [...state.versions, schema] : state.versions,
      };
    }),

  reset: () => set({ schema: defaultSchema, versions: [defaultSchema] }),
}));
