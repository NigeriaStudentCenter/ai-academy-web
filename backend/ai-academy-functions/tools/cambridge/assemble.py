import json,re,html,generic
cur=json.load(open('cambridge-syllabi.json'))            # the 23 hand-checked syllabi
cat=json.load(open('catalog.json'))
SKIP={'0995','8101','8102','9686'}                         # 9-1 duplicate, US-only and Pakistan-only variants
NAMES={'0548':'Afrikaans (Second Language)','0508':'Arabic (First Language)','0544':'Arabic (Foreign Language)','0538':'Bahasa Indonesia',
'0509':'Chinese (First Language)','0547':'Chinese Mandarin (Foreign Language)','0523':'Chinese (Second Language)','0465':'Core English as a Second Language',
'0472':'English as an Additional Language','0500':'First Language English','0524':'First Language English (US)','0992':'Literature in English',
'0511':'English as a Second Language (Count-in Speaking)','0510':'English as a Second Language (Speaking Endorsement)','0501':'French (First Language)',
'0520':'French (Foreign Language)','0505':'German (First Language)','0525':'German (Foreign Language)','0409':'American History (US)',
'0417':'Information and Communication Technology','0535':'Italian (Foreign Language)','0716':'Japanese (Foreign Language)','0696':'Malay (First Language)',
'0546':'Malay (Foreign Language)','0697':'Marine Science','0606':'Additional Mathematics','0444':'Mathematics (US)','0504':'Portuguese (First Language)',
'0653':'Combined Science','0654':'Co-ordinated Sciences (Double Award)','0698':'Setswana (First Language)','0502':'Spanish (First Language)',
'0530':'Spanish (Foreign Language)','0518':'Thai (First Language)','0513':'Turkish (First Language)','0695':'Vietnamese (First Language)',
'0539':'Urdu as a Second Language','0400':'Art and Design','0445':'Design and Technology','0264':'Business','0265':'Computer Science (0265)',
'9680':'Arabic','9865':'Arabic Language & Literature','8680':'Arabic Language','9868':'Chinese Language & Literature','8695':'English Language and Literature',
'9695':'English Literature','8291':'Environmental Management','9898':'French Language & Literature','8021':'General Paper','9897':'German',
'9239':'Global Perspectives & Research','9981':'European History','9982':'International History','9231':'Further Mathematics','9718':'Portuguese',
'8684':'Portuguese Language','9990':'Psychology','9844':'Spanish Language & Literature','9689':'Tamil','8689':'Tamil Language','8686':'Urdu Language',
'9866':'Urdu Language & Literature','9481':'Digital Media & Design','0607':'International Mathematics','0652':'Physical Science'}
def lettered(code,prefixes):
    L=generic.lines_of(code); ov=generic.overview(L); out=[]
    for l in ov:
        for m in re.finditer(r'\b([BCP]\d{1,2})\.{0,2}\s*([A-Z][A-Za-z ,()\-]+?)(?=\s{3,}|\s*$)',l):
            if m.group(1)[0] in prefixes and m.group(1) not in [o[0] for o in out]: out.append((m.group(1),m.group(2).strip()))
    order={p:i for i,p in enumerate(prefixes)}
    return sorted(out,key=lambda x:(order[x[0][0]],int(x[0][1:])))
OVERRIDE_TOPICS={
 '0493':['Major themes of the Qur’an','The history and importance of the Qur’an','The life and importance of the Prophet Muhammad (pbuh)','The first Islamic community','Major teachings in the Hadiths of the Prophet','The history and importance of the Hadiths','The Articles of Faith and the Pillars of Islam'],
 '9484':['The Four Gospels (Paper 1)','The Development of Christianity (Paper 2)','Prophets of the Old Testament (Paper 3)','Christian Understandings of God, Life and the Universe (Paper 4)'],
 '9990':['Biological approach (AS Level)','Cognitive approach (AS Level)','Learning approach (AS Level)','Social approach (AS Level)','Research methods (AS Level)','Clinical Psychology (A Level option)','Consumer Psychology (A Level option)','Health Psychology (A Level option)','Organisational Psychology (A Level option)'],
 '9487':['Concepts in Hinduism (Paper 1)','Development of Hinduism (Paper 2)','Hinduism: Philosophy and Religion (Paper 3)','Hinduism in Contemporary Society (Paper 4)'],
}
LEVELS={'9990':['AS']*5+['A2']*4,'9484':['AS','AS','A2','A2'],'9487':['AS','AS','A2','A2']}
out=dict(cur)
for slug,code,pdf,title in cat:
    if code in cur or code in SKIP: continue
    st="alevel" if slug.startswith("cambridge-international-as") else "igcse"
    name=NAMES.get(code) or re.sub(r'\s*-\s*\d{4}\s*$','',html.unescape(re.sub(r'\s*\(\d{4}\).*$','',title)).replace('Cambridge IGCSE ','').replace('Cambridge International AS & A Level ','').strip()).strip(' -')
    qual="Cambridge IGCSE" if st=="igcse" else ("Cambridge International AS Level" if "as-level-only" in slug or code in ('8021','8291') else "Cambridge International AS & A Level")
    s=generic.build(code,name,st,qual)
    L=generic.lines_of(code)
    if code in ('0652','0653','0654'):
        tops=lettered(code,'BCP')
        s['topics']=[dict(n=c,name=t,subtopics=[]) for c,t in tops]
    elif code in OVERRIDE_TOPICS:
        sub={} if code=='9990' else generic.heading_subs(code)
        s['topics']=[dict(n=str(i+1),name=t,subtopics=[dict(n=k,title=v) for k,v in sub.items() if k.split('.')[0]==str(i+1)],**({'level':LEVELS[code][i]} if code in LEVELS else {})) for i,t in enumerate(OVERRIDE_TOPICS[code])]
    elif code in ('8689','8686'):
        s['topics']=[dict(n=str(i+1),name=re.sub(r'^(Paper|Component) \d+: ','',p),subtopics=[]) for i,p in enumerate(s['papers'])]
    elif s['_src']=='headings' or code in ('9706','9231','9699','0607','0479'):
        h=generic.topic_headings(L)
        if len(h)>=3:
            sub=generic.heading_subs(code)
            s['topics']=[dict(n=str(n),name=re.sub(r'\s{2,}.*$','',t),subtopics=[dict(n=k,title=v) for k,v in sub.items() if k.split('.')[0]==str(n)]) for n,t in sorted(h.items())]
    for t in s['topics']:
        m=re.search(r'\((AS|A) Level(?: option)?\)',t['name'])
        if m: t['level']='AS' if m.group(1)=='AS' else 'A2'
    if not s['commandWords']:
        s['commandWords']=[w for w in cur['0625']['commandWords'] if w['word'] in ('Describe','Explain','Give','Identify','State','Suggest','Compare')]+[w for w in cur['9708']['commandWords'] if w['word'] in ('Analyse','Discuss','Evaluate')]
    s.pop('_src',None)
    out[code]=s
json.dump(out,open('cambridge-syllabi-all.json','w'),indent=1,ensure_ascii=False)
from collections import Counter
print(Counter(s['stage'] for s in out.values()), len(out))
for c,s in out.items():
    if c in cur: continue
    print(c,s['stage'][:2],s['name'][:40].ljust(40),len(s['topics']),sum(len(t['subtopics']) for t in s['topics']),'|','; '.join(t['name'] for t in s['topics'])[:90])
