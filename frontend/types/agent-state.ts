import type { UMLProject } from "@/types/uml-schema";
export type AgentMessage={id?:string;type?:string;role?:string;content:string|Array<{type?:string;text?:string;[key:string]:unknown}>};
export type UMLAgentState={messages:AgentMessage[];project?:UMLProject;project_version?:number;requirement_summary?:string;pending_questions?:string[]};
