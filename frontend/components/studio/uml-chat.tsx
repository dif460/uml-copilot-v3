"use client";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useStream } from "@langchain/react";
import { Bot, CircleAlert, Loader2, Send, User } from "lucide-react";
import { ExcelImport } from "@/components/uml/excel-import";
import { useUMLStore } from "@/stores/uml-store";
import { useLocale } from "@/lib/i18n";
import type { AgentMessage, UMLAgentState } from "@/types/agent-state";

const apiUrl = "/api/langgraph";
const assistantId = "uml_copilot_agent";

function extractText(m: AgentMessage): string {
  if (typeof m.content === "string") return m.content;
  return m.content.map((x) => x.text ?? "").join("");
}

function detectRole(m: AgentMessage): "user" | "assistant" {
  const r = String(m.type ?? m.role ?? "").toLowerCase();
  return r.includes("human") || r.includes("user") ? "user" : "assistant";
}

export function UMLChat() {
  const [input, setInput] = useState("");
  const project = useUMLStore((s) => s.project);
  const setProject = useUMLStore((s) => s.setProject);
  const { t } = useLocale();

  const stream = useStream<UMLAgentState>({
    apiUrl,
    assistantId,
    messagesKey: "messages",
  });

  const messages = useMemo(() => {
    const raw = (stream.messages as unknown as AgentMessage[]) ?? [];
    return raw.filter((m) => {
      const t = String(m.type ?? m.role ?? "").toLowerCase();
      const isHuman = t.includes("human") || t.includes("user");
      const isAi = t.includes("ai") || t.includes("assistant");
      if (!isHuman && !isAi) return false;
      if (isAi && !extractText(m)) return false;
      return true;
    });
  }, [stream.messages]);

  const wasLoading = useRef(false);

  useEffect(() => {
    const projectData = (stream.values as UMLAgentState)?.project;
    if (projectData) setProject(projectData, false);
  }, [stream.values, setProject]);

  useEffect(() => {
    if (wasLoading.current && !stream.isLoading) {
      const projectData = (stream.values as UMLAgentState)?.project;
      if (projectData) setProject(projectData, true);
    }
    wasLoading.current = stream.isLoading;
  }, [stream.isLoading, stream.values, setProject]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const q = input.trim();
    if (!q || stream.isLoading) return;
    setInput("");
    await stream.submit(
      { messages: [{ type: "human", content: q }], project } as UMLAgentState,
      { streamMode: ["messages", "values"] } as any
    );
  }

  return (
    <aside className="flex h-full flex-col">
      <ExcelImport />
      <div className="border-b p-3">
        <div className="text-sm font-semibold">{t("chat.uml.title")}</div>
        <div className="text-[11px] text-[#888]">{t("chat.uml.subtitle")}</div>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-auto p-4">
        {messages.length === 0 && (
          <div className="rounded-xl bg-[#f5eef5] p-3 text-xs">
            {t("chat.uml.welcome")}
          </div>
        )}

        {messages.map((m, i) => {
          const r = detectRole(m);
          return (
            <div key={m.id ?? i} className="flex gap-2">
              <div
                className={`grid h-7 w-7 place-items-center rounded-full ${
                  r === "assistant"
                    ? "bg-[#714B67] text-white"
                    : "bg-[#e5e5e5]"
                }`}
              >
                {r === "assistant" ? <Bot size={13} /> : <User size={13} />}
              </div>
              <div
                className={
                  r === "assistant"
                    ? "rounded-xl bg-[#f5eef5] p-3 text-xs"
                    : "rounded-xl bg-[#f0f0f0] p-3 text-xs"
                }
              >
                {extractText(m)}
              </div>
            </div>
          );
        })}

        {stream.isLoading && (
          <div className="flex items-center gap-2 text-xs">
            <Loader2 className="animate-spin" size={13} />
            {t("chat.uml.loading")}
          </div>
        )}

        {!!stream.error && (
          <div className="flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            <CircleAlert size={15} className="shrink-0" />
            <div>{t("chat.uml.error")}{String(stream.error)}</div>
          </div>
        )}
      </div>

      <form onSubmit={submit} className="border-t p-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          className="w-full rounded border p-2 text-xs"
          placeholder={t("chat.uml.placeholder")}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit(e);
            }
          }}
        />
        <button className="ml-auto mt-2 grid h-8 w-8 place-items-center rounded bg-[#714B67] text-white">
          <Send size={14} />
        </button>
      </form>
    </aside>
  );
}
