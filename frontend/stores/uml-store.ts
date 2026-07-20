"use client";
import {create} from "zustand";
import type {UMLField,UMLProject,UMLRelation,UMLTable} from "@/types/uml-schema";
export const emptyProject:UMLProject={id:"new",name:"Untitled UML Project",tables:[],relations:[],version:1,sourceFiles:[],roles:[],models:[]};
type S={project:UMLProject;history:UMLProject[];selectedTableId?:string;selectedRelationId?:string;setProject:(p:UMLProject,record?:boolean)=>void;selectTable:(id?:string)=>void;selectRelation:(id?:string)=>void;addTable:()=>void;renameTable:(id:string,name:string)=>void;moveTable:(id:string,x:number,y:number)=>void;deleteTable:(id:string)=>void;addField:(tid:string)=>void;updateField:(tid:string,fid:string,p:Partial<UMLField>)=>void;deleteField:(tid:string,fid:string)=>void;addRelation:(r:Omit<UMLRelation,"id">)=>void;updateRelation:(id:string,patch:Partial<UMLRelation>)=>void;deleteRelation:(id:string)=>void;restore:(i:number)=>void;reset:()=>void};
const clone=(p:UMLProject)=>JSON.parse(JSON.stringify(p)) as UMLProject;
const uid=()=>"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,c=>{const r=Math.random()*16|0;return(c==="x"?r:r&0x3|0x8).toString(16)});
export const useUMLStore=create<S>((set)=>({project:emptyProject,history:[emptyProject],
 setProject:(p,record=true)=>set(s=>({project:p,history:record?[...s.history,clone(p)]:s.history})),selectTable:(id)=>set({selectedTableId:id}),
 addTable:()=>set(s=>{const t:UMLTable={id:uid(),name:"NewTable",fields:[],position:{x:100+s.project.tables.length*30,y:100+s.project.tables.length*30}};const p={...s.project,tables:[...s.project.tables,t],version:s.project.version+1};return{project:p,history:[...s.history,clone(p)]}}),
 renameTable:(id,name)=>set(s=>{const p={...s.project,tables:s.project.tables.map(t=>t.id===id?{...t,name}:t),version:s.project.version+1};return{project:p,history:[...s.history,clone(p)]}}),
 moveTable:(id,x,y)=>set(s=>({project:{...s.project,tables:s.project.tables.map(t=>t.id===id?{...t,position:{x,y}}:t)}})),
 deleteTable:(id)=>set(s=>{const p={...s.project,tables:s.project.tables.filter(t=>t.id!==id),relations:s.project.relations.filter(r=>r.sourceTableId!==id&&r.targetTableId!==id),version:s.project.version+1};return{project:p,history:[...s.history,clone(p)]}}),
 addField:(tid)=>set(s=>{const f:UMLField={id:uid(),name:"new_field",type:"string",nullable:true};const p={...s.project,tables:s.project.tables.map(t=>t.id===tid?{...t,fields:[...t.fields,f]}:t),version:s.project.version+1};return{project:p,history:[...s.history,clone(p)]}}),
 updateField:(tid,fid,patch)=>set(s=>{const p={...s.project,tables:s.project.tables.map(t=>t.id===tid?{...t,fields:t.fields.map(f=>f.id===fid?{...f,...patch}:f)}:t),version:s.project.version+1};return{project:p,history:[...s.history,clone(p)]}}),
 deleteField:(tid,fid)=>set(s=>{const p={...s.project,tables:s.project.tables.map(t=>t.id===tid?{...t,fields:t.fields.filter(f=>f.id!==fid)}:t),relations:s.project.relations.filter(r=>r.sourceFieldId!==fid&&r.targetFieldId!==fid),version:s.project.version+1};return{project:p,history:[...s.history,clone(p)]}}),
 addRelation:(r)=>set(s=>{const p={...s.project,relations:[...s.project.relations,{...r,id:uid()}],version:s.project.version+1};return{project:p,history:[...s.history,clone(p)]}}),
updateRelation:(id,patch)=>set(s=>{const p={...s.project,relations:s.project.relations.map(r=>r.id===id?{...r,...patch}:r),version:s.project.version+1};return{project:p,history:[...s.history,clone(p)]}}),
deleteRelation:(id)=>set(s=>{const p={...s.project,relations:s.project.relations.filter(r=>r.id!==id),version:s.project.version+1};return{project:p,history:[...s.history,clone(p)],selectedRelationId:s.selectedRelationId===id?undefined:s.selectedRelationId}}),
selectRelation:(id)=>set({selectedRelationId:id,selectedTableId:undefined}),
 restore:(i)=>set(s=>({project:clone(s.history[i])})),reset:()=>set({project:emptyProject,history:[emptyProject],selectedTableId:undefined})}));
