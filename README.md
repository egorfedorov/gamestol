<div align="center">

# GameStol

### Your digital host for board games

**Play it right — no arguments, no rulebooks, no confusion.**

[Live Demo](https://egorfedorov.github.io/gamestol/) &bull; [Add a Game](#-adding-a-new-game) &bull; [Contributing](#-contributing)

---

</div>

## The Problem

We've all been there:

```
  You:     "Let's play a board game!"
  Friend:  "Sure! ...does anyone know the rules?"
  You:     *opens 20-page rulebook*
  Friend:  "I watched a YouTube video, I think I know—"
  Other:   "No, that's the old version of the rules..."

  ⏰ 40 minutes later, you're still arguing about the rules.
```

Board games are amazing. But the setup kills the vibe.

**GameStol fixes this.** It's a digital game host that:

- Guides every game step by step
- Assigns roles automatically
- Manages timers and scoring
- Shows rules exactly when you need them

Put your phone in the center of the table. Everyone plays together.

## Games

| Game | Type | Players | Host | Description |
|------|------|---------|------|-------------|
| **Mafia** | Deduction | 6-20 | Required | Classic bluffing game. Host assigns roles, manages night/day phases. |
| **Alias** | Words | 4-20 | — | Explain words to your team without using root words. 60s timer. |
| **Charades** | Acting | 3-20 | — | Act out words with gestures only. No speaking! |
| **Codenames** | Strategy | 4-12 | — | 5x5 word grid. Spymaster gives clues, team guesses. |
| **Quiz Battle** | Trivia | 2-8 | Optional | 60 seconds to discuss each question. Captain answers. |
| **Bunker** | Social | 4-16 | — | Apocalypse survival. Reveal traits, argue, vote to eliminate. |
| **Hat Game** | Words | 4-20 | — | Words in a hat. Pairs explain and guess in 30 seconds. |
| **Imaginarium** | Creative | 3-8 | — | Association game. Storyteller gives clues, others guess. |
| **Activity** | Mixed | 4-16 | — | Explain, draw, or mime — mode chosen randomly each turn. |
| **Black Stories** | Mystery | 2-20 | Required | Host reads a riddle. Players ask yes/no questions to solve it. |

## Features

```
 ┌─────────────────────────────────────────────────────┐
 │                     GameStol                        │
 │                                                     │
 │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
 │  │  12      │  │  10      │  │  Mobile   │          │
 │  │Languages │  │  Games   │  │  First    │          │
 │  └──────────┘  └──────────┘  └──────────┘          │
 │                                                     │
 │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
 │  │  Step by │  │  Auto    │  │  Rules +  │          │
 │  │  Step    │  │  Roles   │  │  Mistakes │          │
 │  └──────────┘  └──────────┘  └──────────┘          │
 │                                                     │
 │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
 │  │  Timers  │  │  Score   │  │  GitHub   │          │
 │  │  Built-in│  │  Tracking│  │  Pages    │          │
 │  └──────────┘  └──────────┘  └──────────┘          │
 └─────────────────────────────────────────────────────┘
```

- **12 languages** — EN, RU, ES, DE, FR, PT, ZH, JA, KO, TR, IT, AR
- **Mobile-first** — designed for phones in the center of the table
- **Step-by-step hosting** — every phase has clear instructions
- **Host vs Self-play** — games that need a host say so; others run on autopilot
- **Common mistakes** — each game lists what people usually get wrong
- **No backend** — pure static site, deployable anywhere

## Tech Stack

```
React 18  +  TypeScript  +  Vite  +  Tailwind CSS  +  Framer Motion
```

No database. No auth. No API. Just a static site that runs board games.

## Quick Start

```bash
git clone https://github.com/egorfedorov/gamestol.git
cd gamestol
npm install
npm run dev
```

Open `http://localhost:5173/gamestol/` in your browser.

## Deployment

Automatically deployed to GitHub Pages on every push to `main` via GitHub Actions.

Manual deploy:
```bash
npm run build
npm run deploy
```

## Adding a New Game

Want to add your favorite board game? Here's the architecture:

### Game Structure

```
src/games/
├── registry.tsx          ← Game catalog (add your game here)
├── YourGame.tsx          ← Game component (your game logic)
└── ...

src/data/
├── your-game-data.ts     ← Word lists, questions, etc. (if needed)
└── ...
```

### Step 1: Create the Game Component

Every game follows the same pattern:

```tsx
// src/games/YourGame.tsx

export default function YourGame() {
  const { t, lang } = useI18n()
  const L = (ru: string, en: string) => lang === 'ru' ? ru : en

  const [phase, setPhase] = useState<Phase>('setup')

  // ═══════════════════════════════════════════
  // SETUP — players, settings, instructions
  // ═══════════════════════════════════════════
  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">
          {L('Ваша Игра', 'Your Game')}
        </h2>
        {/* Instructions card */}
        {/* Player/team setup */}
        {/* Settings (timer, target score, etc.) */}
        {/* Start button */}
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // PLAYING — the actual game
  // ═══════════════════════════════════════════
  if (phase === 'playing') {
    return (/* game UI */)
  }

  // ═══════════════════════════════════════════
  // END — results
  // ═══════════════════════════════════════════
  if (phase === 'end') {
    return (/* results + play again */)
  }
}
```

### Step 2: Register in the Catalog

Add your game to `src/games/registry.tsx`:

```tsx
{
  id: 'your-game',
  name: 'Ваша Игра',
  nameEn: 'Your Game',
  emoji: '🎲',
  tagline: {
    ru: 'Краткое описание на русском',
    en: 'Short description in English',
  },
  description: { ru: '...', en: '...' },
  minPlayers: 2,
  maxPlayers: 10,
  duration: '20-40 min',
  difficulty: 'easy',       // easy | medium | hard
  hostMode: 'none',         // required | optional | none
  categories: ['party'],    // party | word | strategy | detective | creative
  howToPlay: {
    ru: ['Шаг 1', 'Шаг 2', ...],
    en: ['Step 1', 'Step 2', ...],
  },
  commonMistakes: {
    ru: ['Ошибка 1', ...],
    en: ['Mistake 1', ...],
  },
  component: YourGame,
}
```

### Step 3: Follow These UX Guidelines

| Guideline | Why |
|-----------|-----|
| Use `L(ru, en)` for ALL text | Bilingual support |
| Add instructions card in setup | Players need to know how to play |
| Use `game-phase-indicator` badges | Clear phase tracking |
| Buttons: `py-5 touch-manipulation` | Mobile-friendly tap targets |
| Add `commonMistakes` | Prevent the most frequent rule violations |
| Use `card` and `card-hover` classes | Consistent premium look |

### Host Mode Guide

```
hostMode: 'required'   → Game NEEDS a dedicated host (e.g., Mafia, Black Stories)
                          Add narrator scripts: "Read this aloud:", "Whisper to..."
                          Host sees hidden info (roles, answers)

hostMode: 'optional'   → Can play with OR without host (e.g., Quiz)
                          Add mode selection in setup

hostMode: 'none'       → Self-play, phone runs everything (e.g., Alias, Charades)
                          Phone in center of table, everyone follows instructions
```

## Project Structure

```
gamestol/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx                 ← App entry point
│   ├── App.tsx                  ← Routes
│   ├── index.css                ← Tailwind + custom styles
│   ├── types.ts                 ← Shared TypeScript types
│   ├── i18n.tsx                 ← 12-language translation system
│   ├── components/
│   │   ├── Layout.tsx           ← Nav, header, mobile bottom bar
│   │   ├── Timer.tsx            ← Circular countdown timer
│   │   └── PlayerSetup.tsx      ← Reusable player input list
│   ├── hooks/
│   │   ├── useTimer.ts          ← Timer logic
│   │   └── useLocalStorage.ts   ← Persistent state
│   ├── data/
│   │   ├── words.ts             ← Word lists (RU + EN)
│   │   ├── quiz.ts              ← Trivia questions
│   │   ├── danetki.ts           ← Mystery stories
│   │   └── bunker.ts            ← Character generation data
│   ├── games/
│   │   ├── registry.tsx         ← Game catalog + metadata
│   │   ├── MafiaGame.tsx        ← 🎭 Mafia
│   │   ├── AliasGame.tsx        ← 💬 Alias
│   │   ├── CrocodileGame.tsx    ← 🐊 Charades
│   │   ├── CodenamesGame.tsx    ← 🕵️ Codenames
│   │   ├── QuizGame.tsx         ← 🧠 Quiz Battle
│   │   ├── BunkerGame.tsx       ← 🏚️ Bunker
│   │   ├── HatGame.tsx          ← 🎩 Hat Game
│   │   ├── ImaginariumGame.tsx  ← 🎨 Imaginarium
│   │   ├── ActivityGame.tsx     ← 🎯 Activity
│   │   └── DanetkiGame.tsx      ← 🔮 Black Stories
│   └── pages/
│       ├── Home.tsx             ← Landing page with story
│       ├── Catalog.tsx          ← Game catalog grid
│       └── GamePage.tsx         ← Game detail + play
├── .github/workflows/
│   └── deploy.yml               ← Auto-deploy to GitHub Pages
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## Why I Built This

I love board games. But every game night starts the same way:

1. Someone buys a new game
2. Nobody reads the rules
3. Someone watches a YouTube video and explains it "mostly right"
4. We argue for 30 minutes about edge cases
5. Half the group played wrong and didn't know

I wanted something that **just works**: open the app, pick a game, and play. No rule disputes. No forgotten timers. No "wait, whose turn is it?"

GameStol is that thing.

## Contributing

PRs welcome! Especially:

- **New games** — follow the [game structure guide](#step-1-create-the-game-component) above
- **Translations** — improve existing or add new languages
- **Word lists** — more words for Alias, Charades, Hat in any language
- **Quiz questions** — trivia questions in English and other languages
- **Bug fixes** — something broken? Fix it and PR

### Development

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
```

## License

MIT

---

<div align="center">

**Made with love for board games**

[Play Now](https://egorfedorov.github.io/gamestol/)

</div>
