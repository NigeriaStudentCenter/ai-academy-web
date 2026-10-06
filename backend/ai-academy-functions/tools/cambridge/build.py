# Builds cambridge-syllabi.json from the official syllabus PDFs (pdftotext -layout)
# plus the topic lists / AS-A Level splits read from each syllabus's Content overview.
import re,json
VERB=r'^(Use|Know|Find|Solve|Explain|Describe|Recognise|Apply|Differentiate|Evaluate|Transform|State|Define|Understand|Calculate|Show|Draw|Determine|Sketch|Interpret|Identify|Carry|Construct|Write|Read|Recall|Distinguish|Compare|Investigate|Outline|Discuss|Analyse|Name|Plot|Select|Perform|Demonstrate|Deduce|Predict|Suggest|Express|Obtain|Make|Measure|Represent|Give|List)\b'
JOIN=('of','in','and','the','to','for','with','on','between','at','by','a','an','or','including','their')
def chunk(s): return re.split(r'\s{3,}|\t', s.strip())[0] if s.strip() else ''
def subs(code):
    lines=open(f"{code}.txt",encoding="utf-8",errors="ignore").read().split("\n")
    out={}
    for i,raw in enumerate(lines):
        m=re.match(r'^\s*([CE]?)(\d{1,2})\.(\d{1,2})[\s\t]{1,10}([A-Z][A-Za-z0-9 ,’\'()–\-:&/]{2,90}?)(?:\s+continued)?(?=\s{3,}|\t|\s*$)',raw)
        if not m: continue
        pre,a,b,title=m.groups(); title=title.strip()
        if len(title.split())>12 or re.match(VERB,title) or title.endswith((',',':')) or title.startswith('Extended content only'): continue
        nxt=chunk(lines[i+1]) if i+1<len(lines) else ''
        if nxt and nxt[0].islower() and len(nxt.split())<=6 and not nxt.endswith('.'):
            title=f"{title} {nxt}"
        elif title.split()[-1].lower() in JOIN:
            for nxt in lines[i+1:i+3]:
                c=chunk(nxt)
                if c and not re.match(r'^[CE]?\d',c): title=f"{title} {c}"; break
        key=f"{pre}{a}.{b}"
        if key not in out: out[key]=title
    return out

S={}
def igcse(code,name,years,topics,tiered,papers,atp=None,grades="A*–G"):
    S[code]=dict(code=code,name=name,stage="igcse",qualification="Cambridge IGCSE",years=years,tiered=tiered,papers=papers,practical=atp,grades=grades,topics=topics)
def alevel(code,name,years,topics,papers,atp=None):
    S[code]=dict(code=code,name=name,stage="alevel",qualification="Cambridge International AS & A Level",years=years,tiered=False,papers=papers,practical=atp,topics=topics)

