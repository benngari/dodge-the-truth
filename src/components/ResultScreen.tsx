import { motion } from "framer-motion";

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  catches: number;
  onRestart: () => void;
}

function getVerdict(catches: number, totalQuestions: number): { headline: string; subline: string; emoji: string } {
  if (catches === 0) {
    return {
      emoji: "🧍",
      headline: "A true mortal.",
      subline: "You never once caught the runaway answer. Respectable restraint, or just bad reflexes — we won't ask.",
    };
  }
  if (catches / totalQuestions < 0.34) {
    return {
      emoji: "🤏",
      headline: "Cursor Whisperer (Apprentice Tier).",
      subline: `You cornered ${catches} runaway answer${catches === 1 ? "" : "s"}. The buttons are filing an incident report.`,
    };
  }
  return {
    emoji: "🏃‍♂️💨",
    headline: "Unstoppable. Certified Button Hunter.",
    subline: `You caught ${catches} of them. At this point the buttons are scared of YOU.`,
  };
}

/**
 * The closing screen: a tongue-in-cheek "verdict" based on how many
 * runaway answers the player actually managed to corner, plus the
 * usual score recap and a way to go again.
 */
export default function ResultScreen({ score, totalQuestions, catches, onRestart }: ResultScreenProps) {
  const verdict = getVerdict(catches, totalQuestions);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="flex flex-col items-center text-center"
    >
      <motion.span
        className="mb-3 text-6xl"
        animate={{ rotate: [0, -8, 8, -8, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1.5 }}
      >
        {verdict.emoji}
      </motion.span>

      <h2 className="font-display text-3xl font-bold text-ink dark:text-cloud sm:text-4xl">{verdict.headline}</h2>
      <p className="mt-3 max-w-sm font-body text-base text-ink/70 dark:text-cloud/70">{verdict.subline}</p>

      <div className="mt-8 grid w-full max-w-xs grid-cols-2 gap-3">
        <div className="rounded-2xl bg-grape/10 px-4 py-5 dark:bg-grape/20">
          <p className="font-display text-3xl font-bold text-grape dark:text-zest">{score}</p>
          <p className="mt-1 font-body text-xs font-bold uppercase tracking-wide text-ink/60 dark:text-cloud/60">
            Total score
          </p>
        </div>
        <div className="rounded-2xl bg-punch/10 px-4 py-5 dark:bg-punch/20">
          <p className="font-display text-3xl font-bold text-punch">{catches}</p>
          <p className="mt-1 font-body text-xs font-bold uppercase tracking-wide text-ink/60 dark:text-cloud/60">
            Caught runaways
          </p>
        </div>
      </div>

      <motion.button
        type="button"
        onClick={onRestart}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="mt-8 rounded-2xl bg-gradient-to-br from-grape to-violet-500 px-8 py-4 font-display text-lg font-semibold text-white shadow-chunky"
      >
        🔁 Play again
      </motion.button>
    </motion.div>
  );
}
