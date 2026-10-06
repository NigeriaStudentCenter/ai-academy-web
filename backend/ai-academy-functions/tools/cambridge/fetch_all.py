import re,subprocess,json,os,sys,concurrent.futures as cf
BASE="https://www.cambridgeinternational.org"
def get(url,out):
    return subprocess.run(["curl","-sL","-A","Mozilla/5.0","--max-time","60","-o",out,"-w","%{http_code}",url],capture_output=True,text=True).stdout
def years(name):
    m=re.search(r'-(\d{4})(?:-(\d{4}))?-syllabus',name); 
    return (int(m.group(1)), int(m.group(2) or m.group(1))) if m else (0,0)
def pick(links):
    # syllabus valid for 2027 if any, else the earliest one that starts after 2026, else the latest
    ls=sorted(set(links),key=years)
    for l in ls:
        a,b=years(l)
        if a<=2027<=b: return l
    fut=[l for l in ls if years(l)[0]>2026]
    return fut[0] if fut else (ls[-1] if ls else None)
def one(slug):
    code=slug.split('-')[-1]
    html=f"pages/{slug}.html"
    if not os.path.exists(html) or os.path.getsize(html)<5000: get(f"{BASE}/programmes-and-qualifications/{slug}/",html)
    t=open(html,errors='ignore').read()
    links=re.findall(r'/Images/\d+-[0-9-]+-syllabus\.pdf',t,re.I)
    title=re.search(r'<title>([^<]+)</title>',t)
    p=pick(links)
    if not p: return slug,code,None,title.group(1).strip() if title else ''
    pdf=f"pdf/{code}.pdf"
    if not os.path.exists(pdf): get(BASE+p,pdf)
    if not os.path.exists(f"{code}.txt") or code in sys.argv[2:]:
        subprocess.run(["pdftotext","-layout",pdf,f"{code}.txt"])
    return slug,code,p,title.group(1).strip() if title else ''
os.makedirs("pages",exist_ok=True); os.makedirs("pdf",exist_ok=True)
slugs=[l.strip() for f in ("cambridge-igcse.txt","cambridge-international-as-and-a-levels.txt") for l in open(f) if l.strip() and "9-1" not in l]
with cf.ThreadPoolExecutor(6) as ex: res=list(ex.map(one,slugs))
json.dump(res,open("catalog.json","w"),indent=1)
for r in res:
    if not r[2]: print("NO SYLLABUS",r[0])
print(len(res),"subjects;",sum(1 for r in res if r[2]),"with syllabi")
