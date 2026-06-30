import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EscapingButton from "./EscapingButton";
import type { AnswerValue, Question } from "../data/questions";
import { playDodgeSound, playCorrectPathSound, playCatchSound } from "../utils/sound";

interface Point {
  x: number;
  y: number;
}

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  soundEnabled: boolean;
  /** Fired once the feedback beat has played out — tells the parent to advance. */
  onResolved: (outcome: "caught" | "normal") => void;
}

/** Estimated button footprint used before we can measure the real node. */
const FALLBACK_BUTTON_SIZE = { width: 132, height: 64 };
/** How close the cursor needs to get (px) before the answer bolts. */
const DODGE_RADIUS = 90;
/** Minimum time between dodges, so the button doesn't vibrate in place. */
const DODGE_COOLDOWN_MS = 220;
/** Inner padding so buttons never spawn flush against the arena's edge. */
const ARENA_PADDING = 14;

function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  soundEnabled,
  onResolved,
}: QuestionCardProps) {
  const arenaRef = useRef<HTMLDivElement>(null);
  const fleeingButtonRef = useRef<HTMLButtonElement | null>(null);

  const [positions, setPositions] = useState<Record<AnswerValue, Point>>({
    yes: { x: 24, y: 24 },
    no: { x: 200, y: 24 },
  });
  const [isFleeing, setIsFleeing] = useState(false);
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; caught: boolean } | null>(null);

  const lastDodgeAt = useRef(0);
  const initializedFor = useRef<number | null>(null);

  const fleeingAnswer: AnswerValue = question.correctAnswer;
  const staticAnswer: AnswerValue = fleeingAnswer === "yes" ? "no" : "yes";

  /** Lay both buttons out side by side, centered in the arena. */
  const layoutInitialPositions = useCallback(() => {
    const arena = arenaRef.current;
    if (!arena) return;
    const rect = arena.getBoundingClientRect();
    const btnW = fleeingButtonRef.current?.offsetWidth || FALLBACK_BUTTON_SIZE.width;
    const btnH = fleeingButtonRef.current?.offsetHeight || FALLBACK_BUTTON_SIZE.height;

    const centerY = rect.height / 2 - btnH / 2;
    const gap = 56; // wider gap so buttons never touch
    const leftX = rect.width / 2 - btnW - gap / 2;
    const rightX = rect.width / 2 + gap / 2;

    // "Yes" always renders on the left, "No" on the right — predictable
    // layout, regardless of which one happens to be correct this round.
    setPositions({
      yes: { x: Math.max(ARENA_PADDING, leftX), y: Math.max(ARENA_PADDING, centerY) },
      no: { x: Math.min(rect.width - btnW - ARENA_PADDING, rightX), y: Math.max(ARENA_PADDING, centerY) },
    });
  }, []);

  // Re-layout whenever a new question arrives, and on resize.
  useEffect(() => {
    if (initializedFor.current === question.id) return;
    initializedFor.current = question.id;
    setLocked(false);
    setFeedback(null);
    setIsFleeing(false);
    // Defer one frame so the arena has its real measured size.
    const raf = requestAnimationFrame(layoutInitialPositions);
    return () => cancelAnimationFrame(raf);
  }, [question.id, layoutInitialPositions]);

  useEffect(() => {
    const handleResize = () => layoutInitialPositions();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [layoutInitialPositions]);

  /** Find a new spot for a button, away from the cursor and (optionally) the other button. */
  const findEscapeSpot = useCallback(
    (cursor: Point, avoid: Point, btnW: number, btnH: number, rect: DOMRect): Point => {
      const maxX = Math.max(ARENA_PADDING, rect.width - btnW - ARENA_PADDING);
      const maxY = Math.max(ARENA_PADDING, rect.height - btnH - ARENA_PADDING);

      let best: Point = { x: ARENA_PADDING, y: ARENA_PADDING };
      let bestScore = -Infinity;

      for (let i = 0; i < 10; i++) {
        const candidate: Point = {
          x: ARENA_PADDING + Math.random() * (maxX - ARENA_PADDING),
          y: ARENA_PADDING + Math.random() * (maxY - ARENA_PADDING),
        };
        const candidateCenter: Point = { x: candidate.x + btnW / 2, y: candidate.y + btnH / 2 };
        const score = distance(candidateCenter, cursor) + distance(candidateCenter, avoid) * 0.5;
        if (score > bestScore) {
          bestScore = score;
          best = candidate;
        }
      }
      return best;
    },
    []
  );

  /** Move the runaway button (and, on trick questions, BOTH buttons) away from the cursor. */
  const dodgeTo = useCallback(
    (cursor: Point) => {
      const arena = arenaRef.current;
      if (!arena || locked) return;

      const now = performance.now();
      if (now - lastDodgeAt.current < DODGE_COOLDOWN_MS) return;

      const rect = arena.getBoundingClientRect();
      const btnW = fleeingButtonRef.current?.offsetWidth || FALLBACK_BUTTON_SIZE.width;
      const btnH = fleeingButtonRef.current?.offsetHeight || FALLBACK_BUTTON_SIZE.height;

      lastDodgeAt.current = now;
      setIsFleeing(true);
      if (soundEnabled) playDodgeSound();

      if (question.isTrickQuestion) {
        // Chaos mode: both buttons bolt, each avoiding the cursor and each other.
        const fleeingCenter: Point = {
          x: positions[fleeingAnswer].x + btnW / 2,
          y: positions[fleeingAnswer].y + btnH / 2,
        };
        const staticCenter: Point = {
          x: positions[staticAnswer].x + btnW / 2,
          y: positions[staticAnswer].y + btnH / 2,
        };
        const newFleeing = findEscapeSpot(cursor, staticCenter, btnW, btnH, rect);
        const newStatic = findEscapeSpot(cursor, fleeingCenter, btnW, btnH, rect);
        setPositions({ [fleeingAnswer]: newFleeing, [staticAnswer]: newStatic } as Record<AnswerValue, Point>);
      } else {
        const staticCenter: Point = {
          x: positions[staticAnswer].x + btnW / 2,
          y: positions[staticAnswer].y + btnH / 2,
        };
        const newSpot = findEscapeSpot(cursor, staticCenter, btnW, btnH, rect);
        setPositions((prev) => ({ ...prev, [fleeingAnswer]: newSpot }));
      }

      window.setTimeout(() => setIsFleeing(false), 400);
    },
    [fleeingAnswer, staticAnswer, positions, locked, soundEnabled, question.isTrickQuestion, findEscapeSpot]
  );

  /** Mouse / pen / touch-drag tracking across the whole arena. */
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (locked) return;
      const arena = arenaRef.current;
      const btn = fleeingButtonRef.current;
      if (!arena || !btn) return;

      const arenaRect = arena.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();

      const cursor: Point = { x: e.clientX - arenaRect.left, y: e.clientY - arenaRect.top };
      const btnCenter: Point = {
        x: btnRect.left - arenaRect.left + btnRect.width / 2,
        y: btnRect.top - arenaRect.top + btnRect.height / 2,
      };

      if (distance(cursor, btnCenter) < DODGE_RADIUS) {
        dodgeTo(cursor);
      }
    },
    [dodgeTo, locked]
  );

  /** A tap that starts close to the button should also trigger a dodge (mobile has no hover). */
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType !== "touch" || locked) return;
      handlePointerMove(e);
    },
    [handlePointerMove, locked]
  );

  const resolveAnswer = useCallback(
    (answer: AnswerValue) => {
      if (locked) return;
      setLocked(true);
      const caught = answer === fleeingAnswer;
      if (caught) {
        if (soundEnabled) playCatchSound();
        setFeedback({ text: question.catchResponse, caught: true });
      } else {
        if (soundEnabled) playCorrectPathSound();
        setFeedback({ text: question.wrongResponse, caught: false });
      }

      window.setTimeout(
        () => {
          onResolved(caught ? "caught" : "normal");
        },
        caught ? 1800 : 1300
      );
    },
    [fleeingAnswer, locked, onResolved, question.catchResponse, question.wrongResponse, soundEnabled]
  );

  return (
    <div className="w-full">
      <p className="mb-1 text-center font-body text-xs font-bold uppercase tracking-widest text-grape/70 dark:text-zest/80">
        Question {questionNumber} of {totalQuestions}
      </p>
      <h2 className="mb-6 text-balance text-center font-display text-2xl font-semibold leading-snug text-ink dark:text-cloud sm:text-3xl">
        {question.prompt}
      </h2>

      <div
        ref={arenaRef}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        className="relative h-56 w-full touch-none rounded-3xl border-2 border-dashed border-ink/10 bg-white/40 dark:border-cloud/10 dark:bg-white/5 sm:h-64"
      >
        <EscapingButton
          label="Yes"
          variant="yes"
          x={positions.yes.x}
          y={positions.yes.y}
          isFleeing={isFleeing}
          disabled={locked}
          onClick={() => resolveAnswer("yes")}
          ref={fleeingAnswer === "yes" ? fleeingButtonRef : undefined}
        />
        <EscapingButton
          label="No"
          variant="no"
          x={positions.no.x}
          y={positions.no.y}
          isFleeing={isFleeing}
          disabled={locked}
          onClick={() => resolveAnswer("no")}
          ref={fleeingAnswer === "no" ? fleeingButtonRef : undefined}
        />

        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              className={[
                "pointer-events-none absolute inset-x-3 bottom-3 rounded-2xl px-4 py-3 text-center font-display text-sm font-semibold shadow-chunky-sm sm:text-base",
                feedback.caught ? "bg-zest text-ink" : "bg-grape text-white",
              ].join(" ")}
              role="status"
              aria-live="polite"
            >
              {feedback.caught ? "🎉 Impossible! You caught me! " : "💬 "}
              {feedback.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-3 text-center font-body text-xs text-ink/50 dark:text-cloud/50">
        {question.isTrickQuestion
          ? "⚠️ Chaos mode: BOTH buttons are running from you."
          : "Tip: one of these buttons really, really doesn't want to be clicked."}
      </p>
    </div>
  );
}