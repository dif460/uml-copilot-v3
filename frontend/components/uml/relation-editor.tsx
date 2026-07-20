"use client";import {Trash2,X,ArrowRight} from "lucide-react";import {useUMLStore} from "@/stores/uml-store";import {useLocale} from "@/lib/i18n";import type {RelationType,FieldType} from "@/types/uml-schema";
const relationTypes:RelationType[]=["one-to-one","one-to-many","many-to-one","many-to-many"];
export function RelationEditor(){
  const p=useUMLStore(s=>s.project),rid=useUMLStore(s=>s.selectedRelationId),select=useUMLStore(s=>s.selectRelation),
    update=useUMLStore(s=>s.updateRelation),del=useUMLStore(s=>s.deleteRelation);
  const {t}=useLocale();
  const r=p.relations.find(x=>x.id===rid);
  if(!r)return null;
  const st=p.tables.find(t=>t.id===r.sourceTableId),tt=p.tables.find(t=>t.id===r.targetTableId);
  return <aside className="absolute right-3 top-3 z-20 max-h-[calc(100%-24px)] w-[340px] overflow-auto rounded-xl border bg-white shadow-xl">
    <div className="flex items-center border-b p-3">
      <span className="flex-1 font-semibold text-sm">{t("relation.title")}</span>
      <button onClick={()=>select()}><X size={15}/></button>
    </div>
    <div className="p-3 space-y-3">
      <div className="flex items-center gap-2 text-xs">
        <span className="font-medium text-[#714B67]">{st?.name??"?"}</span>
        <ArrowRight size={14} className="text-[#999]"/>
        <span className="font-medium text-[#714B67]">{tt?.name??"?"}</span>
      </div>
      <label className="block text-[10px] text-[#888]">{t("relation.type")}</label>
      <select value={r.type} onChange={e=>update(r.id,{type:e.target.value as RelationType})} className="w-full rounded border px-2 py-1.5 text-xs">
        {relationTypes.map(rt=><option key={rt} value={rt}>{t(`relation.${rt}`)}</option>)}
      </select>
      <label className="block text-[10px] text-[#888]">{t("relation.sourceField")} ({st?.name})</label>
      <select value={r.sourceFieldId} onChange={e=>update(r.id,{sourceFieldId:e.target.value})} className="w-full rounded border px-2 py-1.5 text-xs">
        {st?.fields.map(f=><option key={f.id} value={f.id}>{f.name} ({t(`type.${f.type}`)})</option>)}
      </select>
      <label className="block text-[10px] text-[#888]">{t("relation.targetField")} ({tt?.name})</label>
      <select value={r.targetFieldId} onChange={e=>update(r.id,{targetFieldId:e.target.value})} className="w-full rounded border px-2 py-1.5 text-xs">
        {tt?.fields.map(f=><option key={f.id} value={f.id}>{f.name} ({t(`type.${f.type}`)})</option>)}
      </select>
      <label className="block text-[10px] text-[#888]">{t("relation.label")}</label>
      <input value={r.label??""} onChange={e=>update(r.id,{label:e.target.value||undefined})} className="w-full rounded border px-2 py-1.5 text-xs"/>
      <div className="flex gap-2 text-[10px]">
        <label><input type="checkbox" checked={!!r.inferred} onChange={e=>update(r.id,{inferred:e.target.checked})}/> {t("relation.inferred")}</label>
      </div>
      <button onClick={()=>{del(r.id);select()}} className="w-full rounded border border-red-200 bg-red-50 p-2 text-xs text-red-700 flex items-center justify-center gap-1">
        <Trash2 size={13}/> {t("relation.delete")}
      </button>
    </div>
  </aside>
}
