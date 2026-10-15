"use client";

import { campaign, Naira } from "@/lib/campaign";
import type { CampaignStats } from "@/lib/stats";
import Confetti from "./Confetti";
import { scrollToDonate } from "./Header";
import { IconArrow, IconHeart, IconSparkle, IconTrophy, IconUsers } from "./Icons";

interface Props {
  stats: CampaignStats | null;
}

const AVATAR_COLORS = ["#0E7C7B", "#CF6437", "#C58A12", "#0A5F5E", "#8A5CF6", "#2F80ED"];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "?";
}

function avatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) % 9973;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function timeAgo(iso: string | null): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";

  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short" });
}

function formatDate(iso: string | null): string {
  if (!iso) return "recently";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "recently";
  return date.toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });
}

export default function HelpersWall({ stats }: Props) {
  const helpers = stats?.helperCount ?? 0;
  const recent = stats?.recent ?? [];
  const first = stats?.first ?? null;
  const completer = stats?.completer ?? null;
  const goalReached = stats?.goalReached ?? false;

  return (
    <section id="helpers" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-gold-600">
          The helpers wall
        </p>
        <h2 className="display mt-3 text-4xl sm:text-5xl">
          {helpers > 0 ? (
            <>
              {helpers} {helpers === 1 ? "person has" : "people have"} already{" "}
              <span className="text-teal-700">chosen to help</span>
            </>
          ) : (
            <>
              Be the <span className="text-teal-700">first name</span> on this wall
            </>
          )}
        </h2>
        <p className="mt-4 text-[17px] leading-relaxed text-ink-soft">
          {helpers > 0
            ? "Real people, giving what they can. Every name below chose to back this project."
            : "Nothing here yet — the first contribution gets the spotlight, permanently."}
        </p>
      </div>

      {/* ------------------------------------------------ goal reached moment */}
      {goalReached && (
        <div className="relative mt-10 overflow-hidden rounded-[2rem] bg-ink p-7 text-center text-cream sm:p-12">
          <Confetti duration={6000} />
          <p className="relative text-[13px] font-extrabold uppercase tracking-[0.18em] text-gold">
            We did it
          </p>
          <h3 className="display relative mt-3 text-4xl text-gold sm:text-6xl">
            {Naira.format(stats?.raisedNaira ?? 0)} raised
          </h3>
          <p className="relative mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-cream/80">
            {helpers} {helpers === 1 ? "person" : "people"}, {Naira.format(500)} and{" "}
            {Naira.format(1000)} at a time, got Ruxx Prepaid to its target. Extra gifts are still
            welcome — they push the launch date closer.
          </p>
          <button
            type="button"
            onClick={scrollToDonate}
            className="btn-gold relative mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-extrabold"
          >
            Give a little extra
            <IconArrow className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* --------------------------------------------------- spotlight cards */}
        <div className="space-y-4">
          <div className="card overflow-hidden">
            <div className="bg-gold-100 px-5 py-3.5">
              <p className="flex items-center gap-2 text-[13px] font-extrabold uppercase tracking-wider text-gold-600">
                <IconSparkle className="h-4 w-4" />
                The first to help
              </p>
            </div>
            <div className="p-5">
              {first ? (
                <div className="flex items-center gap-4">
                  <span
                    className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-lg font-extrabold text-white"
                    style={{ background: avatarColor(first.name) }}
                  >
                    {initials(first.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="display truncate text-2xl">{first.name}</p>
                    <p className="text-[14.5px] text-ink-soft">
                      gave <strong className="text-ink">{Naira.format(first.amountNaira)}</strong>{" "}
                      on {formatDate(first.dateISO)}
                    </p>
                    {first.message && (
                      <p className="mt-2 rounded-xl bg-cream-2 px-3 py-2 text-[14px] italic text-ink-soft">
                        “{first.message}”
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border-2 border-dashed border-gold/60 text-gold-600">
                    <IconHeart className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="display text-2xl">Waiting for you</p>
                    <p className="text-[14.5px] leading-snug text-ink-soft">
                      Nobody has contributed yet. Take the spotlight — this card is reserved for
                      your name.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {goalReached && completer && (
            <div className="card overflow-hidden">
              <div className="bg-teal-100 px-5 py-3.5">
                <p className="flex items-center gap-2 text-[13px] font-extrabold uppercase tracking-wider text-teal-700">
                  <IconTrophy className="h-4 w-4" />
                  The one who completed it
                </p>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-4">
                  <span
                    className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-lg font-extrabold text-white"
                    style={{ background: avatarColor(completer.name) }}
                  >
                    {initials(completer.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="display truncate text-2xl">{completer.name}</p>
                    <p className="text-[14.5px] leading-snug text-ink-soft">
                      Their gift of{" "}
                      <strong className="text-ink">{Naira.format(completer.amountNaira)}</strong>{" "}
                      on {formatDate(completer.dateISO)} pushed the campaign past{" "}
                      {Naira.format(campaign.goalNaira)}. 🏆
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl bg-teal-100 p-5 text-center">
              <p className="display text-3xl text-teal-700">{helpers}</p>
              <p className="mt-1 text-[12.5px] font-extrabold uppercase tracking-wide text-teal-700/80">
                helpers
              </p>
            </div>
            <div className="rounded-3xl bg-white p-5 text-center ring-1 ring-ink/5">
              <p className="display text-3xl">{stats?.donationCount ?? 0}</p>
              <p className="mt-1 text-[12.5px] font-extrabold uppercase tracking-wide text-ink-soft">
                contributions
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-ink/5 bg-white p-5">
            <p className="flex items-center gap-2 text-[14px] font-extrabold">
              <IconUsers className="h-4 w-4 text-teal" /> How the count works
            </p>
            <p className="mt-1.5 text-[14px] leading-snug text-ink-soft">
              “People helped” counts each supporter once, straight from Paystack’s successful
              transactions — it can’t be padded or edited by anyone, including me.
            </p>
          </div>
        </div>

        {/* ------------------------------------------------------- recent list */}
        <div className="card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3 border-b border-ink/5 pb-4">
            <h3 className="display text-2xl">Recent helpers</h3>
            <span className="rounded-full bg-gold-100 px-3 py-1 text-[12px] font-extrabold text-gold-600">
              Live
            </span>
          </div>

          {recent.length === 0 ? (
            <div className="py-12 text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-cream-2 text-3xl">
                🌟
              </span>
              <p className="display mt-4 text-2xl">Be the first to help</p>
              <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-ink-soft">
                The wall is empty for now. The first contribution shows up here instantly — with
                the name, the amount and the message.
              </p>
              <button
                type="button"
                onClick={scrollToDonate}
                className="btn-gold mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-extrabold"
              >
                Start it off
                <IconArrow className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-ink/5">
              {recent.map((helper, index) => (
                <li key={helper.reference} className="flex items-start gap-3.5 py-4">
                  <span
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[14px] font-extrabold text-white"
                    style={{ background: avatarColor(helper.name) }}
                  >
                    {initials(helper.name)}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 text-[15.5px] font-extrabold">
                      <span className="truncate">{helper.name}</span>
                      {index === 0 && (
                        <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-gold-600">
                          newest
                        </span>
                      )}
                      {stats?.first?.reference === helper.reference && (
                        <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-teal-700">
                          🌟 first
                        </span>
                      )}
                    </p>

                    {helper.message && (
                      <p className="mt-1 text-[14.5px] leading-snug text-ink-soft">
                        “{helper.message}”
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="display text-lg text-teal-700">
                      {Naira.format(helper.amountNaira)}
                    </p>
                    <p className="text-[12px] font-semibold text-ink-soft">
                      {timeAgo(helper.dateISO)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {recent.length > 0 && (
            <p className="mt-4 border-t border-ink/5 pt-4 text-center text-[13.5px] font-semibold text-ink-soft">
              Showing the most recent {recent.length} helpers · updated live from Paystack
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
