import os
from copy import deepcopy

from langchain_core.messages import AIMessage, SystemMessage
from langchain_openai import ChatOpenAI
from langgraph.graph import END, START, StateGraph

from .prompts import SYSTEM_PROMPT
from .schemas import PrototypePatch
from .state import OdooAgentState


def default_prototype() -> dict:
    return {
        "id": "sales-dashboard",
        "title": "Sales Dashboard",
        "module": "Sales",
        "viewType": "dashboard",
        "menus": [
            "Sales", "Orders", "To Invoice", "Products",
            "Customers", "Reporting", "Configuration",
        ],
        "activeMenu": "Sales",
        "breadcrumbs": ["Sales", "Dashboard"],
        "kpis": [
            {"id": "revenue", "label": "Total Revenue", "value": "$284,921", "delta": "+12.5% vs last month"},
            {"id": "orders", "label": "Sales Orders", "value": "1,429", "delta": "+0.2% vs last month"},
            {"id": "customers", "label": "New Customers", "value": "342", "delta": "+23.1% vs last month"},
            {"id": "stock", "label": "Items in Stock", "value": "8,764", "delta": "-3.4% vs last month"},
        ],
        "chart": {
            "title": "Revenue Overview",
            "subtitle": "Monthly gross revenue in thousands (USD)",
            "values": [28, 36, 32, 43, 45, 39, 51, 47, 56, 53, 61, 58],
        },
        "pipeline": [
            {"label": "New", "value": "128 · $412K", "percent": 100},
            {"label": "Qualified", "value": "86 · $318K", "percent": 74},
            {"label": "Proposition", "value": "54 · $236K", "percent": 52},
            {"label": "Negotiation", "value": "31 · $164K", "percent": 35},
            {"label": "Won", "value": "19 · $98K", "percent": 21},
        ],
        "table": {
            "title": "Recent Sales Orders",
            "columns": [
                {"key": "customer", "label": "Customer"},
                {"key": "order", "label": "Order"},
                {"key": "amount", "label": "Amount", "align": "right"},
                {"key": "status", "label": "Status", "align": "right"},
            ],
            "rows": [
                {"id": "1", "customer": "Acme Corporation", "order": "SO-4921", "amount": "$12,400", "status": "Confirmed"},
                {"id": "2", "customer": "Globex Industries", "order": "SO-4820", "amount": "$8,150", "status": "Pending"},
            ],
        },
        "form": {
            "title": "Sales Order",
            "status": ["Quotation", "Waiting Approval", "Sales Order"],
            "activeStatus": "Quotation",
            "fields": [
                {
                    "id": "customer",
                    "name": "partner_id",
                    "label": "Customer",
                    "type": "many2one",
                    "value": "Acme Corporation",
                    "readonly": False,
                    "options": [],
                    "width": "half",
                },
                {
                    "id": "amount",
                    "name": "amount_total",
                    "label": "Total",
                    "type": "monetary",
                    "value": "$12,400",
                    "readonly": True,
                    "options": [],
                    "width": "half",
                },
            ],
        },
        "businessRules": [],
    }


def merge_patch(prototype: dict, patch: PrototypePatch) -> dict:
    result = deepcopy(prototype)
    result["viewType"] = patch.target_view

    if patch.title:
        result["title"] = patch.title
        if patch.target_view == "form":
            result["form"]["title"] = patch.title

    fields = result.setdefault("form", {}).setdefault("fields", [])
    removed_field_ids = set(patch.field_ids_to_remove)
    fields[:] = [field for field in fields if field.get("id") not in removed_field_ids]

    existing_field_ids = {field.get("id") for field in fields}
    for field in patch.fields_to_add:
        value = field.model_dump()
        if value["id"] in existing_field_ids:
            fields[:] = [
                value if current.get("id") == value["id"] else current
                for current in fields
            ]
        else:
            fields.append(value)
            existing_field_ids.add(value["id"])

    rules = result.setdefault("businessRules", [])
    removed_rule_ids = set(patch.business_rule_ids_to_remove)
    rules[:] = [rule for rule in rules if rule.get("id") not in removed_rule_ids]

    existing_rule_ids = {rule.get("id") for rule in rules}
    for rule in patch.business_rules_to_add:
        value = rule.model_dump()
        if value["id"] not in existing_rule_ids:
            rules.append(value)
            existing_rule_ids.add(value["id"])

    return result


PROTOTYPE_PATCH_TOOL = {
    "type": "function",
    "function": {
        "name": "PrototypePatch",
        "description": "Odoo prototype modification patch. Always call this tool to describe changes.",
        "parameters": PrototypePatch.model_json_schema(),
    },
}


async def analyze_requirement(state: OdooAgentState) -> dict:
    model = ChatOpenAI(
        model=os.getenv("OPENAI_MODEL", "qwen2.5-coder-7b-instruct"),
        temperature=0,
        api_key=os.getenv("OPENAI_API_KEY", "lm-studio"),
        base_url=os.getenv("OPENAI_API_BASE","http://192.168.2.211:1234/v1"),
    )
    force_tool = os.getenv("FORCE_TOOL", "true").lower() in ("true", "1", "yes")
    tool_choice = (
        {"type": "function", "function": {"name": "PrototypePatch"}}
        if force_tool else "auto"
    )
    bound = model.bind_tools([PROTOTYPE_PATCH_TOOL], tool_choice=tool_choice)

    prototype = state.get("prototype") or default_prototype()
    recent_messages = state.get("messages", [])[-10:]

    response = await bound.ainvoke(
        [
            SystemMessage(content=SYSTEM_PROMPT),
            SystemMessage(
                content=(
                    "CURRENT_PROTOTYPE_JSON:\n"
                    + __import__("json").dumps(
                        prototype, ensure_ascii=False, indent=2
                    )
                )
            ),
            *recent_messages,
        ]
    )

    # 手动解析 tool_calls
    tool_calls = getattr(response, "tool_calls", None) or []
    patch_args = {}
    for tc in tool_calls:
        if tc.get("name") == "PrototypePatch":
            patch_args = tc.get("args", {})
            break

    patch = PrototypePatch(**patch_args) if patch_args else PrototypePatch(
        summary="No changes needed."
    )

    updated_prototype = merge_patch(prototype, patch)
    answer = patch.summary
    if patch.clarification_question:
        answer += "\n\n需要确认：" + patch.clarification_question

    return {
        "prototype": updated_prototype,
        "prototype_version": state.get("prototype_version", 0) + 1,
        "requirement_summary": patch.summary,
        "pending_questions": (
            [patch.clarification_question]
            if patch.clarification_question
            else []
        ),
        "messages": [AIMessage(content=answer)],
    }


builder = StateGraph(OdooAgentState)
builder.add_node("analyze_requirement", analyze_requirement)
builder.add_edge(START, "analyze_requirement")
builder.add_edge("analyze_requirement", END)

graph = builder.compile()
