# AI Academy — App Store submission pack (iOS v1.0)

Everything to paste into App Store Connect, plus the answers to Apple's
questionnaires. Keep this in step with the app: if a feature or data flow
changes, update the privacy answers here and on /privacy.html.

## 1. App identity

| Field | Value |
|---|---|
| App name | AI Academy |
| Bundle ID | `org.bsoedu.aiacademy` |
| SKU | `aiacademy-ios-001` |
| Primary category | Education |
| Secondary category | Productivity (optional) |
| Version / build | 1.0.0 (1) — from `pubspec.yaml` `version: 1.0.0+1` |
| Devices | iPhone only (runs in iPhone mode on iPad) |
| Price | Free, no in-app purchases |
| Minimum iOS | 13.0 |

## 2. Store listing text

**Subtitle** (≤30 chars)

> Learn AI with your own tutor

**Promotional text** (≤170 chars, editable without review)

> Short, practical AI courses with a personal AI Tutor. Track your progress on phone and web, and earn a verifiable certificate when you finish.

**Description**

> AI Academy helps learners build real, practical skills with artificial intelligence — at their own pace, on their phone or the web.
>
> SHORT, PRACTICAL COURSES
> Bite-sized lessons explain what AI is, where you meet it every day, how to use it responsibly, and how to ask AI better questions. Each lesson ends with a reflection question to help ideas stick.
>
> YOUR OWN AI TUTOR
> Stuck on an idea? Ask the AI Tutor — by typing or by voice. It explains things in simple language, gives examples and checks your understanding.
>
> AI STUDY NOTES
> Turn any topic into clear, structured study notes with key points and exam tips.
>
> PROGRESS THAT FOLLOWS YOU
> Sign in with your organisation's Microsoft account and your progress syncs between your phone and the web.
>
> VERIFIABLE CERTIFICATES
> Complete a course to earn a certificate with a unique ID that employers and schools can verify online.
>
> AI Academy is provided by the British School of Outdoor Education for learners with an account from a participating programme, including the AI Academy for Teens and our professional AI courses.

**Keywords** (≤100 chars, comma-separated, no spaces needed)

> AI,artificial intelligence,course,tutor,learning,education,prompt,ChatGPT,skills,teens,certificate

(If Apple rejects third-party trademarks, drop "ChatGPT".)

**URLs**

| Field | URL |
|---|---|
| Support URL | https://black-sky-0782ebe03.7.azurestaticapps.net/support.html |
| Marketing URL (optional) | — |
| Privacy Policy URL | https://black-sky-0782ebe03.7.azurestaticapps.net/privacy.html |

Replace the `azurestaticapps.net` host with a custom domain (e.g.
`academy.bsoedu.org`) before launch if one is set up — the URLs can be
changed later without a new build.

## 3. Screenshots

Required: **6.9" iPhone** (1320 × 2868 portrait) — 3 to 10 images.
Capture on the *iPhone 17 Pro Max* simulator (`xcrun simctl io booted
screenshot`). Suggested set, in order:

1. Dashboard — name, progress, My Courses
2. My Courses list
3. Course page with lesson ticks and "Resume learning"
4. A lesson (What is AI?)
5. AI Tutor answering a question
6. Certificate / verification

Use a demo learner account (not a real person's) so no personal data
appears in public screenshots.

## 4. App Review information

**Sign-in required** — provide a demo account:

| Field | Value |
|---|---|
| Username | *demo account UPN (see §7)* |
| Password | *set in App Store Connect only — never commit it* |

**Notes for the reviewer** (paste as-is, filling in the account):

> AI Academy is an education app for learners enrolled through the British School of Outdoor Education's programmes. Learners sign in with the Microsoft work/school account their organisation issues them; there is no public sign-up and no account is created inside the app.
>
> To review: tap Sign in → Sign in with Microsoft, and use the demo account provided. Microsoft may show "Are you trying to sign in to AI Academy?" — tap Continue (this is Microsoft's standard confirmation for native apps).
>
> Sign in with Apple is not offered because the app exclusively uses the organisation's own account system (Guideline 4.8 exception). Accounts are created and deleted by the organisation's administrator; learners can request deletion of their data via the support page.
>
> The AI Tutor sends the learner's typed or spoken question to our backend, which calls a Microsoft Azure AI model to generate the answer. Voice input uses Apple's speech recognition to turn speech into text.

## 5. Age rating (Apple questionnaire)

Target audience is 13+ (teens programme is 13–18). Suggested answers:

- Violence, sexual content, profanity, horror, gambling, drugs, alcohol: **None**
- Medical/treatment information: **None**
- Unrestricted web access: **No**
- User-generated content shared with other users: **No** (no chat between learners)
- Messaging / chat with other people: **No**
- AI-generated content / chatbot: **Yes** — the AI Tutor generates text answers
- Advertising: **No**
- Contests / gambling: **No**

Expected result: **13+**. Do not select Kids category (under-13).

## 6. App Privacy ("nutrition label")

Tracking: **No** — no advertising, no data brokers, no cross-app tracking,
no third-party analytics SDKs.

Data collected (all **linked to the user**, purpose **App Functionality**
only; none used for tracking):

| Apple category | Data type | What it is |
|---|---|---|
| Contact Info | Name | From the learner's Microsoft account (shown in app, printed on certificates) |
| Contact Info | Email Address | Microsoft sign-in username (decides Teens vs Professional courses) |
| Identifiers | User ID | Microsoft account object ID (keys progress and certificates) |
| User Content | Other User Content | Questions typed or spoken to the AI Tutor / AI Notes |
| Usage Data | Product Interaction | Lessons completed and course progress |

Not collected: location, contacts, photos, health, financial info, browsing
history, device identifiers for tracking, crash data (no crash SDK yet).

Audio: speech is converted to text by Apple's speech recognition; the app
does not upload or store audio.

## 7. Before you submit — checklist

Done in code (✅) and left for you (☐):

- ✅ Bundle ID `org.bsoedu.aiacademy`, display name "AI Academy"
- ✅ App icon (all sizes) and launch screen
- ✅ Microsoft Entra sign-in (system browser, PKCE), tokens in Keychain
- ✅ Microphone / speech purpose strings; encryption declaration
- ✅ iPhone-only; release build compiles
- ✅ Debug tools excluded from release builds
- ✅ Privacy policy and support pages (see /privacy.html, /support.html)
- ☐ **Register the bundle ID** in the Apple Developer portal
  (Identifiers → App IDs → `org.bsoedu.aiacademy`)
- ☐ **Create the app** in App Store Connect (My Apps → + → New App) with the
  values in §1
- ☐ **Set your Team** in Xcode (Runner target → Signing & Capabilities →
  Team, "Automatically manage signing")
- ☐ **Create two demo learner accounts** in Entra ID for Apple's reviewers —
  one `@teenskills.co.uk`, one `@bsoedu.org` — with no MFA prompt, and a
  password you only enter in App Store Connect
- ☐ Fill in §2–§6 in App Store Connect; upload screenshots (§3)
- ☐ Build & upload: `flutter build ipa` then open
  `build/ios/archive/Runner.xcarchive` in Xcode → Distribute App, or use
  the Transporter app with `build/ios/ipa/*.ipa`
- ☐ TestFlight: install on a real iPhone and sign in once before submitting
