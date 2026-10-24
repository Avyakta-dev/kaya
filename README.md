# Kaya

A women's health companion that helps women **track their cycle and symptoms (by tap or by voice in their own language)** and walk into a doctor's office with a **one-page, doctor-ready report**.

> Hackathon track: PS1, Women's Healthcare.
> Kaya does **not** diagnose. It flags patterns that are "worth discussing with a doctor".

---

## The idea in 30 seconds

1. **Log** symptoms and periods by tapping icons or speaking in Kannada, Hindi or English.
2. **Track** the cycle with a predicted next period and phase-based tips (eat, move, avoid).
3. **Spot patterns** with simple rules (irregular cycles, recurring pain, heavy flow with fatigue), explained in friendly, age-adapted language.
4. **Generate a doctor-ready PDF**: timeline, flagged patterns, and questions to ask.

Full idea document: see the shared project doc (link in the team chat).

---

## Tech stack

| Layer | Tool |
|---|---|
| Frontend | React + Vite + Tailwind CSS (converted from a Google Stitch design) |
| Routing | React Router |
| Backend | Vercel serverless functions in `/api` |
| Database + auth | Supabase (Postgres) |
| Voice (speech-to-text) | Sarvam AI |
| LLM (extract + insights) | Gemini / Groq free tier (or Sarvam) |
| PDF report | jsPDF |
| Charts | Recharts or Chart.js |
| Hosting | Vercel |

---

## Getting started

```bash
git clone https://github.com/<your-username>/kaya.git
cd kaya
git checkout dev
npm install
cp .env.example .env     # then fill in your own keys
npm run dev              # frontend only, at http://localhost:5173
```

To run the frontend **and** the `/api` functions together:

```bash
npm i -g vercel
vercel login
vercel link
vercel dev
```

> `npm run dev` does not serve `/api`. Use `vercel dev` when testing backend functions locally.

### Environment variables

Copy `.env.example` to `.env` and fill in:

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
SARVAM_API_KEY=
LLM_API_KEY=
```

- **Never commit `.env`.** It is in `.gitignore`.
- Only variables starting with `VITE_` reach the browser. Keep `SARVAM_API_KEY` and `LLM_API_KEY` **server-side only** (inside `/api`).
- The same variables must be added in the Vercel dashboard (Project Settings, Environment Variables), then redeploy.

---

## Folder structure

Items marked **(new)** are backend/support folders added on top of the Vite frontend.

```
kaya/
├── api/                          # (new) serverless functions (backend)
│   ├── transcribe.js             # P2: Sarvam speech-to-text
│   ├── extract.js                # P2: transcript -> structured symptom JSON
│   ├── insights.js               # P2: flags -> friendly, age-adapted text
│   ├── translate.js              # P2: Sarvam translate (optional)
│   ├── report.js                 # P1: collects data for the doctor report
│   ├── logs.js                   # P1: save / read / edit / delete logs
│   └── _lib/                     # shared helpers (underscore = not a route)
│       ├── supabase.js           # P1: Supabase client
│       ├── rules.js              # P1: rules engine
│       ├── llm.js                # P2: LLM call wrapper
│       ├── sarvam.js             # P2: Sarvam call wrapper
│       └── fallbacks.js          # P2: cached demo responses
│
├── content/                      # (new) static content (P2)
│   ├── phase-tips.json           # eat / move / avoid per cycle phase
│   ├── doctor-questions.json     # questions to ask, per age group
│   └── demo-cache.json           # cached transcript + insight for the demo
│
├── db/                           # (new) P1
│   ├── schema.sql                # tables + row-level security
│   └── seed.js                   # 3 months of demo patient data
│
├── docs/                         # (new)
│   └── api-contract.md           # agreed JSON formats (read this first)
│
├── public/                       # static assets
│
├── src/                          # frontend (React + Vite)
│   ├── assets/                   # images, icons
│   ├── components/               # BottomNav, CycleRing, QuickLogRow, TipsCard, ...
│   ├── i18n/                     # translations
│   │   ├── en.json               # P2
│   │   ├── kn.json               # P2
│   │   └── hi.json               # P2
│   ├── lib/
│   │   ├── api.js                # frontend calls to /api (shared, edit carefully)
│   │   ├── pdf.js                # P1: jsPDF report layout
│   │   └── mock/                 # mock JSON so the UI works without the backend
│   ├── pages/                    # Onboarding, Home, Log, Insights, Report
│   ├── App.jsx                   # routes
│   ├── App.css
│   ├── index.css                 # Tailwind + global styles
│   └── main.jsx                  # entry point
│
├── DESIGN.md                     # design tokens exported from Stitch
├── eslint.config.js
├── index.html
├── tailwind.config.js            # theme colors, fonts, radius
├── vite.config.js
├── vercel.json                   # (new) SPA rewrite so page refresh doesn't 404
├── .env.example                  # (new) variable names only, no real keys
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

