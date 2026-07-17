# UML Copilot v3

This version converts the previous Odoo prototype tool into an Excel-to-UML copilot.

## Capabilities

- Upload XLSX/XLS/XLSB/ODS/CSV files.
- Convert each worksheet into a table.
- Infer fields, data types, primary keys and likely foreign keys.
- Visualize tables and relationships with React Flow.
- Drag tables, add/delete tables, edit fields and PK/FK/nullability metadata.
- Modify the UML model through LangGraph chat.
- Keep version history.
- Export JSON and Mermaid ER source.

## Start

### Parser service
```bash
cd agent
python -m venv .venv
.venv\Scripts\activate
pip install -e .
uvicorn uml_agent.api:app --reload --port 8000
```

### LangGraph
```bash
langgraph dev
```

### Frontend
```bash
cd frontend
pnpm install
copy .env.example .env.local
pnpm dev
```

Open http://localhost:3000.

## Example prompts

- Rename Customers to Accounts.
- Add account_status as a non-null string field.
- Link Orders.customer_id to Accounts.id as many-to-one.
- Remove legacy_code from Products.

“”“
已打包好，启动如下：
```
## 项目启动步骤
### 1. 确认 .env 配置
确保 agent/.env 中包含 DeepSeek API 配置：

### 2. 启动 Parser 服务（端口 8000）
### 3. 启动 LangGraph 服务（端口 2024）
打开新终端：

### 4. 启动前端（端口 3000）
打开新终端：

```
cd frontend
node_modules\.bin\next.cmd dev -p 
3000
``` 注意 ：不要用 pnpm dev ，沙箱环境下 pnpm 有 SQLite 数据库问题，直接用 next.cmd 。
### 5. 打开浏览器
访问 http://localhost:3000
```
”“”
