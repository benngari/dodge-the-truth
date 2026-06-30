import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
  score: number;
}

/**
 * A chunky, rounded progress bar with the current question number
 * and running score. Built with plain divs (no extra dependency).
 */
export default function ProgressBar({ current, total, score }: ProgressBarProps) {
  const percent = Math.min(100, Math.round((current / total) * 100));

  return (
    <div className="w-full max-w-md">
      <div className="mb-2 flex items-center justify-between font-body text-sm font-bold text-ink/70 dark:text-cloud/70">
        <span>
          Question {Math.min(current + 1, total)} / {total}
        </span>
        <span className="flex items-center gap-1">
          🏆 Score: <span className="text-grape dark:text-zest">{score}</span>
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-ink/10 dark:bg-cloud/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-grape via-punch to-zest"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}
