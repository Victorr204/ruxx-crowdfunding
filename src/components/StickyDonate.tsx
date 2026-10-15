"use client";

import { useEffect, useState } from "react";
import { Naira } from "@/lib/campaign";
import type { CampaignStats } from "@/lib/stats";
import { scrollToDonate } from "./Header";
import { IconArrow, IconHeart } from "./Icons";

/** The bar that follows supporters down the page. */
export default function StickyDonate({ stats }: { stats: CampaignStats | null }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 620);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const raised = stats?.raisedNaira ?? 0;
  const goal = stats?.goalNaira || 700000;
  const percent = stats?.percent ?? 0;
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-30 transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-28 opacity-0"
      }`}
    >
      <div className="mx-auto max-w-6xl px-3 sm:px-6">
        <div
          className="flex items-center gap-4 rounded-full border border-ink/10 bg-white/95 px-4 py-2.5 shadow-2xl backdrop-blur"
          style={{ marginBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <div className="hidden min-w-0 flex-1 sm:block">
            <p className="flex items-baseline gap-2 text-[13.5px] font-extrabold">
              <span className="text-teal-700">{Naira.format(raised)}</span>
              <span className="text-ink-soft">of {Naira.format(goal)} · {percent}%</span>
            </p>
            <div className="progress-track relative mt-1.5 h-2 w-full overflow-hidden rounded-full">
              <div
                className="progress-fill relative h-full rounded-full"
                style={{ width: `${clamped}%` }}
              />
            </div>
          </div>

          <p className="min-w-0 flex-1 text-[13.5px] font-extrabold sm:hidden">
            <span className="text-teal-700">{Naira.format(raised)}</span>{" "}
            <span className="text-ink-soft">of {Naira.compact(goal)}</span>
          </p>

          <button
            type="button"
            onClick={scrollToDonate}
            className="btn-gold inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-5 py-2.5 text-[14.5px] font-extrabold"
          >
            <IconHeart className="h-4 w-4" />
            Donate
            <IconArrow className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
