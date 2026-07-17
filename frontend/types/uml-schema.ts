export type FieldType = "string"|"integer"|"decimal"|"boolean"|"date"|"datetime"|"text"|"uuid"|"unknown";
export type RelationType = "one-to-one"|"one-to-many"|"many-to-one"|"many-to-many";
export type UMLField={id:string;name:string;type:FieldType;nullable:boolean;primaryKey?:boolean;foreignKey?:boolean;unique?:boolean;sampleValues?:string[]};
export type UMLTable={id:string;name:string;sheetName?:string;fields:UMLField[];rowCount?:number;position?:{x:number;y:number}};
export type UMLRelation={id:string;sourceTableId:string;sourceFieldId:string;targetTableId:string;targetFieldId:string;type:RelationType;label?:string;inferred?:boolean;confidence?:number};
export type UMLProject={id:string;name:string;description?:string;tables:UMLTable[];relations:UMLRelation[];version:number;sourceFiles:string[]};
