"use client";

import { Code2, FileText, RotateCcw, Save } from "lucide-react";
import { usePrototypeStore } from "@/stores/prototype-store";

export function StudioHeader() {
  const reset = usePrototypeStore((state) => state.reset);

  return (
    <header className="flex h-14 items-center justify-between border-b border-[#dedede] bg-white px-4">
      <div className="flex items-center gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-md bg-[#714B67] text-sm font-semibold text-white">
          O
        </div>
        <div>
          <div className="text-sm font-semibold">Odoo AI Studio</div>
          <div className="text-[11px] text-neutral-500">Conversational Requirement Workspace</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs">
          <Save size={14} /> 保存版本
        </button>
        <button className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs">
          <FileText size={14} /> 生成需求书
        </button>
        <button className="flex items-center gap-1.5 rounded-md bg-[#714B67] px-3 py-1.5 text-xs text-white">
          <Code2 size={14} /> 生成 Odoo 代码
        </button>
        <button
          onClick={reset}
          title="重置演示"
          className="rounded-md border p-1.5 text-neutral-600"
        >
          <RotateCcw size={15} />
        </button>
      </div>
    </header>
  );
}
