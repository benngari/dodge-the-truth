# 🦕 Dodge-the-Truth

A playful quiz where the "correct" answer always runs away from your cursor.
Built with React, TypeScript, Tailwind CSS, and Framer Motion.

## How it works

Each question has a `Yes` and `No` button. One of them is the "correct"
answer — and that's the one that dodges your cursor (or finger, on touch
devices) whenever you get close. The other button sits still and is the
realistic path through the game. Catch the runaway answer if you can; it's
hard on purpose.

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Scripts

- `npm run dev` — start the local dev server
- `npm run build` — type-check and build a production bundle to `dist/`
- `npm run preview` — preview the production build locally
- `npm run lint` — type-check only (no emit)

## Project structure

```
src/
├── components/
│   ├── QuestionCard.tsx     # The game "arena": dodge logic, feedback, layout
│   ├── EscapingButton.tsx   # Position-controlled button with spring animation
│   ├── ProgressBar.tsx      # Question count + running score
│   └── ResultScreen.tsx     # Final tongue-in-cheek verdict screen
├── data/
│   └── questions.ts         # All 18 questions + correct answers + copy
├── pages/
│   └── Home.tsx             # Orchestrates game state, confetti, sound/theme toggles
├── utils/
│   └── sound.ts             # Tiny Web Audio sound effects (no audio files needed)
├── App.tsx                  # Dark mode state + root render
└── main.tsx                 # Entry point
```

## Notes

- **Confetti** is powered by `canvas-confetti` and fires when a player
  manages to catch the runaway answer.
- **Sound effects** are synthesized live with the Web Audio API — there are
  no audio assets to manage, and they respect a mute toggle in the header.
- **Dark mode** persists to `localStorage` and defaults to the OS preference
  on first visit.
- **Touch support**: since touch devices don't have hover, the arena also
  reacts to `pointerdown`/drag near the runaway button so the dodge still
  feels responsive on mobile.
- Add more questions any time by appending objects to `QUESTIONS` in
  `src/data/questions.ts` — no other file needs to change.
