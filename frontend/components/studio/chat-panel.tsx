"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Bot, CircleAlert, Loader2, Send, User } from "lucide-react";
import { useStream } from "@langchain/react";
import { usePrototypeStore } from "@/stores/prototype-store";
import type { OdooAgentState, AgentMessage } from "@/types/agent-state";

const apiUrl =
  process.env.NEXT_PUBLIC_LANGGRAPH_API_URL ?? "http://localhost:2024";
const assistantId =
  process.env.NEXT_PUBLIC_LANGGRAPH_ASSISTANT_ID ?? "odoo_requirement_agent";

function messageText(message: AgentMessage): string {
  if (typeof message.content === "string") return message.content;

  return message.content
    .map((part) => {
      if (part?.type === "text" && typeof part.text === "string") {
        return part.text;
      }
      return "";
    })
    .filter(Boolean)
    .join("\n");
}

function messageRole(message: AgentMessage): "assistant" | "user" {
  const type = String(message.type ?? message.role ?? "").toLowerCase();
  return type.includes("human") || type.includes("user") ? "user" : "assistant";
}

export function ChatPanel() {
  const [input, setInput] = useState("");
  const replaceSchema = usePrototypeStore((state) => state.replaceSchema);

  const stream = useStream<OdooAgentState>({
    apiUrl,
    assistantId,
    messagesKey: "messages",
  });

  const messages = useMemo(
    () => (stream.messages ?? []) as AgentMessage[],
    [stream.messages],
  );

  useEffect(() => {
    const prototype = stream.values?.prototype;
    if (prototype) {
      replaceSchema(prototype);
    }
  }, [stream.values?.prototype, replaceSchema]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || stream.isLoading) return;

    setInput("");

    await stream.submit(
      { messages: [{ type: "human", content: text }] } as OdooAgentState,
      {
        streamMode: ["messages", "values"],
        optimisticValues: (current: OdooAgentState | undefined) => ({
          ...(current ?? { messages: [] }),
          messages: [
            ...((current?.messages ?? []) as AgentMessage[]),
            {
              id: crypto.randomUUID(),
              type: "human",
              content: text,
            },
          ],
        }),
      } as any,
    );
  }

  return (
    <aside className="flex min-h-0 flex-col border-r border-[#dedede] bg-white">
      <div className="border-b px-4 py-3">
        <div className="text-sm font-semibold">需求分析会话</div>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-neutral-500">
          <span>LangGraph · {assistantId}</span>
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              stream.error ? "bg-red-500" : "bg-emerald-500"
            }`}
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="flex items-start gap-2.5">
            <Avatar role="assistant" />
            <div className="rounded-xl bg-[#f4f0f3] px-3 py-2 text-xs leading-5">
              请描述需要新增或修改的 Odoo 页面。我会分析业务规则并同步更新右侧原型。
            </div>
          </div>
        )}

        {messages.map((message, index) => {
          const role = messageRole(message);
          const text = messageText(message);
          if (!text) return null;

          return (
            <div key={message.id ?? `${role}-${index}`} className="flex items-start gap-2.5">
              <Avatar role={role} />
              <div
                className={`rounded-xl px-3 py-2 text-xs leading-5 ${
                  role === "assistant"
                    ? "bg-[#f4f0f3] text-neutral-800"
                    : "bg-neutral-100 text-neutral-800"
                }`}
              >
                {text}
              </div>
            </div>
          );
        })}

        {stream.isLoading && (
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Loader2 className="animate-spin" size={14} />
            Agent 正在分析需求并生成原型……
          </div>
        )}

        {!!stream.error && (
          <div className="flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            <CircleAlert size={15} className="shrink-0" />
            <div>
              无法连接 LangGraph Server。请确认服务已运行于
              <code className="mx-1 rounded bg-red-100 px-1">{apiUrl}</code>。
            </div>
          </div>
        )}
      </div>

      <form onSubmit={submit} className="border-t p-3">
        <div className="rounded-xl border bg-white p-2 shadow-sm focus-within:border-[#714B67]">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            placeholder="例如：金额超过5万元时增加两级审批……"
            rows={3}
            disabled={stream.isLoading}
            className="w-full resize-none border-0 p-1 text-xs outline-none disabled:bg-white"
          />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-neutral-400">Enter 发送 · Shift+Enter 换行</span>
            <button
              disabled={!input.trim() || stream.isLoading}
              className="grid h-8 w-8 place-items-center rounded-lg bg-[#714B67] text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {stream.isLoading ? <Loader2 className="animate-spin" size={15} /> : <Send size={15} />}
            </button>
          </div>
        </div>
      </form>
    </aside>
  );
}

function Avatar({ role }: { role: "assistant" | "user" }) {
  return (
    <div
      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${
        role === "assistant"
          ? "bg-[#714B67] text-white"
          : "bg-neutral-200 text-neutral-700"
      }`}
    >
      {role === "assistant" ? <Bot size={14} /> : <User size={14} />}
    </div>
  );
}
