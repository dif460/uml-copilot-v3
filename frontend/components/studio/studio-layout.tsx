"use client";
import {UMLHeader} from "./uml-header";import {UMLChat} from "./uml-chat";import {VersionPanel} from "./version-panel";import {UMLWorkspace} from "@/components/uml/uml-workspace";
export function StudioLayout(){return <main className="flex h-screen flex-col overflow-hidden bg-[#f8f9fa]"><UMLHeader/><section className="grid min-h-0 flex-1 grid-cols-[380px_minmax(0,1fr)]"><div className="flex min-h-0 flex-col border-r bg-[#fafafa]"><div className="min-h-0 flex-1"><UMLChat/></div><VersionPanel/></div><UMLWorkspace/></section></main>}
