"use client";

import { useCallback, useEffect, useState } from "react";
import type { CampaignStats } from "@/lib/stats";
import Header from "./Header";
import Hero from "./Hero";
import Story from "./Story";
import Services from "./Services";
import WhyFund from "./WhyFund";
import GiveForm, { type DonationConfirmation } from "./GiveForm";
import HelpersWall from "./HelpersWall";
import ShareSection from "./ShareSection";
import Trust from "./Trust";
import Footer from "./Footer";
import StickyDonate from "./StickyDonate";
import ThankYou from "./ThankYou";

interface Props {
  initial: CampaignStats | null;
}

export default function Landing({ initial }: Props) {
  const [stats, setStats] = useState<CampaignStats | null>(initial);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<DonationConfirmation | null>(null);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/campaign", { cache: "no-store" });
      const data = (await response.json()) as CampaignStats & { error?: string };
      if (!response.ok || data.error) throw new Error(data.error || "Request failed");
      setStats(data);
      setNotice(null);
    } catch {
      setNotice(
        "Live figures are taking a moment to load — they refresh automatically every few seconds.",
      );
    }
  }, []);

  // Initial load + keep the numbers fresh while the page is open.
  useEffect(() => {
    refresh();
    const timer = window.setInterval(refresh, 20_000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  // Someone returning from Paystack's hosted checkout (redirect fallback).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference");
    if (!reference) return;

    let cancelled = false;

    (async () => {
      try {
        const response = await fetch(`/api/verify?reference=${encodeURIComponent(reference)}`);
        const data = (await response.json()) as {
          verified: boolean;
          amountNaira?: number;
          donorName?: string;
        };
        if (!cancelled && data.verified) {
          setConfirmation({
            amountNaira: data.amountNaira ?? 0,
            name: data.donorName || "Friend",
          });
          await refresh();
        }
      } catch {
        /* verification will be retried by the periodic refresh */
      } finally {
        window.history.replaceState({}, "", window.location.pathname);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [refresh]);

  const handleDonation = useCallback(
    async (donation: DonationConfirmation) => {
      try {
        await refresh();
      } finally {
        setConfirmation(donation);
      }
    },
    [refresh],
  );

  return (
    <>
      <Header />

      <main>
        {notice && (
          <div className="mx-auto mt-4 max-w-6xl px-4 sm:px-6">
            <p className="rounded-2xl border border-clay/25 bg-clay/10 px-4 py-3 text-center text-[14px] font-semibold text-clay">
              {notice}
            </p>
          </div>
        )}

        <Hero stats={stats} />
        <Story />
        <Services />
        <WhyFund />
        <GiveForm onDone={handleDonation} />
        <HelpersWall stats={stats} />
        <ShareSection />
        <Trust />
      </main>

      <Footer />

      {!confirmation && <StickyDonate stats={stats} />}

      <ThankYou
        confirmation={confirmation}
        helperNumber={Math.max(1, stats?.helperCount ?? 1)}
        onClose={() => setConfirmation(null)}
      />
    </>
  );
}
