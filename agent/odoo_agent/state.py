from typing import Annotated, Any, TypedDict
from langgraph.graph.message import add_messages


class OdooAgentState(TypedDict, total=False):
    messages: Annotated[list, add_messages]
    prototype: dict[str, Any]
    prototype_version: int
    requirement_summary: str
    pending_questions: list[str]
