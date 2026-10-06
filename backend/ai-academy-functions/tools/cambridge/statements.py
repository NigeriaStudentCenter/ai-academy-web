# Learning statements per sub-topic, from the syllabus text (pdftotext -layout).
import re,json
FURN=re.compile(r'Back to contents page|www\.cambridgeinternational|syllabus for \d{4}|^\s*\d+\s*$|Subject content\s*$')
HEAD=re.compile(r'^\s*([CE]?)(\d{1,2})\.(\d{1,2})[\s\t]{1,16}([A-Z][A-Za-z0-9 ,’\'()–\-:&/]{2,90}?)(?:\s+continued)?(?=\s{3,}|\t|\s*$)')
def fix(t):
    t=t.replace('\u0007','')
    t=re.sub(r'×\s*10\s?(\d{1,2})\b',r'× 10^\1',t)
    t=re.sub(r'\b(dm|cm|m|mm|km)3\b',r'\1³',t); t=re.sub(r'\b(dm|cm|m|mm|km)2\b',r'\1²',t)
    t=re.sub(r'[ \t]+',' ',t)
    return t.strip()
def statements(code, valid, topics=()):
    tops=set(t.lower() for t in topics)
    lines=open(f"{code}.txt",encoding="utf-8",errors="ignore").read().replace('\t','    ').split("\n")
    # content section only
    start=next((i for i,l in enumerate(lines) if re.match(r'^\s*3\s+Subject content\s*$',l) or re.match(r'^\s*\d\s+Subject content\s*$',l)), 0)
    out={}; cur=None; split=None; buf={'L':[],'R':[]}; mode=None
    def flush():
        if cur is None: return
        L=fix("\n".join(buf['L'])); R=fix("\n".join(buf['R']))
        e=out.setdefault(cur,{})
        if mode=='cs': e['core']=(e.get('core','')+"\n"+L).strip(); e['supplement']=(e.get('supplement','')+"\n"+R).strip()
        else: e['text']=(e.get('text','')+"\n"+L).strip()
    for l in lines[start+1:]:
        if re.match(r'^\s*\d\s+(Details of the assessment|What else you need to know|Practical assessment)',l): break
        m=HEAD.match(l)
        if m:
            key=f"{m.group(1)}{m.group(2)}.{m.group(3)}"
            if key in valid:
                flush(); cur=key; buf={'L':[],'R':[]}; split=None; mode=None
                n=re.search(r'\s{3,}(Notes and examples)\s*$',l)
                if n: split=n.start(1); mode='notes'
                o=re.search(r'\s{3,}(Learning outcomes)\s*$',l)
                if o: split=o.start(1); mode='outcomes'
                continue
        if cur is None or FURN.search(l) or not l.strip() or 'Extended content only' in l: continue
        tm=re.match(r'^\s*\d{1,2}\s+(.+?)\s*$',l)
        if tm and tm.group(1).lower() in tops: continue
        h=re.match(r'^(\s*)Core\s{5,}Supplement\s*$',l)
        if h: split=l.index('Supplement'); mode='cs'; continue
        n=re.search(r'\s{3,}(Notes and examples|Notes)\s*$',l)
        if n: split=n.start(1); mode='notes'; continue
        l=re.sub(r'^(\s*)(\d{1,2}|\([a-z]\)|•)\s{2,}(?=\S)', r'\1\2 ', l)
        if mode == 'outcomes':
            # Heading on the left, learning outcomes on the right.
            if len(l) > split - 2 and l[split-2:].strip(): buf['L'].append(l[split-2:].strip())
            continue
        if mode is None:
            # No column header: keep the statement column, plus right-column bullets.
            indent=len(l)-len(l.lstrip())
            parts=re.split(r'\s{4,}', l.strip())
            if indent > 40:
                if parts[0].startswith('•') or (buf['L'] and buf['L'][-1].lstrip().startswith('•')): buf['L'].append(l.strip())
                continue
            buf['L'].append(parts[0])
            buf['L'].extend(p_ for p_ in parts[1:] if p_.startswith('•'))
            continue
        if split and len(l)>split-2:
            cut=split
            for pos in range(min(split, len(l)-1), max(split-10,1), -1):
                if l[pos-1]==' ' and l[pos-2]==' ': cut=pos; break
            left,right=l[:cut],l[cut:]
        else: left,right=l,''
        if left.strip(): buf['L'].append(left.strip())
        if mode=='cs' and right.strip(): buf['R'].append(right.strip())
    flush()
    # join wrapped lines into one line per numbered statement
    def tidy(t):
        items=[]; 
        for ln in t.split("\n"):
            if re.match(r'^(\d+\.\d+\.\d+|\d{1,2}|\([a-z]\)|•)\s',ln) or not items: items.append(ln)
            else: items[-1]+=' '+ln
        return "\n".join(i.strip() for i in items if i.strip())
    return {k:{f:tidy(v) for f,v in e.items() if v} for k,e in out.items()}
if __name__=="__main__":
    S=json.load(open('cambridge-syllabi.json'))
    import sys
    code,key=sys.argv[1],sys.argv[2]
    valid=set()
    for t in S[code]['topics']:
        for u in t['subtopics']:
            valid.add(u['n'])
            if code=='0580': valid|={'C'+u['n'],'E'+u['n']}
    st=statements(code,valid,[t['name'] for t in S[code]['topics']]); print(json.dumps(st.get(key),indent=1,ensure_ascii=False)[:2500]); print(len(st),"blocks")

def build_all():
    S=json.load(open('cambridge-syllabi.json'))
    out={}
    for code,sy in S.items():
        if sy['stage']=='lower' or code in ('0606','0500'): continue
        valid=set()
        for t in sy['topics']:
            for u in t['subtopics']:
                valid.add(u['n'])
                if code=='0580': valid|={'C'+u['n'],'E'+u['n']}
        st=statements(code,valid,[t['name'] for t in sy['topics']])
        clean=lambda x: re.sub(r'\s+continued\b','',x).strip()
        res={}
        if code=='0580':
            for t in sy['topics']:
                for u in t['subtopics']:
                    c=st.get('C'+u['n'],{}).get('text',''); e=st.get('E'+u['n'],{}).get('text','')
                    res[u['n']]={k:clean(v) for k,v in (('core',c),('extended',e)) if v}
        else:
            for k,v in st.items(): res[k]={f:clean(x) for f,x in v.items() if clean(x)}
        out[code]=res
    return out
