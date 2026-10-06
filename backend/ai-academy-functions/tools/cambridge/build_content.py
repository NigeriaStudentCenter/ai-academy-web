import json,re,statements,generic
S=json.load(open('cambridge-syllabi-all.json'))
def norm(s): return re.sub(r'[^a-z0-9]+',' ',s.lower()).strip()
def topic_texts_a(code, topics):
    L=generic.lines_of(code); start=generic.content_start(L)
    body=L[start+1:]
    end=next((i for i,l in enumerate(body) if re.match(r'^\s*\d\s+(Details of the assessment|What else you need)',l)),len(body))
    body=body[:end]
    keys=[norm(re.sub(r'\s*\((AS|A) Level.*?\)|\s*\(Paper \d\)|\s*\(for Paper.*?\)','',t['name']))[:40] for t in topics]
    pos=[]
    for k in keys:
        hit=None
        for i,l in enumerate(body):
            nl=norm(re.sub(r'^\s*([A-Z]?\d{1,2}\.?|Topic \d+:?|Paper \d+:?)\s+','',l.strip()))
            if k and nl.startswith(k) and len(l.strip())<len(k)+40 and (not pos or pos[-1] is None or i>pos[-1]):
                hit=i; break
        pos.append(hit)
    out={}
    for j,(t,p) in enumerate(zip(topics,pos)):
        if p is None: continue
        nxt=min([q for q in pos[j+1:] if q is not None]+[len(body)])
        txt=[]
        for l in body[p+1:nxt]:
            if statements.FURN.search(l) or not l.strip(): continue
            txt.append(re.sub(r'\s{3,}',' — ',l.strip()))
        text=statements.fix("\n".join(txt))[:3500]
        if len(text)>60: out['T'+t['n']]={'text':text}
    return out
def topic_texts_b(code, topics):
    L=generic.lines_of(code); start=generic.content_start(L)
    body=L[start+1:]
    end=next((i for i,l in enumerate(body) if re.match(r'^\s*\d\s+(Details of the assessment|What else you need)',l)),len(body))
    body=body[:end]
    keys=[norm(re.sub(r'\s*\((AS|A) Level.*?\)|\s*\(Paper \d\)|\s*\(for Paper.*?\)','',t['name']))[:40] for t in topics]
    pos=[]
    for k in keys:
        hit=None
        for i,l in enumerate(body):
            first=re.split(r'\s{3,}',re.sub(r'^\s*([A-Z]?\d{1,2}\.?|Topic \d+:?|Paper \d+:?)\s+','',l.strip()))[0]
            nl=norm(re.sub(r'^\s*([A-Z]?\d{1,2}\.?|Topic \d+:?|Paper \d+:?)\s+','',first))
            if k and nl.startswith(k[:30]) and len(first)<len(k)+40 and (not pos or pos[-1] is None or i>pos[-1]):
                hit=i; break
        pos.append(hit)
    out={}
    for j,(t,p) in enumerate(zip(topics,pos)):
        if p is None: continue
        nxt=min([q for q in pos[j+1:] if q is not None]+[len(body)])
        txt=[]
        for l in body[p+1:nxt]:
            if statements.FURN.search(l) or not l.strip(): continue
            txt.append(re.sub(r'\s{3,}',' — ',l.strip()))
        text=statements.fix("\n".join(txt))[:3500]
        if len(text)>60: out['T'+t['n']]={'text':text}
    return out
def topic_texts(code,topics):
    r=topic_texts_b(code,topics)
    r.update(topic_texts_a(code,topics))
    return r

content=json.load(open('cambridge-content.json'))   # the 23 already built
for code,sy in S.items():
    if sy['stage']=='lower': continue
    res=content.get(code,{})
    if code not in content:
        valid={u['n'] for t in sy['topics'] for u in t['subtopics']}
        if valid:
            st=statements.statements(code,valid,[t['name'] for t in sy['topics']])
            res={k:{f:re.sub(r'\s+continued\b','',x).strip() for f,x in v.items() if x.strip()} for k,v in st.items()}
    need=[t for t in sy['topics'] if not t['subtopics']]
    if need: res.update({k:v for k,v in topic_texts(code,need).items() if k not in res})
    content[code]=res
json.dump(content,open('cambridge-content-all.json','w'),ensure_ascii=False)
missing=[]
for code,sy in S.items():
    if sy['stage']=='lower': continue
    r=content.get(code,{}); tot=0; got=0
    for t in sy['topics']:
        keys=[u['n'] for u in t['subtopics']] or ['T'+t['n']]
        for k in keys:
            tot+=1; got+= 1 if k in r and any(r[k].values()) else 0
    if got<tot: missing.append(f"{code}:{got}/{tot}")
import os; print(len(content),"syllabi;",os.path.getsize('cambridge-content-all.json')//1024,"KB"); print("partial coverage:"," ".join(missing))
