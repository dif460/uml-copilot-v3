from typing import Any, Literal
from pydantic import BaseModel, Field


class KPI(BaseModel):
    id: str
    label: str
    value: str
    delta: str | None = None


class Chart(BaseModel):
    title: str
    subtitle: str | None = None
    values: list[float] = Field(default_factory=list)


class PipelineItem(BaseModel):
    label: str
    value: str
    percent: float


class TableColumn(BaseModel):
    key: str
    label: str
    align: Literal["left", "right", "center"] = "left"


class FormField(BaseModel):
    id: str
    name: str
    label: str
    type: Literal[
        "text", "many2one", "selection", "monetary",
        "date", "statusbar", "textarea"
    ]
    value: str | None = None
    readonly: bool = False
    options: list[str] = Field(default_factory=list)
    width: Literal["half", "full"] = "half"


class BusinessRule(BaseModel):
    id: str
    description: str


class PrototypePatch(BaseModel):
    summary: str
    target_view: Literal["dashboard", "list", "form", "kanban"]
    title: str | None = None
    fields_to_add: list[FormField] = Field(default_factory=list)
    field_ids_to_remove: list[str] = Field(default_factory=list)
    business_rules_to_add: list[BusinessRule] = Field(default_factory=list)
    business_rule_ids_to_remove: list[str] = Field(default_factory=list)
    clarification_question: str | None = None


class PrototypeStatePayload(BaseModel):
    id: str
    title: str
    module: str
    viewType: Literal["dashboard", "list", "form", "kanban"]
    menus: list[str]
    activeMenu: str
    breadcrumbs: list[str]
    kpis: list[KPI]
    chart: Chart
    pipeline: list[PipelineItem]
    table: dict[str, Any]
    form: dict[str, Any]
    businessRules: list[BusinessRule]
