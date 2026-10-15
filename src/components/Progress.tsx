"use client";

import { useEffect, useRef, useState } from "react";
import { Naira } from "@/lib/campaign";

/** Animates a number up whenever it changes (funding totals, helper counts). */
export function useCountUp(target: number, duration = 1400): number {
  const [value, setValue] = useState(0);
  const currentRef = useRef(0);

  useEffect(() => {
    const from = currentRef.current;
    if (from === target) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      currentRef.current = target;
      setValue(target);
      return;
    }

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(from + (target - from) * eased);
      currentRef.current = current;
      setValue(current);
      if (t < 1) raf = requestAnimationFrame(tick);
      else currentRef.current = target;
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

interface Props {
  raised: number;
  goal: number;
  percent: number;
  className?: string;
}

export default function ProgressBar({ raised, goal, percent, className = "" }: Props) {
  const animated = useCountUp(raised);
  const clamped = Math.max(0, Math.min(100, percent));
  const remaining = Math.max(0, goal - raised);

  return (
    <div className={className}>
      <div className="mb-2 flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
        <p className="display text-3xl sm:text-4xl">
          <span className="text-teal-700">{Naira.format(animated)}</span>{" "}
          <span className="text-base font-semibold text-ink-soft sm:text-lg">
            raised of {Naira.format(goal)}
          </span>
        </p>
        <p className="rounded-full bg-gold-100 px-3 py-1 text-sm font-extrabold text-gold-600">
          {percent}% funded
        </p>
      </div>

      <div
        className="progress-track relative h-5 w-full overflow-hidden rounded-full"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Funding progress"
      >
        <div className="progress-fill relative h-full rounded-full" style={{ width: `${clamped}%` }} />
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[13px] font-semibold text-ink-soft">
        <span>
          {remaining > 0 ? (
            <>
              <span className="text-ink">{Naira.format(remaining)}</span> still to go
            </>
          ) : (
            <span className="text-teal-700">Target reached — thank you 🎉</span>
          )}
        </span>
        <span>Goal: {Naira.format(goal)}</span>
      </div>
    </div>
  );
}
