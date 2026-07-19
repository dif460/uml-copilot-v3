import csv,io,re,uuid
from pathlib import Path
from fastapi import FastAPI,File,UploadFile,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from python_calamine import CalamineWorkbook
app=FastAPI(title='UML Copilot Parser');
app.add_middleware(CORSMiddleware,allow_origins=['http://113.250.180.110:3000'],allow_methods=['*'],allow_headers=['*'])
def name(v,f):
 s=re.sub(r'[^A-Za-z0-9_]+','_',str(v or '').strip()).strip('_');return s or f
def typ(vals):
 x=[v for v in vals if v not in (None,'')]
 if not x:return 'unknown'
 s=[str(v).strip() for v in x]
 if all(re.fullmatch(r'-?\d+',v) for v in s):return 'integer'
 if all(re.fullmatch(r'-?\d+(\.\d+)?',v) for v in s):return 'decimal'
 if all(v.lower() in {'true','false','yes','no','0','1'} for v in s):return 'boolean'
 if all(re.fullmatch(r'\d{4}[-/]\d{1,2}[-/]\d{1,2}.*',v) for v in s):return 'datetime' if any(':' in v for v in s) else 'date'
 return 'text' if max(map(len,s))>255 else 'string'
def table(sheet,rows):
 rows=[list(r) for r in rows if any(c not in (None,'') for c in r)]
 if not rows:return {'id':str(uuid.uuid4()),'name':name(sheet,'Table'),'sheetName':sheet,'fields':[],'rowCount':0}
 hs=[name(v,f'field_{i+1}') for i,v in enumerate(rows[0])]; data=rows[1:]; fs=[]
 for i,h in enumerate(hs):
  vals=[r[i] if i<len(r) else None for r in data]; non=[str(v) for v in vals if v not in (None,'')]; pk=bool(non and len(non)==len(set(non)) and (h.lower() in {'id','uuid'} or h.lower().endswith('_id')))
  fs.append({'id':str(uuid.uuid4()),'name':h,'type':typ(vals[:200]),'nullable':any(v in (None,'') for v in vals),'primaryKey':pk,'foreignKey':False,'unique':pk,'sampleValues':non[:5]})
 return {'id':str(uuid.uuid4()),'name':name(sheet,'Table'),'sheetName':sheet,'fields':fs,'rowCount':len(data)}
def infer(ts):
 out=[]; pks=[(t,f) for t in ts for f in t['fields'] if f['primaryKey']]
 for s in ts:
  for f in s['fields']:
   if f['primaryKey'] or not f['name'].lower().endswith('_id'):continue
   base=f['name'][:-3].lower()
   for t,p in pks:
    target=t['name'].lower(); singular=target[:-1] if target.endswith('s') else target
    if s['id']!=t['id'] and base in {target,singular}:
     f['foreignKey']=True;out.append({'id':str(uuid.uuid4()),'sourceTableId':s['id'],'sourceFieldId':f['id'],'targetTableId':t['id'],'targetFieldId':p['id'],'type':'many-to-one','label':f"{s['name']}.{f['name']} → {t['name']}.{p['name']}",'inferred':True,'confidence':0.95});break
 return out
@app.get('/health')
def health():return {'status':'ok'}
@app.post('/api/import/excel')
async def upload(file:UploadFile=File(...)):
 b=await file.read(); ext=Path(file.filename or '').suffix.lower()
 try:
  if ext=='.csv': ts=[table(Path(file.filename).stem,list(csv.reader(io.StringIO(b.decode('utf-8-sig',errors='replace')))))]
  else:
   wb=CalamineWorkbook.from_filelike(io.BytesIO(b));ts=[table(s,wb.get_sheet_by_name(s).to_python()) for s in wb.sheet_names]
 except Exception as e:raise HTTPException(400,f'Parse failed: {e}')
 for i,t in enumerate(ts):t['position']={'x':80+(i%3)*300,'y':80+(i//3)*260}
 return {'id':str(uuid.uuid4()),'name':Path(file.filename or 'model').stem,'description':'Inferred from workbook','tables':ts,'relations':infer(ts),'version':1,'sourceFiles':[file.filename]}
