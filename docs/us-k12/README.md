# US K–12 Tutor

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

- Children under 13 will use this, so COPPA applies. Get legal advice on parental consent, and update the privacy policy and Terms to cover learner profiles and children's AI tutoring.
- The App Store age rating is 13+; check how the US K–12 audience fits Apple's rules if it's marketed to children.
- Have a US curriculum specialist review the state table.