SCI_PAPERS=["Paper 1: Multiple Choice (Core)","Paper 2: Multiple Choice (Extended)","Paper 3: Theory (Core)","Paper 4: Theory (Extended)","Paper 5: Practical Test","Paper 6: Alternative to Practical"]
SCI_ATP="Paper 6: Alternative to Practical (or Paper 5: Practical Test)"
igcse("0625","Physics","2026, 2027 and 2028",["Motion, forces and energy","Thermal physics","Waves","Electricity and magnetism","Nuclear physics","Space physics"],True,SCI_PAPERS,SCI_ATP)
igcse("0620","Chemistry","2026, 2027 and 2028",["States of matter","Atoms, elements and compounds","Stoichiometry","Electrochemistry","Chemical energetics","Chemical reactions","Acids, bases and salts","The Periodic Table","Metals","Chemistry of the environment","Organic chemistry","Experimental techniques and chemical analysis"],True,SCI_PAPERS,SCI_ATP)
igcse("0610","Biology","2026, 2027 and 2028",["Characteristics and classification of living organisms","Organisation of the organism","Movement into and out of cells","Biological molecules","Enzymes","Plant nutrition","Human nutrition","Transport in plants","Transport in animals","Diseases and immunity","Gas exchange in humans","Respiration","Excretion in humans","Coordination and response","Drugs","Reproduction","Inheritance","Variation and selection","Organisms and their environment","Human influences on ecosystems","Biotechnology and genetic modification"],True,SCI_PAPERS,SCI_ATP)
igcse("0580","Mathematics","2025, 2026 and 2027",["Number","Algebra and graphs","Coordinate geometry","Geometry","Mensuration","Trigonometry","Transformations and vectors","Probability","Statistics"],True,["Paper 1: Non-calculator (Core)","Paper 2: Non-calculator (Extended)","Paper 3: Calculator (Core)","Paper 4: Calculator (Extended)"])
igcse("0606","Additional Mathematics","2025, 2026 and 2027",["Functions","Quadratic functions","Factors of polynomials","Equations, inequalities and graphs","Simultaneous equations","Logarithmic and exponential functions","Straight-line graphs","Coordinate geometry of the circle","Circular measure","Trigonometry","Permutations and combinations","Series","Vectors in two dimensions","Calculus"],False,["Paper 1: Non-calculator","Paper 2: Calculator"],grades="A*–E")
igcse("0455","Economics","2027, 2028 and 2029",["The basic economic problem","The allocation of resources","Microeconomic decision-makers","Government and the macroeconomy","Economic development","International trade and globalisation"],False,["Paper 1: Multiple Choice","Paper 2: Structured Questions"])
igcse("0450","Business Studies","2026",["Understanding business activity","People in business","Marketing","Operations management","Financial information and decisions","External influences on business activity"],False,["Paper 1: Short Answer and Data Response","Paper 2: Case Study"])
igcse("0460","Geography","2027, 2028 and 2029",["Changing river environments","Changing coastal environments","Changing ecosystems","Tectonic hazards","Climate change","Changing populations","Changing towns and cities","Development","Changing economies","Resource provision"],False,["Paper 1: Physical Geography","Paper 2: Human Geography","Paper 3: Geographical Skills and Fieldwork"])
igcse("0478","Computer Science","2026, 2027 and 2028",["Data representation","Data transmission","Hardware","Software","The internet and its uses","Automated and emerging technologies","Algorithm design and problem-solving","Programming","Databases","Boolean logic"],False,["Paper 1: Computer Systems","Paper 2: Algorithms, Programming and Logic"])
igcse("0500","First Language English","2027, 2028 and 2029",["Reading","Directed writing","Composition (descriptive and narrative writing)","Coursework","Speaking and listening"],False,["Paper 1: Reading","Paper 2: Directed Writing and Composition","Component 3: Coursework Portfolio","Component 4: Speaking and Listening (optional, separately endorsed)"])

