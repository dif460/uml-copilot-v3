# UML Copilot v3

This version converts the previous Odoo prototype tool into an Excel-to-UML copilot.biaoji

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
`ash
cd agent
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
uvicorn uml_agent.api:app --reload --port 8000
`

### LangGraph
`ash
pip install langgraph-cli
langgraph dev
`

### Frontend
`ash
cd frontend
pnpm install
cp .env.example .env.local
pnpm dev
`

Open http://localhost.

> **端口注意**：如果使用 80 端口运行 Frontend，需要 root 权限，请使用 sudo pnpm dev。
>
> **首次使用提示**：
> - langgraph dev 需要先安装 LangGraph CLI，已包含在启动命令中。
> - Python 虚拟环境激活后，请确保在同一个终端会话中继续执行后续命令。

## Example prompts

- Rename Customers to Accounts.
- Add account_status as a non-null string field.
- Link Orders.customer_id to Accounts.id as many-to-one.
- Remove legacy_code from Products.
