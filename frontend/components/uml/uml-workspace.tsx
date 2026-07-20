"use client";import {useMemo,useCallback} from "react";import {Background,Controls,MarkerType,MiniMap,ReactFlow,type Connection,type Edge} from "@xyflow/react";import "@xyflow/react/dist/style.css";import {Plus} from "lucide-react";import {TableNode} from "./table-node";import {TableEditor} from "./table-editor";import {RelationEditor} from "./relation-editor";import {useUMLStore} from "@/stores/uml-store";import {useLocale} from "@/lib/i18n";
const nodeTypes={tableNode:TableNode};
export function UMLWorkspace(){
  const p=useUMLStore(s=>s.project),add=useUMLStore(s=>s.addTable),select=useUMLStore(s=>s.selectTable),move=useUMLStore(s=>s.moveTable),
    addRel=useUMLStore(s=>s.addRelation),deleteRel=useUMLStore(s=>s.deleteRelation),selectRel=useUMLStore(s=>s.selectRelation),
    selectedRid=useUMLStore(s=>s.selectedRelationId);
  const {t}=useLocale();
  const nodes=useMemo(()=>p.tables.map((t,i)=>({id:t.id,type:'tableNode',position:t.position??{x:80+(i%3)*300,y:80+Math.floor(i/3)*260},data:{table:t}})),[p.tables]);
  const edges=useMemo(()=>p.relations.map(r=>({id:r.id,source:r.sourceTableId,target:r.targetTableId,label:t(`relation.${r.type}`),animated:!!r.inferred,style:r.id===selectedRid?{stroke:"#714B67",strokeWidth:2}:undefined,markerEnd:{type:MarkerType.ArrowClosed}})),[p.relations,selectedRid,t]);
  const onConnect=useCallback((c:Connection)=>{
    if(!c.source||!c.target)return;
    const st=p.tables.find(t=>t.id===c.source),tt=p.tables.find(t=>t.id===c.target);
    addRel({sourceTableId:c.source,targetTableId:c.target,sourceFieldId:st?.fields[0]?.id??"",targetFieldId:tt?.fields[0]?.id??"",type:"one-to-many"});
  },[p.tables,addRel]);
  const onEdgesDelete=useCallback((es:Edge[])=>es.forEach(e=>deleteRel(e.id)),[deleteRel]);
  const onEdgeClick=useCallback((_:any,e:Edge)=>{selectRel(e.id)},[selectRel]);
  const onPaneClick=useCallback(()=>{selectRel(undefined);select(undefined)},[selectRel,select]);
  return <section className="relative min-w-0">
    <button onClick={add} className="absolute left-3 top-3 z-20 flex items-center gap-1 rounded bg-[#714B67] px-3 py-2 text-xs text-white"><Plus size={13}/>{t("workspace.addTable")}</button>
    <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} onConnect={onConnect} onEdgesDelete={onEdgesDelete} onEdgeClick={onEdgeClick} onNodeClick={(_,n)=>select(n.id)} onNodeDragStop={(_,n)=>move(n.id,n.position.x,n.position.y)} onPaneClick={onPaneClick} fitView deleteKeyCode={["Backspace","Delete"]}>
      <Background/><Controls/><MiniMap/>
    </ReactFlow>
    <TableEditor/>
    <RelationEditor/>
  </section>
}