AS_PRACT=["Paper 3: Advanced Practical Skills (AS Level)","Paper 5: Planning, Analysis and Evaluation (A Level)"]
def split(names,as_upto): return [dict(name=n,level="AS" if i+1<=as_upto else "A2") for i,n in enumerate(names)]
alevel("9702","Physics","2025, 2026 and 2027",split(["Physical quantities and units","Kinematics","Dynamics","Forces, density and pressure","Work, energy and power","Deformation of solids","Waves","Superposition","Electricity","D.C. circuits","Particle physics","Motion in a circle","Gravitational fields","Temperature","Ideal gases","Thermodynamics","Oscillations","Electric fields","Capacitance","Magnetic fields","Alternating currents","Quantum physics","Nuclear physics","Medical physics","Astronomy and cosmology"],11),["Paper 1: Multiple Choice","Paper 2: AS Level Structured Questions","Paper 3: Advanced Practical Skills","Paper 4: A Level Structured Questions","Paper 5: Planning, Analysis and Evaluation"],AS_PRACT)
alevel("9700","Biology","2025, 2026 and 2027",split(["Cell structure","Biological molecules","Enzymes","Cell membranes and transport","The mitotic cell cycle","Nucleic acids and protein synthesis","Transport in plants","Transport in mammals","Gas exchange","Infectious diseases","Immunity","Energy and respiration","Photosynthesis","Homeostasis","Control and coordination","Inheritance","Selection and evolution","Classification, biodiversity and conservation","Genetic technology"],11),["Paper 1: Multiple Choice","Paper 2: AS Level Structured Questions","Paper 3: Advanced Practical Skills","Paper 4: A Level Structured Questions","Paper 5: Planning, Analysis and Evaluation"],AS_PRACT)
alevel("9701","Chemistry","2025, 2026 and 2027",split(["Atomic structure","Atoms, molecules and stoichiometry","Chemical bonding","States of matter","Chemical energetics","Electrochemistry","Equilibria","Reaction kinetics","The Periodic Table: chemical periodicity","Group 2","Group 17","Nitrogen and sulfur","An introduction to AS Level organic chemistry","Hydrocarbons","Halogen compounds","Hydroxy compounds","Carbonyl compounds","Carboxylic acids and derivatives","Nitrogen compounds","Polymerisation","Organic synthesis","Analytical techniques","Chemical energetics","Electrochemistry","Equilibria","Reaction kinetics","Group 2","Chemistry of transition elements","An introduction to A Level organic chemistry","Hydrocarbons","Halogen compounds","Hydroxy compounds","Carboxylic acids and derivatives","Nitrogen compounds","Polymerisation","Organic synthesis","Analytical techniques"],22),["Paper 1: Multiple Choice","Paper 2: AS Level Structured Questions","Paper 3: Advanced Practical Skills","Paper 4: A Level Structured Questions","Paper 5: Planning, Analysis and Evaluation"],AS_PRACT)
alevel("9709","Mathematics","2026 and 2027",[dict(name="Pure Mathematics 1 (Paper 1)",level="AS"),dict(name="Pure Mathematics 2 (Paper 2)",level="AS"),dict(name="Pure Mathematics 3 (Paper 3)",level="A2"),dict(name="Mechanics (Paper 4)",level="AS"),dict(name="Probability & Statistics 1 (Paper 5)",level="AS"),dict(name="Probability & Statistics 2 (Paper 6)",level="A2")],["Paper 1: Pure Mathematics 1","Paper 2: Pure Mathematics 2","Paper 3: Pure Mathematics 3","Paper 4: Mechanics","Paper 5: Probability & Statistics 1","Paper 6: Probability & Statistics 2"])
econ=["Basic economic ideas and resource allocation","The price system and the microeconomy","Government microeconomic intervention","The macroeconomy","Government macroeconomic intervention","International economic issues"]
alevel("9708","Economics","2026, 2027 and 2028",[dict(name=n,level="AS") for n in econ]+[dict(name=n,level="A2") for n in econ[1:]],["Paper 1: AS Level Multiple Choice","Paper 2: AS Level Data Response and Essays","Paper 3: A Level Multiple Choice","Paper 4: A Level Data Response and Essays"])
bus=["Business and its environment","Human resource management","Marketing","Operations management","Finance and accounting"]
alevel("9609","Business","2026, 2027 and 2028",[dict(name=n,level="AS") for n in bus]+[dict(name=n,level="A2") for n in bus],["Paper 1: Business Concepts 1","Paper 2: Business Concepts 2","Paper 3: Business Decision-Making","Paper 4: Business Strategy"])
alevel("9618","Computer Science","2027, 2028 and 2029",split(["Information representation","Communication","Hardware","Processor Fundamentals","System Software","Security, privacy and data integrity","Ethics and Ownership","Databases","Algorithm Design and Problem-solving","Data Types and Structures","Programming","Software Development","Data Representation","Communication and internet technologies","Hardware and Virtual Machines","System Software","Security","Artificial Intelligence (AI)","Computational thinking and Problem-solving","Further Programming"],12),["Paper 1: Theory Fundamentals","Paper 2: Fundamental Problem-solving and Programming Skills","Paper 3: Advanced Theory","Paper 4: Practical"])

