import json, os, uuid
from copy import deepcopy
from langchain_core.messages import AIMessage, SystemMessage, ToolMessage
from langchain_openai import ChatOpenAI
from langgraph.graph import START, END, StateGraph
from .state import UMLAgentState
from .schemas import UMLPatch, UMLTable, UMLField, FieldPatch, RelationPatch

PROMPT = "You are UML Copilot. Modify the supplied UML project by calling the UMLPatch tool exactly once. Preserve IDs. Resolve names case-insensitively. Ask at most one clarification question."

# 将 UMLPatch Pydantic schema 转换为 OpenAI 工具定义
UML_PATCH_TOOL = {
    "type": "function",
    "function": {
        "name": "UMLPatch",
        "description": "UML project modification patch. Always call this tool to describe changes.",
        "parameters": UMLPatch.model_json_schema(),
    },
}

def find(xs, name):
    return next((x for x in xs if x.get("name", "").lower() == name.lower()), None)

def apply(p, patch_dict):
    r = deepcopy(p)
    ts = r.setdefault("tables", [])
    rels = r.setdefault("relations", [])
    r.setdefault("roles", [])
    r.setdefault("models", [])

    # 删除表
    removed_names = {x.lower() for x in patch_dict.get("tables_to_remove", [])}
    if removed_names:
        removed = {t["id"] for t in ts if t["name"].lower() in removed_names}
        ts[:] = [t for t in ts if t["id"] not in removed]
        rels[:] = [
            x for x in rels
            if x["sourceTableId"] not in removed and x["targetTableId"] not in removed
        ]

    # 重命名表
    for a, b in patch_dict.get("table_renames", {}).items():
        t = find(ts, a)
        if t:
            t["name"] = b

    # 添加表
    for td in patch_dict.get("tables_to_add", []):
        td["id"] = td.get("id") or str(uuid.uuid4())
        for f in td.get("fields", []):
            f["id"] = f.get("id") or str(uuid.uuid4())
        ts.append(td)

    # 添加字段
    for tn, fds in patch_dict.get("fields_to_add", {}).items():
        t = find(ts, tn)
        if t:
            for fd in fds:
                fd["id"] = fd.get("id") or str(uuid.uuid4())
                t["fields"].append(fd)

    # 更新字段
    mp = {"primary_key": "primaryKey", "foreign_key": "foreignKey"}
    for u in patch_dict.get("fields_to_update", []):
        t = find(ts, u.get("table_name", ""))
        f = find(t["fields"], u.get("field_name", "")) if t else None
        if f:
            new_name = u.pop("new_name", None)
            if new_name:
                f["name"] = new_name
            for k, v in u.items():
                if k not in {"table_name", "field_name", "new_name"} and v is not None:
                    f[mp.get(k, k)] = v

    # 删除字段
    for tn, names in patch_dict.get("fields_to_remove", {}).items():
        t = find(ts, tn)
        if t:
            name_set = {n.lower() for n in names}
            t["fields"] = [f for f in t["fields"] if f["name"].lower() not in name_set]

    # 关系变更
    for c in patch_dict.get("relation_changes", []):
        st = find(ts, c.get("source_table", ""))
        tt = find(ts, c.get("target_table", ""))
        sf = find(st["fields"], c.get("source_field", "")) if st else None
        tf_ = find(tt["fields"], c.get("target_field", "")) if tt else None
        if not (st and tt and sf and tf_):
            continue
        matches = [
            x for x in rels
            if x["sourceFieldId"] == sf["id"] and x["targetFieldId"] == tf_["id"]
        ]
        if c.get("action") == "remove":
            rels[:] = [x for x in rels if x not in matches]
        elif not matches:
            sf["foreignKey"] = True
            rels.append({
                "id": str(uuid.uuid4()),
                "sourceTableId": st["id"],
                "sourceFieldId": sf["id"],
                "targetTableId": tt["id"],
                "targetFieldId": tf_["id"],
                "type": c.get("type", "many-to-one"),
                "label": f"{st['name']}.{sf['name']} → {tt['name']}.{tf_['name']}",
                "inferred": False,
            })

    r["version"] = r.get("version", 1) + 1
    return r

def _extract_patch(response) -> dict:
    """从 LLM 响应中提取 UMLPatch 工具调用参数，失败时尝试解析文本内容兜底"""
    tool_calls = getattr(response, "tool_calls", None) or []
    for tc in tool_calls:
        if tc.get("name") == "UMLPatch":
            return tc.get("args", {})
    # 工具调用失败时，尝试从文本中提取 JSON（部分模型不支持 function calling）
    content = getattr(response, "content", "") or ""
    try:
        import re
        m = re.search(r"\{[\s\S]*\}", content)
        if m:
            return json.loads(m.group())
    except Exception:
        pass
    return {}

async def node(state):
    p = state.get("project") or {
        "id": "new", "name": "Untitled UML Project",
        "tables": [], "relations": [], "version": 1, "sourceFiles": [],
        "roles": [], "models": [],
    }

    model = ChatOpenAI(
        model=os.getenv("OPENAI_MODEL", "qwen2.5-coder-7b-instruct"),
        temperature=0,
        api_key=os.getenv("OPENAI_API_KEY","lm-studio"),
        base_url=os.getenv("OPENAI_API_BASE","http://192.168.2.211:1234/v1"),
    )
    force_tool = os.getenv("FORCE_TOOL", "true").lower() in ("true", "1", "yes")
    tool_choice = (
        {"type": "function", "function": {"name": "UMLPatch"}}
        if force_tool else "auto"
    )
    bound = model.bind_tools([UML_PATCH_TOOL], tool_choice=tool_choice)

    response = await bound.ainvoke([
        SystemMessage(content=PROMPT),
        SystemMessage(content="CURRENT PROJECT:\n" + json.dumps(p)),
        *state.get("messages", [])[-10:],
    ])

    patch_dict = _extract_patch(response) or {
        "summary": "No changes needed.",
        "clarification_question": None,
    }

    up = apply(p, patch_dict)
    ans = patch_dict.get("summary", "Done.")

    if patch_dict.get("clarification_question"):
        ans += "\n\nClarification: " + patch_dict["clarification_question"]

    return {
        "project": up,
        "project_version": up["version"],
        "messages": [AIMessage(content=ans)],
    }

b = StateGraph(UMLAgentState)
b.add_node("modify", node)
b.add_edge(START, "modify")
b.add_edge("modify", END)
graph = b.compile()
