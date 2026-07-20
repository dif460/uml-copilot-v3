"use client";

import { BarChart3, KanbanSquare, List, Monitor, PanelTop, Search } from "lucide-react";
import { usePrototypeStore } from "@/stores/prototype-store";
import { useLocale } from "@/lib/i18n";
import { DashboardView } from "./views/dashboard-view";
import { FormView } from "./views/form-view";
import { ListView } from "./views/list-view";

export function OdooRenderer() {
  const schema = usePrototypeStore((state) => state.schema);
  const setViewType = usePrototypeStore((state) => state.setViewType);
  const { t } = useLocale();

  return (
    <section className="min-w-0 overflow-auto bg-[#f6f6f6]">
      <div className="sticky top-0 z-10">
        <div className="flex h-11 items-center bg-[#714B67] px-4 text-white">
          <div className="mr-5 grid grid-cols-3 gap-0.5">
            {Array.from({ length: 9 }).map((_, index) => (
              <span key={index} className="h-1 w-1 rounded-full bg-white/90" />
            ))}
          </div>
          <nav className="flex h-full items-center gap-1">
            {schema.menus.map((menu) => (
              <button
                key={menu}
                className={`h-full px-3 text-xs ${
                  menu === schema.activeMenu ? "bg-white/12 font-semibold" : "text-white/90"
                }`}
              >
                {menu}
              </button>
            ))}
          </nav>
          <div className="ml-auto text-xs text-white/90">Mitchell Admin</div>
        </div>

        <div className="flex h-12 items-center gap-3 border-b bg-white px-4">
          <button className="rounded bg-[#714B67] px-3 py-1.5 text-xs text-white">{t("odoo.new")}</button>
          <div className="text-xs text-neutral-500">{schema.breadcrumbs.join(" / ")}</div>
          <div className="ml-4 flex h-8 min-w-[280px] items-center rounded border px-2 text-neutral-400">
            <Search size={14} />
            <span className="ml-2 text-xs">{t("odoo.search")}</span>
          </div>
          <div className="ml-auto flex items-center gap-1 rounded border bg-neutral-50 p-1">
            <ToolbarButton active={schema.viewType === "dashboard"} onClick={() => setViewType("dashboard")}>
              <BarChart3 size={14} />
            </ToolbarButton>
            <ToolbarButton active={schema.viewType === "list"} onClick={() => setViewType("list")}>
              <List size={14} />
            </ToolbarButton>
            <ToolbarButton active={schema.viewType === "form"} onClick={() => setViewType("form")}>
              <PanelTop size={14} />
            </ToolbarButton>
            <ToolbarButton active={schema.viewType === "kanban"} onClick={() => setViewType("kanban")}>
              <KanbanSquare size={14} />
            </ToolbarButton>
          </div>
          <Monitor size={15} className="text-neutral-500" />
        </div>
      </div>

      <div className="p-3">
        {schema.viewType === "dashboard" && <DashboardView schema={schema} />}
        {schema.viewType === "list" && <ListView schema={schema} />}
        {schema.viewType === "form" && <FormView schema={schema} />}
        {schema.viewType === "kanban" && (
          <div className="rounded-lg border bg-white p-8 text-sm text-neutral-500">
            {t("odoo.kanban.placeholder")}
          </div>
        )}
      </div>
    </section>
  );
}

function ToolbarButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`grid h-7 w-7 place-items-center rounded ${
        active ? "bg-[#714B67] text-white" : "text-neutral-500"
      }`}
    >
      {children}
    </button>
  );
}
