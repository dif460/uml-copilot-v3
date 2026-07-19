"use client";

import { useRef, useState } from "react";
import { FileSpreadsheet, Loader2 } from "lucide-react";
import { useUMLStore } from "@/stores/uml-store";
import type { UMLProject } from "@/types/uml-schema";

const url = process.env.NEXT_PUBLIC_UML_PARSER_API_URL ?? "http://localhost:8000";

export function ExcelImport() {
  const ref = useRef<HTMLInputElement>(null);
  const setProject = useUMLStore((s) => s.setProject);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function load(f: File) {
    setBusy(true);
    setErr("");
    try {
      const body = new FormData();
      body.append("file", f);

      const r = await fetch(`${url}/api/import/excel`, {
        method: "POST",
        body,
      });

      if (!r.ok) {
        throw new Error(await r.text());
      }

      setProject((await r.json()) as UMLProject);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Import failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="border-b bg-[#f5eef5] p-3">
      <input
        ref={ref}
        type="file"
        accept=".xlsx,.xls,.xlsb,.ods,.csv"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && load(e.target.files[0])}
      />
      <button
        onClick={() => ref.current?.click()}
        className="flex w-full items-center justify-center gap-2 rounded border border-dashed border-[#c9b8d4] bg-white p-3 text-xs text-[#714B67]"
      >
        {busy ? (
          <Loader2 className="animate-spin" size={15} />
        ) : (
          <FileSpreadsheet size={16} />
        )}
        Import Excel / CSV
      </button>
      {err && <div className="mt-2 text-[10px] text-red-600">{err}</div>}
    </div>
  );
}