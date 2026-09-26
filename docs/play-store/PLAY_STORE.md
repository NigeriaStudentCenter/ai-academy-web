# AI Academy — Google Play submission pack (Android v1.0)

Everything to paste into Play Console, plus the answers to Google's
questionnaires. Keep it in step with the app and with /privacy.html.

## 1. App identity

| Field | Value |
|---|---|
| App name | AI Academy |
| Package name | `org.bsoedu.aiacademy` |
| Developer account | Organisation — B.S.O.E LTD (Companies House 08938266), D-U-N-S 219956952 |
| Default language | English (United Kingdom) – en-GB |
| App or game | App |
| Free or paid | Free (subscriptions to be added later via Play Billing) |
| Category | Education |
| Contact email | john@bsoedu.org |
| Website | https://black-sky-0782ebe03.7.azurestaticapps.net |
| Privacy policy | https://black-sky-0782ebe03.7.azurestaticapps.net/privacy.html |
| Release file | `build/app/outputs/bundle/release/app-release.aab` (versionCode from `pubspec.yaml`) |
| Upload key | `~/.android-keys/ai-academy-upload.jks`, alias `upload`; passwords only in `android/key.properties` (git-ignored). Back both up to a password manager. Use Play App Signing. |

## 2. Store listing

**Short description** (≤80 chars)

> Practical AI courses, an AI Tutor and AI tools for study and business.

**Full description** (≤4000 chars)

> AI Academy helps learners build real, practical skills with artificial intelligence — at their own pace, on their phone or the web.
>
> PRACTICAL AI COURSES
> More than 180 courses, organised into clear categories — from AI foundations to ChatGPT, Claude, Copilot, Gemini and NotebookLM masterclasses, AI for administrators, healthcare, legal, data and business roles, AI engineering, finance, HR, workplace and career skills, and the 200 AI Business Ideas programme. Lessons include videos, copy-ready prompts and hands-on exercises.
>
> PERSONAL DEVELOPMENT AND PROFESSIONAL SKILLS
> Become Extra Ordinary, a 30-day programme with AI reflection partners; Delete Limiting Beliefs, a 12-week programme with an AI Delete Script Studio; and practical Customer Service, Marketing and Event Management courses with AI role-plays — interview a customer persona, calm a difficult customer, pitch a sponsor or handle an event-day crisis.
>
> YOUR OWN AI TUTOR
> Stuck on an idea? Ask the AI Tutor — by typing or by voice. It explains things simply, gives examples and checks your understanding.
>
> STUDENT SUCCESS HUB
> Five tools that search the live web for you: an Academic Study Companion (plan, research, explain, and feedback on your own draft — never ghost-writing), plus Scholarship, Student Jobs, Social & Gigs and Accommodation finders with real links.
>
> BUSINESS MARKETING HUB
> Create landing-page copy, email campaigns, a month of social posts, a website chatbot and follow-up messages for your business, and find real prospective customers near you.
>
> AI ACADEMY FOR TEENS
> Teens learn safe, honest AI use through four tracks and a wellbeing course, and study with the Command Center — a Socratic tutor for the Nigerian (NERDC) and British curricula that guides with questions instead of handing over answers.
>
> PROGRESS AND CERTIFICATES
> Sign in with your organisation's Microsoft account; your progress syncs between phone and web, and every completed course earns a certificate with an ID anyone can verify.
>
> AI Academy is provided by the British School of Outdoor Education for learners with an account from a participating programme.

**Graphics** (in this folder)

| Asset | File |
|---|---|
| App icon 512×512 | `icon_512.png` |
| Feature graphic 1024×500 | `feature_graphic_1024x500.png` |
| Phone screenshots (1080×2400) | `screenshots/01_my_courses.png` … `05_business_hub.png` |

## 3. App content (Policy → App content)

| Declaration | Answer |
|---|---|
| Privacy policy | URL above |
| Ads | No, the app contains no ads |
| App access | All functionality needs sign-in → provide demo account `appreview@bsoedu.org` (password entered by the account owner only) with instructions: "Tap Sign in → Sign in with Microsoft, enter the account, tap Continue if Microsoft asks to confirm." |
| Content rating | IARC questionnaire, category **Reference, News, or Educational**: no violence, sexual content, profanity, drugs, gambling; **users can interact / exchange content: No** (no user-to-user chat in the app); **shares user location: No**; **AI-generated content: Yes — educational text answers**. Expected rating: Everyone / PEGI 3. |
| Target audience | 13–15, 16–17, 18+ (teens programme is 13–18). Not designed for children under 13; not in the Families programme. Appeal to children: No. |
| News app | No |
| COVID-19 contact tracing | No |
| Data safety | See §4 |
| Government app | No |
| Financial features | None |
| Health | None |

## 4. Data safety

Data is **encrypted in transit** (HTTPS only). Users can **request deletion** (email john@bsoedu.org; accounts are issued and removed by the programme). No data is **shared** with third parties — Microsoft Azure and Anthropic process it only as service providers on our behalf, which Google does not count as sharing. Nothing is used for ads or sold.

| Data type | Collected | Why | Optional? |
|---|---|---|---|
| Personal info → Name | Yes | App functionality, account management | Required (from sign-in) |
| Personal info → Email address | Yes | App functionality, account management | Required |
| Personal info → User IDs | Yes | App functionality (progress, certificates) | Required |
| App activity → Other user-generated content (questions to the AI tools, form answers) | Yes, processed ephemerally | App functionality | Optional (only when a tool is used) |
| Files and docs (an assignment brief the user uploads) | Yes, processed ephemerally | App functionality | Optional |
| App activity → App interactions (lessons completed) | Yes | App functionality | Required |
| Audio | No — speech is turned into text on the device; only text is sent | — | — |
| Location, contacts, photos, financial, health, messages, device IDs | No | — | — |

## 5. Release plan

1. **Internal testing** — upload the AAB, add testers by email (up to 100), no review.
2. **Closed testing** — required before production for *personal* developer accounts created after Nov 2023: at least 12 testers opted in for 14 continuous days. (Organisation accounts can skip straight to production.)
3. **Production** — after the above; review usually takes a few days.
