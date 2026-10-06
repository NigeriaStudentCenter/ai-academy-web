# Curriculum Tutor (US and Cambridge International, 13+)

**Everything in AI Academy is for learners aged 13 and over.** The US tutor offers grades 8–12 only, and Cambridge offers Lower Secondary Stage 9, IGCSE and AS & A Level. New learner profiles must be confirmed as 13+, and the Command Center offers only JSS 3–SSS 3 and Years 9–11. The K–7 standards data is kept but never shown.

## US

A US curriculum tutor built on the national benchmark frameworks most states use, with a state overlay. There is no "US national curriculum" in it.

| Subject | Benchmark | Tree |
|---|---|---|
| Math | Common Core (CCSS) | K–8: grade → domain → cluster, every standard code. High school: Algebra I / Geometry / Algebra II → domain (typical traditional pathway) |
| English Language Arts | Common Core (CCSS) | K–12: strand (RL, RI, RF, W, SL, L) → standard, with the real grade code; 9-10 / 11-12 bands |
| Science | NGSS | K–5: NGSS topics by grade. 6–8 and 9–12: by disciplinary core idea (grade bands) |
| Social Studies | C3 Framework | Grade bands: Civics, Economics, Geography, History categories, inquiry skills (D1, D3, D4), plus "this year's content" |

That is 1,072 skills per state across K–12.

## State overlay (`src/lib/k12/states.js`)

- Every state is classified per subject. For math and ELA it's either the Common Core (as adopted or revised by the state) or the state's own framework: Texas TEKS, Virginia SOL, Florida B.E.S.T., Alaska, Nebraska, Indiana, Oklahoma, South Carolina, and Minnesota math. For science it's adopted NGSS (20 states + DC), the state's own standards (TX, FL, VA), or "state science standards". Social studies always uses the state's own standards.
- For states with their own framework, the tutor teaches to that framework's grade-level expectations. The national codes appear only as an alignment reference, and the tutor is told never to invent state codes.
- Curated changes:
  - Texas math K–8 gets a Personal Financial Literacy strand.
  - The social studies content focus is set for TX (grades 4 and 7), VA (grade 4), CA (grade 4), FL (grade 4) and NY (grades 4, 7 and 8).
- **Before marketing state alignment**, have a US curriculum specialist review this table. For real state codes (TEKS numbers and so on), use a licensed or maintained standards dataset (e.g. the Common Standards Project) rather than adding codes by hand.

## Features

- **Grade-level learner profiles under the parent's account.** A profile holds only a nickname, a grade and a state; children don't get their own accounts. Profiles are deleted along with the account.
- **Skill trees.** Subject → domain → skill → AI-generated micro-skills. Micro-skills are cached and each is tagged with a code from the skill's own list.
- **Tutor.**
  - Explanation styles: Explain like I'm 8, Story, Step-by-step visual, Real-world, Ask me questions.
  - Levels: Catch-up, On grade level, Advanced/honors, each mapped to Webb's Depth of Knowledge levels.
  - "I'm stuck" gives a hint and flags the skill for the parent.
- **5-minute quiz and printable worksheet** (with an answer key on its own page).
- **Parent view.** This week's lessons, quizzes and average; progress by subject; skills to review and mastered skills; next recommended skills; an AI weekly note with one at-home activity.

## Accuracy safeguards

- **Codes:** standard codes always come from the tree. AI output is filtered to the skill's allowed codes.
- **Tutor messages:** open questions only (no answer options); the AI must check every number; story problems must be sound (fractions being added refer to the same whole).
- **Quizzes and worksheets:**
  - The AI writes its working before each answer, and names the correct option by its text.
  - A second, independent pass re-solves every multiple-choice question and judges every short-answer key; only questions both passes agree on are kept.
  - Questions with two options of equal value (1/2 and 3/6, 17/12 and 1 5/12) are rejected.
  - Near-repeat questions are dropped.
- **Spot check (2026-10-06):** 70 live questions across 8 skills were hand-checked; every kept answer key was correct.

## Open before a US launch

- Learners are 13+ (decided 2026-10-06), so COPPA's under-13 rules don't apply. Still state the 13+ rule in the Terms and privacy policy, and keep the App Store age rating at 13+.
- Have a US curriculum specialist review the state table.

## Cambridge International

The structure follows Cambridge's own hierarchy: **stage → syllabus code → topic / sub-topic → assessment tier**.

| Stage | Ages | Syllabi |
|---|---|---|
| Lower Secondary (Stage 9) | 13–14 | Mathematics 0862, Science 0893, English 0861, English as a Second Language 0876, Computing 0860, Global Perspectives 1129 |
| Upper Secondary (IGCSE) | 14–16 | Mathematics 0580, Additional Mathematics 0606, Physics 0625, Chemistry 0620, Biology 0610, Economics 0455, Business Studies 0450, Geography 0460, Computer Science 0478, First Language English 0500 |
| Advanced (AS & A Level) | 16–19 | Mathematics 9709, Physics 9702, Chemistry 9701, Biology 9700, Economics 9708, Business 9609, Computer Science 9618 |

- **Source:** each syllabus's published PDF on cambridgeinternational.org (the version valid for the 2027 exams). `tools/cambridge/build.py` produces `src/lib/k12/cambridge-syllabi.json`, containing:
  - topics and sub-topics with Cambridge's own numbering;
  - the AS / A Level split;
  - Core / Extended per sub-topic for 0580;
  - the papers;
  - each syllabus's command-word table, with Cambridge's meanings.
- **Learning statements:** `tools/cambridge/statements.py` extracts the statements under each sub-topic (Core and Supplement), totalling 0.5 MB. They're kept **out of the public repo**, in blob storage at `course-catalog/k12/cambridge-content.json`, because the repo is public and the text is Cambridge's copyright. Every prompt is grounded in them: Core learners get Core statements only, Extended learners get Core plus Supplement.
- **Tiers:** Core/Extended for 0625, 0620, 0610 and 0580 (Extended-only content can't be studied at Core). Single tier for the other IGCSEs; AS or A Level per topic at A Level.
- **Teaching styles:**
  - Explanation + exam-style question;
  - Command word decoder;
  - Mark-scheme answers (keywords in bold);
  - Virtual lab (Alternative to Practical, sciences only);
  - Ask me questions.
- **Exam-style questions:**
  - Written fresh (never presented as real past papers), with a command word from the syllabus list, a mark scheme of one point per mark with keywords, a model answer and an examiner tip.
  - Checked before the learner sees them: numeric answers by a blind re-solve that must match, everything else by an independent examiner check.
  - Answers are marked point by point against the mark scheme. The score is counted by the server from the points awarded (never the AI's own total), and the result shows the missing keywords and a full-mark answer.
- **Command word decoder:** the app shows each syllabus's own command-word list.

**Open for Cambridge:**
- Licensing: decided by the owner (2026-10-06) that no permission from Cambridge is needed for the paid app. Syllabus statements stay out of the public repo and are not shown verbatim.
- Add more syllabi as needed (Cambridge offers 70+ IGCSEs). Download the PDF, add its topic list in `build.py`, and re-run.
- Refresh the data when syllabus versions change, e.g. 0580/0606 for 2028–2030 and the 2029 science syllabi.
