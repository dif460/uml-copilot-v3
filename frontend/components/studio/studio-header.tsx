"use client";

import { Code2, FileText, RotateCcw, Save, Languages } from "lucide-react";
import { usePrototypeStore } from "@/stores/prototype-store";
import { useLocale } from "@/lib/i18n";

export function StudioHeader() {
  const reset = usePrototypeStore((state) => state.reset);
  const { locale, toggleLocale, t } = useLocale();

  return (
    <header className="flex h-14 items-center justify-between border-b border-[#dedede] bg-white px-4">
      <div className="flex items-center gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-md bg-[#714B67] text-sm font-semibold text-white">
          O
        </div>
        <div>
          <div className="text-sm font-semibold">{t("studio.title")}</div>
          <div className="text-[11px] text-neutral-500">{t("studio.subtitle")}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs">
          <Save size={14} /> {t("studio.saveVersion")}
        </button>
        <button className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs">
          <FileText size={14} /> {t("studio.generateReq")}
        </button>
        <button className="flex items-center gap-1.5 rounded-md bg-[#714B67] px-3 py-1.5 text-xs text-white">
          <Code2 size={14} /> {t("studio.generateCode")}
        </button>
        <button
          onClick={reset}
          title={t("studio.reset")}
          className="rounded-md border p-1.5 text-neutral-600"
        >
          <RotateCcw size={15} />
        </button>
        <button
          onClick={toggleLocale}
          title={locale === "zh" ? "Switch to English" : "切换到中文"}
          className="flex items-center gap-1 rounded-md border px-2 py-1.5 text-xs font-medium"
        >
          <Languages size={14} />
          <span className="hidden sm:inline">{locale === "zh" ? "EN" : "中"}</span>
        </button>
      </div>
    </header>
  );
}
