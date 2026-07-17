"use client";

import { useEffect } from "react";
import { usePrototypeStore } from "@/stores/prototype-store";
import type { OdooAgentState } from "@/types/agent-state";

/**
 * 可在官方 agent-chat-ui 的 Thread/useStream 组件内直接调用。
 * 将 LangGraph values.prototype 同步到右侧 Odoo Renderer。
 */
export function usePrototypeSync(values: OdooAgentState | undefined) {
  const replaceSchema = usePrototypeStore((state) => state.replaceSchema);

  useEffect(() => {
    if (values?.prototype) {
      replaceSchema(values.prototype);
    }
  }, [values?.prototype, replaceSchema]);
}
