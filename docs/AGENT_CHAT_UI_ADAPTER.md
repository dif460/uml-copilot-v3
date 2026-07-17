# Agent Chat UI 适配步骤

本版本已经使用 `@langchain/react` 的 `useStream` 直接连接 LangGraph Server。

若你随后通过：

```bash
npx create-agent-chat-app --project-name odoo-agent-chat
```

生成官方 Agent Chat UI 项目，可采用以下合并方式。

## 保留官方代码

保留官方项目中的：

- Thread 历史与分支
- Tool Call 渲染
- Interrupt/Human-in-the-loop
- 配置页
- LangGraph Provider
- 消息重新生成与编辑

## 复制本项目代码

复制：

```text
components/prototype/
components/studio/studio-header.tsx
components/studio/version-panel.tsx
components/studio/use-prototype-sync.ts
stores/prototype-store.ts
types/prototype-schema.ts
types/agent-state.ts
```

## 修改官方页面布局

将官方 Thread 放在左侧：

```tsx
<div className="grid h-screen grid-cols-[360px_minmax(0,1fr)]">
  <div className="min-h-0">
    <Thread />
  </div>
  <OdooRenderer />
</div>
```

## 在官方 useStream 所在组件同步 prototype

```tsx
const stream = useStream<OdooAgentState>(...);

usePrototypeSync(stream.values);
```

右侧 Renderer 不依赖聊天组件，因此不会破坏官方的 Thread、分支、Tool Call 或 Interrupt 机制。
