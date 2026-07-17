from typing import Literal
from pydantic import BaseModel,Field
class UMLField(BaseModel):
 id:str; name:str; type:Literal['string','integer','decimal','boolean','date','datetime','text','uuid','unknown']='unknown'; nullable:bool=True; primaryKey:bool=False; foreignKey:bool=False; unique:bool=False
class UMLTable(BaseModel):
 id:str; name:str; fields:list[UMLField]=Field(default_factory=list)
class FieldPatch(BaseModel):
 table_name:str; field_name:str; new_name:str|None=None; type:str|None=None; nullable:bool|None=None; primary_key:bool|None=None; foreign_key:bool|None=None; unique:bool|None=None
class RelationPatch(BaseModel):
 source_table:str; source_field:str; target_table:str; target_field:str; type:Literal['one-to-one','one-to-many','many-to-one','many-to-many']='many-to-one'; action:Literal['add','remove']='add'
class UMLPatch(BaseModel):
 summary:str; table_renames:dict[str,str]=Field(default_factory=dict); tables_to_add:list[UMLTable]=Field(default_factory=list); tables_to_remove:list[str]=Field(default_factory=list); fields_to_add:dict[str,list[UMLField]]=Field(default_factory=dict); fields_to_update:list[FieldPatch]=Field(default_factory=list); fields_to_remove:dict[str,list[str]]=Field(default_factory=dict); relation_changes:list[RelationPatch]=Field(default_factory=list); clarification_question:str|None=None
