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

Open http://localhost.

> **Linux 服务器注意**：80 端口需要 root 权限，请使用 `sudo pnpm dev`。

## Example prompts

- Rename Customers to Accounts.
- Add account_status as a non-null string field.
- Link Orders.customer_id to Accounts.id as many-to-one.
- Remove legacy_code from Products.

“”“
