"use client";

import { useEffect } from "react";
import { Naira, siteUrl } from "@/lib/campaign";
import Confetti from "./Confetti";
import { shareWhatsAppUrl } from "./Hero";
import { IconCheck, IconWhatsApp, IconX } from "./Icons";
import type { DonationConfirmation } from "./GiveForm";

interface Props {
  confirmation: DonationConfirmation | null;
  helperNumber: number;
  onClose: () => void;
}

export default function ThankYou({ confirmation, helperNumber, onClose }: Props) {
  useEffect(() => {
    if (!confirmation) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [confirmation, onClose]);

  if (!confirmation) return null;

  const firstName = confirmation.name.split(" ")[0] || "friend";

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Thank you for contributing"
    >
      <Confetti />

      <div className="card relative w-full max-w-md p-6 text-center sm:p-8">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold-100 text-3xl">
          🎉
        </span>

        <h2 className="display mt-4 text-3xl sm:text-4xl">
          Thank you, <span className="text-teal-700">{firstName}</span>!
        </h2>

        <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">
          Your <strong className="text-ink">{Naira.format(confirmation.amountNaira)}</strong> just
          landed. You are helper{" "}
          <strong className="text-gold-600">#{helperNumber}</strong> on the Ruxx Prepaid campaign —
          and your name is on the wall.
        </p>

        <div className="mt-5 rounded-2xl bg-gold-100 p-4 text-[14.5px] leading-snug text-ink">
          <strong>One more thing that costs nothing:</strong> tell one person about this campaign.
          If {firstName} and one friend share it, we reach the goal faster than any single
          contribution can.
        </div>

        <div className="mt-5 grid gap-2.5">
          <a
            href={shareWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-teal inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-[15px] font-extrabold"
          >
            <IconWhatsApp className="h-5 w-5" />
            Share on WhatsApp
          </a>

          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              "I just supported Victor's campaign to launch Ruxx Prepaid — airtime, data, cable TV and electricity payments in one app. Even ₦500 helps him reach ₦700,000.",
            )}&url=${encodeURIComponent(siteUrl())}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink/10 px-5 py-3 text-[15px] font-extrabold text-ink transition hover:border-ink/30"
          >
            <IconX className="h-4 w-4" />
            Post on X
          </a>
        </div>

        <button
          type="button"
          onClick={onClose}
          autoFocus
          className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-bold text-ink-soft underline decoration-ink/20 underline-offset-4 transition hover:text-ink"
        >
          <IconCheck className="h-4 w-4 text-teal" />
          Back to the campaign
        </button>
      </div>
    </div>
  );
}
