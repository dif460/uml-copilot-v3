export type FieldType = "string"|"integer"|"decimal"|"boolean"|"date"|"datetime"|"text"|"uuid"|"unknown";
export type RelationType = "one-to-one"|"one-to-many"|"many-to-one"|"many-to-many";
export type UMLField={id:string;name:string;type:FieldType;nullable:boolean;primaryKey?:boolean;foreignKey?:boolean;unique?:boolean;sampleValues?:string[]};
export type UMLTable={id:string;name:string;sheetName?:string;fields:UMLField[];rowCount?:number;position?:{x:number;y:number}};
export type UMLRelation={id:string;sourceTableId:string;sourceFieldId:string;targetTableId:string;targetFieldId:string;type:RelationType;label?:string;inferred?:boolean;confidence?:number};
// ---- 角色 & 模型定义 ----
export type Role={id:string;name:string;technicalName:string;inherits?:string[]};
export type ModelAccess={read:boolean;create:boolean;write:boolean;unlink:boolean};
export type ModelField={id:string;name:string;technicalName:string;fieldType:string;accessByRole:Record<string,"editable"|"readonly"|"hidden">};
export type Model={id:string;name:string;technicalName:string;module:string;position:{x:number;y:number};accessByRole:Record<string,ModelAccess>;recordScopeByRole:Record<string,string>;fields:ModelField[]};
export type UMLProject={id:string;name:string;description?:string;tables:UMLTable[];relations:UMLRelation[];version:number;sourceFiles:string[];roles:Role[];models:Model[]};
