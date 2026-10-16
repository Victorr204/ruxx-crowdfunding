"use client";

import Image from "next/image";
import { campaign, Naira, siteUrl } from "@/lib/campaign";
import type { CampaignStats } from "@/lib/stats";
import { useShareUrl } from "@/lib/share";
import ProgressBar, { useCountUp } from "./Progress";
import { scrollToDonate } from "./Header";
import { IconArrow, IconHeart, IconShield, IconSparkle, IconUsers, IconWhatsApp } from "./Icons";

interface Props {
  stats: CampaignStats | null;
}

export default function Hero({ stats }: Props) {
  const { title, tagline, goalNaira, fundraiser, images } = campaign;

  const raised = stats?.raisedNaira ?? 0;
  const percent = stats?.percent ?? 0;
  const helpers = useCountUp(stats?.helperCount ?? 0, 1000);
  const first = stats?.first ?? null;
  const live = stats !== null;
  const shareBase = useShareUrl();

  return (
    <section id="top" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-4 pt-8 sm:px-6 sm:pt-14">
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        {/* ---------------------------------------------------------- copy */}
        <div className="rise">
          <p className="inline-flex items-center gap-2 rounded-full border border-teal/20 bg-teal-100 px-3.5 py-1.5 text-[12.5px] font-bold text-teal-700">
            <span
              className={`h-2 w-2 rounded-full bg-clay ${live ? "pulse-soft" : "opacity-40"}`}
              aria-hidden
            />
            {live ? "Live campaign · started 15 October 2026" : "Connecting to Paystack…"}
          </p>

          <h1 className="display mt-5 text-[2.35rem] leading-[1.03] sm:text-6xl">
            {title.split(" ").slice(0, -2).join(" ")}{" "}
            <span className="text-teal-700">{title.split(" ").slice(-2).join(" ")}</span>
          </h1>

          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink-soft">{tagline}</p>

          {/* ------------------------------------------------- progress card */}
          <div className="card mt-7 p-5 sm:p-6">
            <ProgressBar raised={raised} goal={goalNaira} percent={percent} />

            <div className="mt-5 grid grid-cols-3 gap-2 border-t border-ink/5 pt-4 text-center">
              <div>
                <p className="display text-2xl text-ink">{helpers}</p>
                <p className="text-[11.5px] font-semibold uppercase tracking-wide text-ink-soft">
                  {helpers === 1 ? "person helped" : "people helped"}
                </p>
              </div>
              <div className="border-x border-ink/5">
                <p className="display text-2xl text-ink">{stats?.donationCount ?? 0}</p>
                <p className="text-[11.5px] font-semibold uppercase tracking-wide text-ink-soft">
                  contributions
                </p>
              </div>
              <div>
                <p className="display text-2xl text-ink">{Naira.compact(goalNaira)}</p>
                <p className="text-[11.5px] font-semibold uppercase tracking-wide text-ink-soft">
                  the goal
                </p>
              </div>
            </div>

            {/* -------- the first-helper moment -------- */}
            <div className="mt-4 rounded-2xl bg-gold-100/70 p-4">
              {first ? (
                <p className="flex items-start gap-2.5 text-[14.5px] leading-snug">
                  <span className="text-lg leading-none">🌟</span>
                  <span>
                    <strong>{first.name}</strong> was the very first to help —{" "}
                    <strong>{Naira.format(first.amountNaira)}</strong> that started everything.
                  </span>
                </p>
              ) : (
                <p className="flex items-start gap-2.5 text-[14.5px] leading-snug">
                  <span className="text-lg leading-none">🌟</span>
                  <span>
                    <strong>Be the first to help.</strong> Nobody has given yet — your name goes
                    right here, and it stays there.
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* ------------------------------------------------------- actions */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={scrollToDonate}
              className="btn-gold group inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-[16px] font-extrabold"
            >
              {first ? "I want to help" : "Be the first to help"}
              <IconArrow className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>

            <a
              href={shareWhatsAppUrl(shareBase)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-teal/25 px-6 py-[14px] text-[15px] font-extrabold text-teal transition hover:border-teal hover:bg-teal-100"
            >
              <IconWhatsApp className="h-5 w-5" />
              Share on WhatsApp
            </a>
          </div>

          <ul className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-semibold text-ink-soft">
            <li className="inline-flex items-center gap-1.5">
              <IconShield className="h-4 w-4 text-teal" /> Secured by Paystack
            </li>
            <li className="inline-flex items-center gap-1.5">
              <IconHeart className="h-4 w-4 text-clay" /> Give from {Naira.format(campaign.minNaira)}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <IconSparkle className="h-4 w-4 text-gold-600" /> Card · Transfer · USSD
            </li>
          </ul>
        </div>

        {/* ---------------------------------------------------------- visual */}
        <div className="relative rise" style={{ animationDelay: "120ms" }}>
          <div className="card relative overflow-hidden p-3 sm:p-4">
            <Image
              src={images.hero}
              alt="The Ruxx Prepaid app — airtime, data, cable TV and electricity payments"
              width={1672}
              height={941}
              sizes="(max-width: 1024px) calc(100vw - 56px), 470px"
              priority
              className="h-auto w-full rounded-2xl"
            />
          </div>

          <div className="floaty absolute -left-2 top-6 rounded-2xl border border-ink/5 bg-white px-4 py-3 shadow-lg sm:-left-6">
            <p className="flex items-center gap-2 text-[13px] font-extrabold text-teal-700">
              {helpers === 0 ? (
                <>
                  <IconSparkle className="h-4 w-4 text-gold-600" />
                  Be the first to help
                </>
              ) : (
                <>
                  <IconUsers className="h-4 w-4" />
                  {helpers} {helpers === 1 ? "helper" : "helpers"} so far
                </>
              )}
            </p>
            <p className="text-[11.5px] font-semibold text-ink-soft">
              {helpers === 0 ? "Your name goes right here" : "Every single one counted"}
            </p>
          </div>

          <div
            className="floaty absolute -right-1 bottom-8 rounded-2xl border border-ink/5 bg-white px-4 py-3 shadow-lg sm:-right-4"
            style={{ animationDelay: "1.6s" }}
          >
            <p className="flex items-center gap-2 text-[13px] font-extrabold text-gold-600">
              <IconSparkle className="h-4 w-4" />
              {Naira.format(500)} still counts
            </p>
            <p className="text-[11.5px] font-semibold text-ink-soft">
              {(goalNaira / 1000).toLocaleString("en-NG")} people × {Naira.format(1000)} = goal
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------- founder strip */}
      <div className="mt-12 flex items-center justify-center gap-4 rounded-3xl border border-ink/5 bg-white/70 px-4 py-4 sm:mt-16">
        <Image
          src={fundraiser.photo}
          alt={fundraiser.name}
          width={530}
          height={470}
          sizes="48px"
          className="h-12 w-12 rounded-full object-cover ring-2 ring-gold/50"
        />
        <p className="text-center text-sm leading-snug sm:text-left">
          <span className="font-extrabold">{fundraiser.name}</span>
          <span className="block text-ink-soft">
            <a
              href={campaign.business.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-teal-700 underline underline-offset-2"
            >
              {fundraiser.role}
            </a>{" "}
            · asking many people to carry a little, together
          </span>
        </p>
      </div>
    </section>
  );
}

/** WhatsApp share link with a pre-written message.
 *  Pass the live origin from `useShareUrl()` so it never says "localhost". */
export function shareWhatsAppUrl(base: string = siteUrl()): string {
  const url = base;
  const text =
    "I'm supporting Victor Chidiebere Ruben's campaign to launch Ruxx Prepaid — an app for airtime, data, DStv and electricity payments in Nigeria. " +
    "He needs ₦1,500,000 to finish, test and publish it. Even ₦500 helps. Join me: " +
    url;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
