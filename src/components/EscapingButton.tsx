import { forwardRef } from "react";
import { motion } from "framer-motion";
import type { AnswerValue } from "../data/questions";

interface EscapingButtonProps {
  /** "Yes" or "No" — also doubles as the answer value. */
  label: string;
  variant: AnswerValue;
  /** Absolute pixel position within the arena (left/top are pinned to 0). */
  x: number;
  y: number;
  /** True while this button is actively dodging — drives a tiny "alert" wiggle. */
  isFleeing: boolean;
  disabled?: boolean;
  onClick: () => void;
  onPointerEnterCapture?: () => void;
}

/**
 * A button whose on-screen position is fully controlled by its parent
 * (x / y props). The parent decides *where* it goes; this component is
 * only responsible for animating smoothly to that spot and looking
 * delighted/panicked about it. Forwards its ref to the underlying
 * <button> so the parent can measure real dimensions / bounding rect.
 */
const EscapingButton = forwardRef<HTMLButtonElement, EscapingButtonProps>(function EscapingButton(
  { label, variant, x, y, isFleeing, disabled, onClick, onPointerEnterCapture },
  ref
) {
  const palette =
    variant === "yes"
      ? "from-mint to-emerald-400 text-ink shadow-[0_6px_0_0_rgba(6,95,70,0.6)]"
      : "from-punch to-rose-500 text-white shadow-[0_6px_0_0_rgba(136,19,55,0.6)]";

  return (
    <motion.button
      ref={ref}
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      onPointerEnter={onPointerEnterCapture}
      className={[
        "absolute left-0 top-0 select-none touch-none",
        "rounded-2xl px-8 py-4 text-lg sm:text-xl font-display font-semibold",
        "bg-gradient-to-br",
        palette,
        "active:translate-y-[2px] active:shadow-none",
        "cursor-pointer disabled:cursor-default",
      ].join(" ")}
      style={{ willChange: "transform" }}
      initial={false}
      animate={{
        x,
        y,
        rotate: isFleeing ? [0, -4, 4, -3, 3, 0] : 0,
        scale: isFleeing ? [1, 1.08, 1] : 1,
      }}
      transition={{
        x: { type: "spring", stiffness: 260, damping: 18, mass: 0.7 },
        y: { type: "spring", stiffness: 260, damping: 18, mass: 0.7 },
        rotate: { duration: 0.45, ease: "easeInOut" },
        scale: { duration: 0.35, ease: "easeOut" },
      }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.94 }}
    >
      {label}
    </motion.button>
  );
});

export default EscapingButton;
