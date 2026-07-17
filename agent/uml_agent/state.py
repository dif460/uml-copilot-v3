from typing import Annotated,Any,TypedDict
from langgraph.graph.message import add_messages
class UMLAgentState(TypedDict,total=False):
 messages:Annotated[list,add_messages]; project:dict[str,Any]; project_version:int; requirement_summary:str; pending_questions:list[str]
