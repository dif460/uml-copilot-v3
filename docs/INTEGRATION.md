# 与官方 Agent Chat UI 的集成位置

## 1. 布局替换

将原聊天 Thread 放入：

```tsx
<section className="grid h-screen grid-cols-[360px_minmax(0,1fr)]">
  <OriginalThread />
  <OdooRenderer />
</section>
```

## 2. LangGraph State

Graph 至少保留：

```python
messages
prototype
requirement_summary
pending_questions
```

其中 `messages` 继续兼容 Agent Chat UI，`prototype` 用于右侧原型。

## 3. 前端同步

在 `useStream` 返回的新 `values` 中读取：

```ts
const prototype = values?.prototype;
```

检测变化后：

```ts
usePrototypeStore.getState().replaceSchema(prototype);
```

## 4. 推荐事件协议

正式版本建议使用以下事件类型：

```json
{
  "type": "prototype.replace",
  "schema": {}
}
```

或：

```json
{
  "type": "prototype.patch",
  "baseVersion": 3,
  "operations": []
}
```

必须带 `baseVersion`，避免多人编辑或异步流造成旧 Patch 覆盖新版本。

## 5. 安全边界

- 禁止模型直接生成可执行 JSX；
- 禁止 `eval`、动态 import 任意组件；
- 组件必须来自白名单；
- Schema 使用 Pydantic 与 TypeScript 双重校验；
- 所有字段名、模型名和业务规则进入代码生成前必须人工确认。
