"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { campaign, Naira } from "@/lib/campaign";
import { IconArrow, IconGift, IconLock, IconSparkle } from "./Icons";

export interface DonationConfirmation {
  amountNaira: number;
  name: string;
}

interface Props {
  onDone: (confirmation: DonationConfirmation) => void;
  /** Rendered only when Paystack virtual accounts are enabled for the account. */
  payLaterAvailable?: boolean;
}

type Selection = number | "custom";

export default function GiveForm({ onDone, payLaterAvailable = false }: Props) {
  const [selection, setSelection] = useState<Selection>(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transferExpiresAt, setTransferExpiresAt] = useState<number | null>(null);
  const [tick, setTick] = useState(() => Date.now());
  const [payLaterBusy, setPayLaterBusy] = useState(false);
  const [payLaterDone, setPayLaterDone] = useState<{
    accountNumber: string;
    bankName: string;
  } | null>(null);

  const amount = useMemo(() => {
    if (selection === "custom") {
      const value = Number(customAmount.replace(/[^\d]/g, ""));
      return Number.isFinite(value) ? value : 0;
    }
    return selection;
  }, [selection, customAmount]);

  const valid =
    amount >= campaign.minNaira &&
    amount <= campaign.maxNaira &&
    (name.trim().length > 0 || anonymous);

  // Live countdown for the one-time transfer account (30 minutes from opening).
  useEffect(() => {
    if (!transferExpiresAt) return;
    const id = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, [transferExpiresAt]);

  const transferSecondsLeft = transferExpiresAt
    ? Math.max(0, Math.ceil((transferExpiresAt - tick) / 1000))
    : null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    await startPayment();
  }

  /** Starts a Paystack checkout. `channel === "transfer"` restricts the popup
   *  to bank transfer only, so it opens directly on the account number. */
  async function startPayment(channel?: "transfer") {
    if (busy) return;

    setError(null);

    if (amount < campaign.minNaira) {
      setError(`The smallest contribution is ${Naira.format(campaign.minNaira)}.`);
      return;
    }
    if (!name.trim() && !anonymous) {
      setError("Please add your name — or tick “go anonymous”.");
      return;
    }

    setBusy(true);
    if (channel === "transfer") {
      // The one-time account lives for 30 minutes - the countdown on the page
      // starts the moment we ask Paystack for it.
      setTick(Date.now());
      setTransferExpiresAt(Date.now() + 30 * 60 * 1000);
    }

    const donorName = name.trim() || "A kind friend";

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          name: donorName,
          email: email.trim(),
          message: message.trim(),
          anonymous,
          channel,
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        accessCode?: string;
        authorizationUrl?: string;
        reference?: string;
      };

      const { accessCode, authorizationUrl, reference } = data;

      if (!response.ok || !accessCode) {
        throw new Error(data.error || "We could not start the payment. Please try again.");
      }

      await openCheckout({ accessCode, authorizationUrl, reference }, donorName);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  /** Opens the Paystack checkout, then confirms the payment server-side. */
  async function openCheckout(
    data: { accessCode: string; authorizationUrl?: string; reference?: string },
    donorName: string,
  ) {
    const { default: PaystackPop } = await import("@paystack/inline-js");
    const popup = new PaystackPop();

    let settled = false;
    let loaded = false;
    let fallback: ReturnType<typeof setTimeout> | undefined;

    const confirm = async (reference: string) => {
      if (settled) return;
      settled = true;
      if (fallback) clearTimeout(fallback);

      try {
        const verifyResponse = await fetch(
          `/api/verify?reference=${encodeURIComponent(reference)}`,
        );
        const verified = (await verifyResponse.json()) as {
          verified: boolean;
          amountNaira?: number;
          donorName?: string;
          error?: string;
        };

        if (!verified.verified) {
          throw new Error(verified.error || "The payment has not settled yet. Please refresh in a moment.");
        }

        onDone({
          amountNaira: verified.amountNaira ?? amount,
          name: verified.donorName || donorName,
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Your payment went through but we could not confirm it yet.",
        );
      } finally {
        setBusy(false);
      }
    };

    try {
      popup.resumeTransaction(data.accessCode, {
        onSuccess: (transaction) => confirm(transaction.reference),
        onLoad: () => {
          // The checkout is on screen - no need for the hosted-page fallback.
          loaded = true;
          if (fallback) clearTimeout(fallback);
        },
        onCancel: () => {
          if (settled) return;
          if (fallback) clearTimeout(fallback);
          setBusy(false);
          setError("No charge was made — you can try again whenever you’re ready.");
        },
        onError: (err) => {
          if (settled) return;
          if (fallback) clearTimeout(fallback);
          setBusy(false);
          setError(err.message || "The checkout could not open. Please try again.");
        },
      });

      // If the popup never even appears (blocked, old browser), send the
      // supporter to Paystack's hosted checkout instead. It only fires when
      // there is no checkout iframe on screen, so it can never interrupt a
      // payment that is already in progress.
      fallback = setTimeout(() => {
        try {
          const iframeVisible = Boolean(document.querySelector("iframe"));
          if (!settled && !loaded && !iframeVisible && data.authorizationUrl) {
            window.location.href = data.authorizationUrl;
          }
        } catch {
          /* never let the fallback break the page */
        }
      }, 9000);
    } catch {
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      } else {
        setBusy(false);
        setError("The checkout could not open in this browser.");
      }
    }
  }

  /** "Pay later": assigns the donor their own PERMANENT virtual account. */
  async function handlePayLater() {
    if (payLaterBusy) return;
    setError(null);

    if (!name.trim() && !anonymous) {
      setError("Please add your name — or tick “go anonymous”.");
      return;
    }

    setPayLaterBusy(true);
    try {
      const response = await fetch("/api/pay-later", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "A kind friend",
          message: message.trim(),
          anonymous,
        }),
      });
      const data = (await response.json()) as {
        error?: string;
        accountNumber?: string;
        bankName?: string;
      };
      if (!response.ok || !data.accountNumber) {
        throw new Error(data.error || "We could not create your account number. Please try again.");
      }
      setPayLaterDone({
        accountNumber: data.accountNumber,
        bankName: data.bankName || "Partner bank",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setPayLaterBusy(false);
    }
  }

  return (
    <section id="donate" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 sm:px-6 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
        {/* ------------------------------------------------- explanation */}
        <div>
          <p className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-gold-600">
            Ways to give
          </p>
          <h2 className="display mt-3 text-4xl sm:text-5xl">
            Give whatever you <span className="text-teal-700">can comfortably afford</span>
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-ink-soft">
            These are suggested contribution levels, not fixed prices. You are welcome to give any
            amount — every single one moves the bar.
          </p>

          <ul className="mt-7 space-y-3">
            {campaign.tiers.map((tier) => (
              <li
                key={tier.amount}
                className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-ink/5"
              >
                <span className="mt-0.5 grid h-8 min-w-[62px] shrink-0 place-items-center rounded-xl bg-gold-100 px-2 text-[13px] font-extrabold text-gold-600">
                  {Naira.format(tier.amount)}
                </span>
                <span>
                  <strong className="block text-[15px] font-extrabold text-ink">
                    {tier.label}
                  </strong>
                  <span className="mt-1.5 block text-[14.5px] leading-relaxed text-ink-soft">
                    {tier.blurb}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-5 flex items-start gap-2.5 rounded-2xl bg-teal-100 p-4 text-[14.5px] leading-snug text-teal-700">
            <IconSparkle className="mt-0.5 h-5 w-5 shrink-0" />
            <span>
              <strong>₦25,000 or more</strong> makes you a launch supporter with a major
              contribution — but ₦500 gets exactly the same thank-you from me.
            </span>
          </p>
        </div>

        {/* ------------------------------------------------------- the form */}
        <form
          id="amounts"
          onSubmit={handleSubmit}
          className="card scroll-mt-24 p-5 sm:p-7"
          aria-label="Contribution form"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="display text-2xl">Choose your amount</h3>
            <span className="rounded-full bg-teal-100 px-3 py-1 text-[12px] font-extrabold text-teal-700">
              Step 1 of 2
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {campaign.tiers.map((tier) => {
              const active = selection === tier.amount;
              return (
                <button
                  key={tier.amount}
                  type="button"
                  onClick={() => setSelection(tier.amount)}
                  aria-pressed={active}
                  className={`rounded-2xl border-2 px-3 py-3 text-left transition ${
                    active
                      ? "border-gold bg-gold-100 shadow-sm"
                      : "border-ink/10 bg-white hover:border-gold/50"
                  }`}
                >
                  <span className="display block text-xl">{Naira.format(tier.amount)}</span>
                  <span className="mt-0.5 block text-[11.5px] font-semibold leading-tight text-ink-soft">
                    {tier.label}
                  </span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setSelection("custom")}
              aria-pressed={selection === "custom"}
              className={`rounded-2xl border-2 px-3 py-3 text-left transition ${
                selection === "custom"
                  ? "border-gold bg-gold-100 shadow-sm"
                  : "border-ink/10 bg-white hover:border-gold/50"
              }`}
            >
              <span className="display block text-xl">₦25,000+</span>
              <span className="mt-0.5 block text-[11.5px] font-semibold leading-tight text-ink-soft">
                Or type your own amount
              </span>
            </button>
          </div>

          {selection === "custom" && (
            <div className="mt-4 rounded-2xl bg-cream-2 p-4">
              <label htmlFor="amount" className="text-[13.5px] font-extrabold text-ink">
                Your amount ({campaign.currency})
              </label>
              <div className="mt-2 flex items-center gap-2 rounded-2xl border-2 border-ink/10 bg-white px-4">
                <span className="display text-2xl text-ink-soft">₦</span>
                <input
                  id="amount"
                  inputMode="numeric"
                  autoComplete="off"
                  value={customAmount}
                  onChange={(event) => setCustomAmount(event.target.value.replace(/[^\d]/g, ""))}
                  placeholder="25000"
                  className="display w-full bg-transparent py-3 text-2xl outline-none placeholder:text-ink-soft/40"
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {campaign.customPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setCustomAmount(String(preset))}
                    className="rounded-full border border-ink/10 bg-white px-3.5 py-1.5 text-[13px] font-bold text-ink-soft transition hover:border-gold hover:text-ink"
                  >
                    {Naira.format(preset)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 border-t border-ink/5 pt-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="display text-2xl">Your details</h3>
              <span className="rounded-full bg-teal-100 px-3 py-1 text-[12px] font-extrabold whitespace-nowrap text-teal-700">
                Step 2 of 2
              </span>
            </div>

            <div className="mt-4 space-y-3.5">
              <div>
                <label htmlFor="name" className="text-[13.5px] font-extrabold text-ink">
                  Your name
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Amaka Obi"
                  maxLength={60}
                  autoComplete="name"
                  className="mt-1.5 w-full rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-[16px] outline-none transition focus:border-teal"
                />
              </div>

              <div>
                <label htmlFor="email" className="text-[13.5px] font-extrabold text-ink">
                  Email <span className="font-semibold text-ink-soft">— optional, for your receipt</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="mt-1.5 w-full rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-[16px] outline-none transition focus:border-teal"
                />
              </div>

              <div>
                <label htmlFor="message" className="text-[13.5px] font-extrabold text-ink">
                  A short message <span className="font-semibold text-ink-soft">— optional</span>
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value.slice(0, 140))}
                  placeholder="Wishing you luck on the launch…"
                  rows={2}
                  maxLength={140}
                  className="mt-1.5 w-full resize-none rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-[16px] outline-none transition focus:border-teal"
                />
                <p className="mt-1 text-right text-[12px] font-semibold text-ink-soft">
                  {message.length}/140
                </p>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-cream-2 p-3.5">
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={(event) => setAnonymous(event.target.checked)}
                  className="mt-1.5 h-[22px] w-[22px] shrink-0 accent-teal"
                />
                <span>
                  <span className="block text-[14.5px] font-extrabold text-ink">Go anonymous</span>
                  <span className="block text-[13.5px] leading-snug text-ink-soft">
                    Show my contribution as “A kind friend” on the helpers wall.
                  </span>
                </span>
              </label>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-2xl border border-clay/30 bg-clay/10 px-4 py-3 text-[14.5px] font-semibold text-clay"
            >
              {error}
            </p>
          )}

          <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
            <button
              type="submit"
              disabled={busy || !valid}
              className="btn-gold flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-[17px] font-extrabold disabled:cursor-not-allowed disabled:opacity-55"
            >
              {busy ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
                  Opening Paystack…
                </>
              ) : amount >= campaign.minNaira ? (
                <>
                  <IconGift className="h-5 w-5" />
                  Donate {Naira.format(amount)}
                  <IconArrow className="h-5 w-5" />
                </>
              ) : (
                <>
                  <IconGift className="h-5 w-5" />
                  Choose an amount
                </>
              )}
            </button>

            <button
              type="button"
              disabled={busy || !valid}
              onClick={() => startPayment("transfer")}
              className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-teal/30 bg-teal-100 px-6 py-4 text-[16px] font-extrabold text-teal-700 transition hover:bg-teal hover:text-white disabled:cursor-not-allowed disabled:opacity-55"
            >
              Open account number — bank transfer
            </button>
          </div>

          {/* ------------------------------------- transfer expiry warning */}
          <div className="mt-4 rounded-2xl border border-gold/30 bg-gold-100/70 p-4">
            <p className="text-[13.5px] font-extrabold text-gold-600">
              Transfer accounts expire after 30 minutes
            </p>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">
              The one-time account number only works for{" "}
              <strong className="text-ink">30 minutes</strong>. Send your transfer immediately —{" "}
              <strong className="text-ink">do not copy the number to pay later</strong>, because an
              expired account cannot receive your money.
            </p>

            {transferSecondsLeft !== null &&
              (transferSecondsLeft > 0 ? (
                <p className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 text-[13.5px] font-extrabold text-ink">
                  <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-clay" />
                  Your account number expires in
                  <span className="tabular-nums text-clay">
                    {String(Math.floor(transferSecondsLeft / 60)).padStart(2, "0")}:
                    {String(transferSecondsLeft % 60).padStart(2, "0")}
                  </span>
                  — complete the transfer now
                </p>
              ) : (
                <p className="mt-3 rounded-xl bg-white px-3.5 py-2.5 text-[13.5px] font-extrabold text-clay">
                  That account number has expired. Tap “Open account number” again for a fresh one.
                </p>
              ))}
          </div>

          <p className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-center text-[13px] font-semibold text-ink-soft">
            <IconLock className="h-4 w-4 text-teal" />
            Card, transfer &amp; USSD on Paystack’s secure page
          </p>

          {/* --------------------------------------- pay later (virtual acct) */}
          {payLaterAvailable && !payLaterDone && (
            <div className="mt-4 rounded-2xl border-2 border-dashed border-teal/30 p-4">
              <p className="text-[14.5px] font-extrabold text-ink">
                Prefer to pay later? Get your own account number
              </p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-ink-soft">
                A <strong className="text-ink">permanent</strong> account number, just for you —
                transfer any amount, anytime, with no 30-minute limit. It is detected automatically
                and shows your name on the helpers wall (or “A kind friend” if anonymous is ticked
                above).
              </p>
              <button
                type="button"
                onClick={handlePayLater}
                disabled={payLaterBusy}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-teal px-5 py-3 text-[14.5px] font-extrabold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-55"
              >
                {payLaterBusy ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Creating your account…
                  </>
                ) : (
                  <>Get my account number</>
                )}
              </button>
            </div>
          )}

          {payLaterDone && (
            <div className="mt-4 rounded-2xl bg-teal-100 p-4">
              <p className="text-[12.5px] font-extrabold uppercase tracking-wider text-teal-700">
                Your permanent account number
              </p>
              <div className="mt-1.5 flex items-center justify-between gap-3">
                <p className="display text-3xl tracking-wide text-ink">
                  {payLaterDone.accountNumber}
                </p>
                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(payLaterDone.accountNumber)}
                  className="rounded-full bg-white px-3.5 py-1.5 text-[12.5px] font-extrabold text-teal-700 transition hover:bg-teal-700 hover:text-white"
                >
                  Copy
                </button>
              </div>
              <p className="mt-1 text-[13.5px] font-bold text-teal-700">{payLaterDone.bankName}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-teal-700/90">
                Transfer any amount, anytime — it is counted and shown on the helpers wall
                automatically.
              </p>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