# Attach sub-topics from the documents.
for code,s in S.items():
    if code=="0500": 
        for i,t in enumerate(s["topics"]): s["topics"][i]=dict(n=str(i+1),name=t,subtopics=[])
        continue
    sub=subs(code)
    tops=[]
    for i,t in enumerate(s["topics"]):
        n=i+1; t=t if isinstance(t,dict) else dict(name=t)
        if code=="0580":
            core={k[1:]:v for k,v in sub.items() if k.startswith(f"C{n}.")}
            ext={k[1:]:v for k,v in sub.items() if k.startswith(f"E{n}.")}
            keys=sorted(set(core)|set(ext),key=lambda k:int(k.split('.')[1]))
            t["subtopics"]=[dict(n=k,title=ext.get(k) or core.get(k),core=k in core,extended=k in ext) for k in keys]
        else:
            t["subtopics"]=[dict(n=k,title=v) for k,v in sorted(sub.items(),key=lambda kv:int(kv[0].split('.')[1])) if k.split('.')[0]==str(n)]
        if code=="0606": t["subtopics"]=[]  # 0606 content is listed as statements, not sub-topics
        t["n"]=str(n); tops.append(t)
    s["topics"]=tops

# Command words, per syllabus, from its own table.
def command_words(code):
    lines=open(f"{code}.txt",encoding="utf-8",errors="ignore").read().split("\n")
    idx=[i for i,l in enumerate(lines) if re.match(r'^\s*Command word\s{2,}What it means',l)]
    if not idx: return []
    out=[]; i=idx[-1]+1
    while i<len(lines):
        l=lines[i]
        if re.match(r'^\s*\d\s+[A-Z]',l) or 'What else you need' in l or 'Practical assessment' in l: break
        m=re.match(r'^(\s+)([A-Z][a-z]+(?: \(that\))?)\s{2,}(\S.*)$',l)
        if m: out.append(dict(word=m.group(2),meaning=m.group(3).strip()))
        elif out and l.strip() and not re.search(r'www\.|Back to|syllabus for',l): out[-1]['meaning']+=' '+l.strip()
        i+=1
    return out
for code,s_ in S.items(): s_["commandWords"]=command_words(code)

# Lower Secondary Stage 9 (ages 13–14): curriculum framework strands.
def ls(code,name,strands):
    S[code]=dict(code=code,name=name,stage="lower",qualification="Cambridge Lower Secondary (Stage 9)",years=None,tiered=False,papers=["Cambridge Lower Secondary Checkpoint (end of Stage 9)"],practical=None,topics=[dict(n=str(i+1),name=s,subtopics=[]) for i,s in enumerate(strands)])
ls("0862","Mathematics",["Number","Algebra","Geometry and Measure","Statistics and Probability"])
ls("0893","Science",["Biology","Chemistry","Physics","Earth and Space","Thinking and Working Scientifically","Science in Context"])
ls("0861","English",["Reading","Writing","Speaking and Listening"])
ls("0876","English as a Second Language",["Reading","Writing","Listening","Speaking","Use of English"])
ls("0860","Computing",["Computational Thinking","Programming","Managing Data","Networks and Digital Communication","Computer Systems"])
ls("1129","Global Perspectives",["Research","Analysis","Evaluation","Reflection","Collaboration","Communication"])

# Lower Secondary has no exam command-word table: use the common Cambridge words,
# with the meanings published in the IGCSE syllabi.
pool={}
for c in ('0625','0610','0455','0478','0620'):
    for w in S[c]['commandWords']: pool.setdefault(w['word'],w['meaning'])
for c in ('0862','0893','0861','0876','0860','1129'):
    S[c]['commandWords']=[dict(word=w,meaning=pool[w]) for w in ['Calculate','Compare','Define','Describe','Explain','Give','Identify','Outline','Predict','State','Suggest']]
# Headings that wrap in the PDF where the next line isn't caught automatically.
for s_ in S.values():
    for t in s_['topics']:
        for u in t['subtopics']:
            if u['title'].endswith('of the balance of') or u['title'].endswith('of the balance'):
                u['title']=re.sub(r'(of the balance)( of)?$', r'\1 of payments', u['title'])
json.dump(S,open("cambridge-syllabi.json","w"),indent=1,ensure_ascii=False)
for c,s in S.items():
    n=sum(len(t["subtopics"]) for t in s["topics"]); empty=[t["n"] for t in s["topics"] if not t["subtopics"]]
    print(c,s["name"],len(s["topics"]),"topics",n,"subtopics","no-subs:",",".join(empty) if len(empty)<12 else "all")
