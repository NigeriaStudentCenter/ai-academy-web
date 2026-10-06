# Cambridge syllabus data

`src/lib/k12/cambridge-syllabi.json` is generated from Cambridge International's published syllabus PDFs:
topic and sub-topic headings, the AS/A Level split, papers, and each syllabus's command-word table.

To rebuild (for example, when a new syllabus version is published):

1. Download each syllabus PDF from its page on cambridgeinternational.org (the URLs used are listed below), then run `pdftotext -layout <code>.pdf <code>.txt` in this folder.
2. Update the code → syllabus years and topic lists in `build.py` if the content overview changed.
3. Run `python3 build.py` and copy `cambridge-syllabi.json` to `src/lib/k12/`. Then add the Lower Secondary common command words as the last step of `build.py`'s output (see the git history).

Syllabi used (valid for the June 2027 exams):
0625 697209-2026-2028 · 0620 697205-2026-2028 · 0610 697203-2026-2028 · 0580 662466-2025-2027 · 0606 662470-2025-2027 ·
0455 718148-2027-2029 · 0450 697146-2026 · 0460 718150-2027-2029 · 0478 697167-2026-2028 · 0500 718783-2027-2029 ·
9709 697427-2026-2027 · 9702 664565-2025-2027 · 9701 664563-2025-2027 · 9700 664560-2025-2027 · 9708 697423-2026-2028 ·
9609 697371-2026-2028 · 9618 721397-2027-2029 (all under https://www.cambridgeinternational.org/Images/<id>-syllabus.pdf)
Lower Secondary framework codes and strands are from the subject pages under /programmes-and-qualifications/cambridge-lower-secondary/curriculum/.
