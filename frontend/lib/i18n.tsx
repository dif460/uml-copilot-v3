"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Locale = "zh" | "en";

const translations: Record<Locale, Record<string, string>> = {
  zh: {
    // common
    "lang.switch": "Switch to English",
    "lang.label": "EN",

    // uml-header
    "uml.title": "UML Copilot",
    "uml.subtitle": "Excel-to-UML 数据模型工作区",
    "uml.tables": "张表",
    "uml.relations": "条关系",
    "uml.json": "JSON",
    "uml.mermaid": "Mermaid",
    "uml.reset": "重置",

    // studio-header
    "studio.title": "Odoo AI Studio",
    "studio.subtitle": "对话式需求工作区",
    "studio.saveVersion": "保存版本",
    "studio.generateReq": "生成需求书",
    "studio.generateCode": "生成 Odoo 代码",
    "studio.reset": "重置演示",

    // uml-chat
    "chat.uml.title": "UML Copilot 对话",
    "chat.uml.subtitle": "用自然语言修改表、字段和关系",
    "chat.uml.welcome": "导入工作簿后，您可以这样提问：把 Customers 重命名为 Accounts，将 Orders.customer_id 关联到 Accounts.id。",
    "chat.uml.loading": "正在更新模型……",
    "chat.uml.error": "Agent 错误：",
    "chat.uml.placeholder": "添加、重命名或关联表和字段……",

    // chat-panel (odoo)
    "chat.odoo.title": "需求分析会话",
    "chat.odoo.welcome": "请描述需要新增或修改的 Odoo 页面。我会分析业务规则并同步更新右侧原型。",
    "chat.odoo.loading": "Agent 正在分析需求并生成原型……",
    "chat.odoo.error": "无法连接 LangGraph Server。请确认服务已运行于",
    "chat.odoo.placeholder": "例如：金额超过5万元时增加两级审批……",
    "chat.odoo.hint": "Enter 发送 · Shift+Enter 换行",

    // excel-import
    "excel.import": "导入 Excel / CSV",
    "excel.failed": "导入失败",

    // workspace
    "workspace.addTable": "添加表",

    // field types (display labels)
    "type.string": "字符串",
    "type.integer": "整数",
    "type.decimal": "小数",
    "type.boolean": "布尔",
    "type.date": "日期",
    "type.datetime": "日期时间",
    "type.text": "文本",
    "type.uuid": "UUID",
    "type.unknown": "未知",

    // relation types (edge labels)
    "relation.one-to-one": "一对一",
    "relation.one-to-many": "一对多",
    "relation.many-to-one": "多对一",
    "relation.many-to-many": "多对多",

    // version-panel
    "version.history": "历史版本",
    "version.format": "v{n}",

    // relation-editor
    "relation.title": "关系",
    "relation.type": "类型",
    "relation.sourceField": "源字段",
    "relation.targetField": "目标字段",
    "relation.label": "标签（可选）",
    "relation.inferred": "自动推断",
    "relation.delete": "删除关系",

    // table-editor
    "table.addField": "添加字段",
    "table.pk": "主键",
    "table.fk": "外键",
    "table.unique": "唯一",
    "table.nullable": "可空",
    "table.delete": "删除表",

    // odoo-renderer
    "odoo.new": "+ 新建",
    "odoo.search": "搜索...",
    "odoo.kanban.placeholder": "看板渲染器可按同一 Schema 机制继续扩展。",
    "odoo.user": "管理员",

    // form-view
    "form.confirm": "确认",
    "form.cancel": "取消",
    "form.new": "新建",
    "form.businessRules": "业务规则",
    "form.orderLines": "订单行",
    "form.product": "产品",
    "form.quantity": "数量",
    "form.unitPrice": "单价",
    "form.subtotal": "小计",
    "form.empty": "—",

    // dashboard-view
    "dashboard.pipeline": "CRM 管线",
    "dashboard.teamActivity": "团队动态",
    "dashboard.recently": "刚刚",
    "dashboard.months": "1月 2月 3月 4月 5月 6月 7月 8月 9月 10月 11月 12月",
    "dashboard.activity1": "Sarah Kim 完成了与 Acme Corporation 的交易",
    "dashboard.activity2": "James Lee 创建了发票 INV-2048",
    "dashboard.activity3": "Nora Diaz 向库存中添加了 120 件商品",
    "dashboard.activity4": "Tom Blake 更新了 Q3 销售预测",
  },
  en: {
    "lang.switch": "切换到中文",
    "lang.label": "中",

    "uml.title": "UML Copilot",
    "uml.subtitle": "Excel-to-UML Data Model Workspace",
    "uml.tables": "tables",
    "uml.relations": "relations",
    "uml.json": "JSON",
    "uml.mermaid": "Mermaid",
    "uml.reset": "Reset",

    "studio.title": "Odoo AI Studio",
    "studio.subtitle": "Conversational Requirement Workspace",
    "studio.saveVersion": "Save Version",
    "studio.generateReq": "Generate Req Doc",
    "studio.generateCode": "Generate Odoo Code",
    "studio.reset": "Reset Demo",

    "chat.uml.title": "UML Copilot Chat",
    "chat.uml.subtitle": "Modify tables, fields and relations in natural language",
    "chat.uml.welcome": "Import a workbook, then ask: \"Rename Customers to Accounts and link Orders.customer_id to Accounts.id.\"",
    "chat.uml.loading": "Updating model…",
    "chat.uml.error": "Agent error: ",
    "chat.uml.placeholder": "Add, rename or relate tables and fields…",

    "chat.odoo.title": "Requirement Analysis",
    "chat.odoo.welcome": "Please describe the Odoo page you want to add or modify. I will analyze business rules and update the prototype.",
    "chat.odoo.loading": "Agent is analyzing requirements and generating prototype…",
    "chat.odoo.error": "Cannot connect to LangGraph Server. Please make sure it is running at",
    "chat.odoo.placeholder": "e.g. Add two-level approval when amount exceeds 50,000…",
    "chat.odoo.hint": "Enter to send · Shift+Enter for newline",

    "excel.import": "Import Excel / CSV",
    "excel.failed": "Import failed",

    "workspace.addTable": "Add table",

    "type.string": "String",
    "type.integer": "Integer",
    "type.decimal": "Decimal",
    "type.boolean": "Boolean",
    "type.date": "Date",
    "type.datetime": "DateTime",
    "type.text": "Text",
    "type.uuid": "UUID",
    "type.unknown": "Unknown",

    "relation.one-to-one": "one-to-one",
    "relation.one-to-many": "one-to-many",
    "relation.many-to-one": "many-to-one",
    "relation.many-to-many": "many-to-many",

    "version.history": "History",
    "version.format": "v{n}",

    "relation.title": "Relation",
    "relation.type": "Type",
    "relation.sourceField": "Source field",
    "relation.targetField": "Target field",
    "relation.label": "Label (optional)",
    "relation.inferred": "Inferred",
    "relation.delete": "Delete relation",

    "table.addField": "Add field",
    "table.pk": "PK",
    "table.fk": "FK",
    "table.unique": "Unique",
    "table.nullable": "Nullable",
    "table.delete": "Delete table",

    "odoo.new": "+ New",
    "odoo.search": "Search...",
    "odoo.kanban.placeholder": "Kanban Renderer can be extended using the same Schema mechanism.",
    "odoo.user": "Admin",

    "form.confirm": "Confirm",
    "form.cancel": "Cancel",
    "form.new": "New",
    "form.businessRules": "Business Rules",
    "form.orderLines": "Order Lines",
    "form.product": "Product",
    "form.quantity": "Quantity",
    "form.unitPrice": "Unit Price",
    "form.subtotal": "Subtotal",
    "form.empty": "—",

    "dashboard.pipeline": "CRM Pipeline",
    "dashboard.teamActivity": "Team Activity",
    "dashboard.recently": "recently",
    "dashboard.months": "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec",
    "dashboard.activity1": "Sarah Kim closed a deal with Acme Corporation",
    "dashboard.activity2": "James Lee created invoice INV-2048",
    "dashboard.activity3": "Nora Diaz added 120 units to inventory",
    "dashboard.activity4": "Tom Blake updated the Q3 sales forecast",
  },
};

type LocaleContextType = {
  locale: Locale;
  toggleLocale: () => void;
  t: (key: string) => string;
};

const LocaleContext = createContext<LocaleContextType>({
  locale: "zh",
  toggleLocale: () => {},
  t: (key: string) => key,
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("zh");
  const toggleLocale = useCallback(() => setLocale((l) => (l === "zh" ? "en" : "zh")), []);
  const t = useCallback((key: string) => translations[locale][key] ?? key, [locale]);
  return (
    <LocaleContext.Provider value={{ locale, toggleLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
