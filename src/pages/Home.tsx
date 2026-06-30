import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import QuestionCard from "../components/QuestionCard";
import ProgressBar from "../components/ProgressBar";
import ResultScreen from "../components/ResultScreen";
import { QUESTIONS } from "../data/questions";

interface HomeProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

/** Points awarded for the normal path (clicking the static, expected answer). */
const POINTS_PER_NORMAL_ANSWER = 1;
/** Bonus points for the rare feat of catching the runaway answer. */
const POINTS_PER_CATCH = 3;

function fireConfetti() {
  const colors = ["#6C5CE7", "#FF5D73", "#FFC93C", "#2EE6A6"];
  confetti({
    particleCount: 90,
    spread: 75,
    origin: { y: 0.6 },
    colors,
    scalar: 0.9,
  });
  confetti({
    particleCount: 50,
    spread: 100,
    origin: { y: 0.5 },
    colors,
    scalar: 1.2,
    angle: 60,
  });
  confetti({
    particleCount: 50,
    spread: 100,
    origin: { y: 0.5 },
    colors,
    scalar: 1.2,
    angle: 120,
  });
}

export default function Home({ darkMode, onToggleDarkMode }: HomeProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [catches, setCatches] = useState(0);
  const [finished, setFinished] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const totalQuestions = QUESTIONS.length;
  const currentQuestion = useMemo(() => QUESTIONS[questionIndex], [questionIndex]);

  const handleResolved = useCallback(
    (outcome: "caught" | "normal") => {
      if (outcome === "caught") {
        setScore((s) => s + POINTS_PER_CATCH);
        setCatches((c) => c + 1);
        fireConfetti();
      } else {
        setScore((s) => s + POINTS_PER_NORMAL_ANSWER);
      }

      setQuestionIndex((prev) => {
        const next = prev + 1;
        if (next >= totalQuestions) {
          setFinished(true);
          return prev;
        }
        return next;
      });
    },
    [totalQuestions]
  );

  const handleRestart = useCallback(() => {
    setQuestionIndex(0);
    setScore(0);
    setCatches(0);
    setFinished(false);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-10">
      {/* Background: flat base + faint grid + grain for texture, no gradient blobs */}
      <div className="pointer-events-none absolute inset-0 bg-cloud dark:bg-ink" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] dark:opacity-[0.09]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          color: "#6C5CE7",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div
        className="pointer-events-none absolute -left-32 -top-40 h-[28rem] w-[28rem] rounded-full opacity-40 blur-[110px] dark:opacity-30"
        style={{ background: "radial-gradient(circle, #6C5CE7, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-48 -right-24 h-[32rem] w-[32rem] rounded-full opacity-30 blur-[120px] dark:opacity-25"
        style={{ background: "radial-gradient(circle, #FF5D73, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Header controls */}
      <div className="relative z-10 mb-6 flex w-full max-w-md items-center justify-between">
        <h1 className="font-display text-xl font-bold text-ink dark:text-cloud sm:text-2xl">
          🦕 Dodge-the-Truth
        </h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundEnabled((s) => !s)}
            aria-label={soundEnabled ? "Mute sound effects" : "Unmute sound effects"}
            aria-pressed={soundEnabled}
            className="rounded-full bg-white/70 px-3 py-2 text-sm shadow-sm transition hover:scale-105 dark:bg-white/10"
          >
            {soundEnabled ? "🔊" : "🔇"}
          </button>
          <button
            type="button"
            onClick={onToggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={darkMode}
            className="rounded-full bg-white/70 px-3 py-2 text-sm shadow-sm transition hover:scale-105 dark:bg-white/10"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      {/* Main card */}
      <motion.div
        layout
        className="relative z-10 w-full max-w-md rounded-[2rem] bg-white/80 p-6 shadow-chunky backdrop-blur-md dark:bg-ink/60 sm:p-8"
      >
        {!finished && (
          <div className="mb-6 flex justify-center">
            <ProgressBar current={questionIndex} total={totalQuestions} score={score} />
          </div>
        )}

        <AnimatePresence mode="wait">
          {finished ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
            >
              <ResultScreen
                score={score}
                totalQuestions={totalQuestions}
                catches={catches}
                onRestart={handleRestart}
              />
            </motion.div>
          ) : (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
            >
              <QuestionCard
                question={currentQuestion}
                questionNumber={questionIndex + 1}
                totalQuestions={totalQuestions}
                soundEnabled={soundEnabled}
                onResolved={handleResolved}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <p className="relative z-10 mt-6 max-w-md text-center font-body text-xs text-ink/50 dark:text-cloud/50">
        Built for people with too much trust in their own reflexes.
      </p>
    </div>
  );
}