Not committed (listed in `.gitignore`): `node_modules/`, `dist/`, `.env`.

---

## Who owns what

Each person edits only their own files, so merge conflicts stay rare.

| Person 1 (Data) | Person 2 (AI / Voice) |
|---|---|
| `api/logs.js`, `api/report.js` | `api/transcribe.js`, `extract.js`, `insights.js`, `translate.js` |
| `api/_lib/supabase.js`, `rules.js` | `api/_lib/llm.js`, `sarvam.js`, `fallbacks.js` |
| `db/` | `content/` |
| `src/lib/pdf.js` | `src/i18n/` |

**Shared files** (`src/lib/api.js`, `package.json`, `docs/api-contract.md`): tell each other before editing and keep changes small.

### Person 1 tasks (Data)
- Supabase project, tables (`users`, `cycle_logs`, `symptom_logs`), auth, row-level security
- Log APIs connected to the frontend
- Rules engine: next period prediction, cycle phase, irregular cycle, recurring pain, heavy flow + fatigue
- `/report` data and PDF export
- Seed script for the demo patient

### Person 2 tasks (AI / Voice)
- Sarvam account, `/transcribe` for Kannada, Hindi and English
- `/extract`: transcript to `{symptom, severity, area, date}`
- `/insights`: rule flags to friendly, age-adapted wording
- Kannada and Hindi translations, `en.json` / `kn.json` / `hi.json`
- Phase tips and doctor questions JSON
- Cached demo responses and fallbacks if an API fails

---

## API contract (agreed formats)

Full details live in `docs/api-contract.md`. Short version:

**Symptom log** (produced by `/extract`, saved by `/logs`)
```json
{ "date": "2026-10-24", "type": "pain", "severity": 4, "area": "abdomen", "source": "voice", "note": "since morning" }
```

**Rules engine output** (produced by `rules.js`, read by `/insights`)
```json
{
  "next_period": "2026-10-30",
  "phase": "luteal",
  "flags": [
    { "code": "IRREGULAR_CYCLE", "detail": "Cycle length varied by 9 days over 3 cycles" },
    { "code": "RECURRING_PAIN", "detail": "Pain 4+ in the last 3 cycles" }
  ]
}
```

**Insight response** (produced by `/insights`, shown in the UI and the report)
```json
{ "text": "Your cycles varied by 9 days. Worth discussing with a doctor.", "lang": "en" }
```

> Build against these formats using mock data first, so neither of us waits for the other.

---

## Git workflow

```
main        <- always working and demo-ready (auto-deploys to Vercel)
 └── dev    <- integration branch where features meet
      ├── feat/data-...   (Person 1)
      └── feat/ai-...     (Person 2)
```

**Rules**
1. Nobody commits directly to `main` or `dev`.
2. One feature = one branch, created from `dev`, merged back through a Pull Request.
3. Review each other's PR (a quick skim is enough).
4. Small, frequent commits: `feat: add rules engine`, `fix: kannada font`.
5. Sync with `dev` often.
6. `dev` is merged into `main` only at checkpoints (hours 6, 12, 17, 22), after testing.

**Starting a feature**
```bash
git checkout dev
git pull origin dev
git checkout -b feat/ai-transcribe

# work, then:
git add .
git commit -m "feat: sarvam transcribe endpoint"
git push -u origin feat/ai-transcribe
# open a Pull Request into dev on GitHub
```

**Staying in sync while you work**
```bash
git fetch origin
git merge origin/dev
```

---

## Rules for the team

- **No API keys in the repo.** If one leaks, rotate it immediately.
- **Don't auto-format files you don't own.** It creates huge conflicts.
- **Run `npm run build` before merging** into `dev` or `main`.
- **Match file name capitalization exactly** in imports. Vercel is case-sensitive.
- **Cache demo responses.** The demo must work even if an API or the Wi-Fi fails.
- **One polished flow beats five half-working ones.** Must-haves: voice log, saved data, doctor PDF.
- **Last 3 hours:** no new features, only fixes and rehearsal.

## Deployment notes

- The mic needs HTTPS. Test voice on the deployed Vercel URL, not on a local IP.
- Keep voice clips under about 30 seconds (serverless time and size limits).
- After adding or changing env variables in Vercel, redeploy.

---

## Design

- Style: soft neubrutalism. Thick black outlines, hard offset shadows, rounded corners.
- Palette: `#FFFFFF` white, `#F6D1C5` light peach, `#F4A990` peach, `#EE8070` coral, `#000000` black.
- Fonts: Poppins or Nunito, plus Noto Sans Kannada and Noto Sans Devanagari for local languages.
- Coral is for actions (buttons, mic, ring). Insights use light peach so nothing feels alarming.
- tokens are in `DESIGN.md`.

---

## Disclaimer

Kaya is a tracking and communication aid, not a medical device. It does not diagnose conditions. Wellness tips are general, and users should talk to a doctor about any concerns.