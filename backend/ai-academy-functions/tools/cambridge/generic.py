import re,json,html
from build import subs as heading_subs, command_words, chunk
def lines_of(code): return open(f"{code}.txt",encoding="utf-8",errors="ignore").read().replace('\t','    ').split("\n")
JUNK=re.compile(r'www\.|Back to contents|syllabus for|^\s*\d+\s*$|Cambridge (IGCSE|International)')
def exam_years(L):
    for l in L[:80]:
        m=re.search(r'for (?:examination in|exams in) ([0-9, and]+\d)',l)
        if m: return m.group(1).strip()
    return None
def overview(L):
    """Lines of the Content overview section (up to Assessment overview)."""
    idx=[i for i,l in enumerate(L) if re.match(r'^\s*Content overview\s*$',l)]
    if not idx: return []
    i=idx[-1] if len(idx)>1 and idx[-1]>idx[0]+5 else idx[0]
    # skip the table-of-contents hit
    if any('....' in x for x in L[i:i+3]): i=idx[-1]
    out=[]
    for l in L[i+1:i+120]:
        if re.match(r'^\s*Assessment overview\s*$',l) or re.match(r'^\s*\d\s+Details of the assessment',l): break
        if JUNK.search(l): continue
        out.append(l)
    return out
def topics_from_overview(ov):
    tops=[]
    for l in ov:
        s=l.strip()
        m=re.match(r'^(?:Topic\s+)?(\d{1,2})\.?\s{1,6}([A-Z][^.]{2,80}?)(?:\s{3,}.*)?$',s)
        if m and not re.match(r'^\d+\.\d',s):
            n,t=int(m.group(1)),m.group(2).strip().rstrip(':')
            if (not tops and n==1) or (tops and n==tops[-1][0]+1): tops.append((n,t))
    if len(tops)>=3: return [t for _,t in tops]
    bul=[re.sub(r'^[•\-–]\s*','',l.strip()).rstrip('.;') for l in ov if re.match(r'^\s*[•\-–]\s+[A-Z]',l)]
    bul=[b for b in bul if 3<len(b)<80]
    return bul if len(bul)>=3 else []
def papers(L):
    out=[]
    for l in L:
        for m in re.finditer(r'\b((?:Paper|Component)\s+\d{1,2})\s*[:–-]?\s{0,3}([A-Z][A-Za-z ,&/()\-]{3,60}?)(?=\s{3,}|\s*$|\s+\d+\s*(?:hour|minutes|%))',l):
            p=f"{m.group(1)}: {m.group(2).strip()}"
            if not any(p.split(':')[0]==q.split(':')[0] for q in out) and not re.search(r'\b(and|or|the|candidates|is|are)$',p): out.append(p)
    return sorted(out,key=lambda p:int(re.search(r'\d+',p).group()))[:10]
def tiered(L):
    t="\n".join(L[:600])
    return bool(re.search(r'\(Core\)',t) and re.search(r'\(Extended\)',t))
def build(code,name,stage,qual):
    L=lines_of(code)
    ov=overview(L)
    tops=topics_from_overview(ov)
    sub=heading_subs(code)
    pp=papers(L)
    src="overview"
    if not tops:
        nums=sorted({int(re.sub(r'\D','',k.split('.')[0])) for k in sub if re.sub(r'\D','',k.split('.')[0])})
        if len(nums)>=3: tops=[f"Topic {n}" for n in nums]; src="headings"
    if not tops:
        tops=[re.sub(r'^(Paper|Component) \d+: ','',p) for p in pp]; src="papers"
    topics=[]
    for i,t in enumerate(tops):
        n=str(i+1)
        su=[dict(n=k,title=v) for k,v in sorted(sub.items(),key=lambda kv:(int(re.sub(r'\D','',kv[0].split('.')[1]) or 0))) if re.sub(r'^[CE]','',k.split('.')[0])==n and not k[0] in 'CE'] if src!="papers" else []
        topics.append(dict(n=n,name=t,subtopics=su))
    t="\n".join(L)
    return dict(code=code,name=name,stage=stage,qualification=qual,years=exam_years(L),tiered=tiered(L),papers=pp,
        practical="Alternative to Practical" if "Alternative to Practical" in t else None,topics=topics,
        commandWords=command_words(code),_src=src)

def content_start(L):
    for i,l in enumerate(L):
        if re.match(r'^\s*\d\s+Subject content\s*$',l) and not any('....' in x for x in L[i:i+2]): return i
    return 0
def topic_headings(L):
    """Top-level 'N   Title' headings inside the Subject content section."""
    s=content_start(L); out={}
    for l in L[s+1:]:
        if re.match(r'^\s*\d\s+(Details of the assessment|What else you need)',l): break
        m=re.match(r'^\s{0,14}(\d{1,2})\s{2,10}([A-Z][A-Za-z0-9 ,’\'()–\-:&/]{2,80}?)(?:\s+continued)?\s*$',l)
        if m:
            n=int(m.group(1)); t=m.group(2).strip()
            if n not in out and len(t.split())<=12 and not re.match(VERB_RE,t): out[n]=t
    return out
VERB_RE=r'^(Use|Know|Find|Solve|Explain|Describe|Recognise|Apply|State|Define|Understand|Calculate|Show|Draw|Identify|Candidates)\b'
