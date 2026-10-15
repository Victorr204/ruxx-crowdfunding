"use client";

import { useState } from "react";
import { campaign } from "@/lib/campaign";
import { useShareUrl } from "@/lib/share";
import { shareWhatsAppUrl } from "./Hero";
import { IconCopy, IconCheck, IconTelegram, IconWhatsApp, IconX } from "./Icons";

export default function ShareSection() {
  const [copied, setCopied] = useState(false);
  const url = useShareUrl();

  const shareText =
    "Victor is ₦1,500,000 away from launching Ruxx Prepaid — an app for airtime, data, DStv and electricity payments in Nigeria. Even ₦500 helps. Please take a look:";

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section
      id="share"
      className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 sm:px-6 sm:py-20"
    >
      <div className="overflow-hidden rounded-[2rem] bg-teal-100 p-6 sm:p-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-teal-700">
              Can’t donate?
            </p>
            <h2 className="display mt-3 text-4xl text-ink sm:text-5xl">
              {campaign.cannotDonate.heading}
            </h2>
            <p className="mt-4 max-w-xl text-[16.5px] leading-relaxed text-teal-700">
              {campaign.cannotDonate.body}
            </p>

            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[13.5px] font-extrabold text-teal-700 shadow-sm">
              One share could find the person who closes the gap.
            </p>
          </div>

          <div className="rounded-[1.75rem] bg-white p-5 shadow-sm">
            <a
              href={shareWhatsAppUrl(url)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-teal flex items-center justify-center gap-3 rounded-full px-5 py-4 text-[17px] font-extrabold"
            >
              <IconWhatsApp className="h-6 w-6" />
              Share on WhatsApp
            </a>

            <div className="mt-3 grid grid-cols-3 gap-2.5">
              <a
                href={xUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 rounded-2xl border-2 border-ink/10 px-2 py-3 text-center transition hover:border-ink/30"
              >
                <IconX className="h-5 w-5" />
                <span className="text-[12.5px] font-extrabold">X / Twitter</span>
              </a>

              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 rounded-2xl border-2 border-ink/10 px-2 py-3 text-center transition hover:border-ink/30"
              >
                <IconTelegram className="h-5 w-5" />
                <span className="text-[12.5px] font-extrabold">Telegram</span>
              </a>

              <button
                type="button"
                onClick={copyLink}
                className="flex flex-col items-center gap-1.5 rounded-2xl border-2 border-ink/10 px-2 py-3 text-center transition hover:border-ink/30"
              >
                {copied ? (
                  <IconCheck className="h-5 w-5 text-teal" />
                ) : (
                  <IconCopy className="h-5 w-5" />
                )}
                <span className="text-[12.5px] font-extrabold">
                  {copied ? "Copied!" : "Copy link"}
                </span>
              </button>
            </div>

            <p className="mt-3 break-all rounded-xl bg-cream-2 px-3 py-2.5 text-[12.5px] font-semibold text-ink-soft">
              {url}
            </p>

            <p className="mt-3 text-center text-[13px] font-semibold text-ink-soft">
              Or message Victor directly on{" "}
              <a
                href={campaign.fundraiser.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-extrabold text-teal-700 underline underline-offset-2"
              >
                WhatsApp
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
