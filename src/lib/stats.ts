/* ---------------------------------------------------------------------------
   Campaign statistics.

   Paystack is the single source of truth - there is no database.
   Every successful donation carries metadata.campaign === campaign.id, so we
   can pull the transaction list from Paystack and derive:
     - total raised
     - how many people helped
     - who was FIRST to help
     - who COMPLETED the goal (the donation that crossed the target)
     - the recent helpers feed
--------------------------------------------------------------------------- */

import { campaign } from "./campaign";
import { listTransactions, type PaystackTransaction } from "./paystack";

export interface Helper {
  reference: string;
  name: string;
  anonymous: boolean;
  message: string;
  amountNaira: number;
  dateISO: string | null;
}

export interface CampaignStats {
  goalNaira: number;
  raisedNaira: number;
  remainingNaira: number;
  percent: number;
  helperCount: number; // unique supporters
  donationCount: number; // successful payments
  goalReached: boolean;
  first: Helper | null;
  completer: Helper | null;
  recent: Helper[];
  updatedAt: number;
}

const TTL_MS = 30_000;
const MAX_PAGES = 10;
const PER_PAGE = 100;

let cache: { at: number; data: CampaignStats } | null = null;

export function clearStatsCache(): void {
  cache = null;
}

export async function getStats(): Promise<CampaignStats> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.data;

  const transactions = await fetchCampaignTransactions();
  const data = computeStats(transactions);
  cache = { at: Date.now(), data };
  return data;
}

/* -------------------------------------------------------------------------- */
/* fetching                                                                    */
/* -------------------------------------------------------------------------- */

async function fetchCampaignTransactions(): Promise<PaystackTransaction[]> {
  const from = new Date(campaign.startedAt).toISOString().slice(0, 10);
  const tagged: PaystackTransaction[] = [];
  let untaggedSuccessful = 0;

  for (let page = 1; page <= MAX_PAGES; page++) {
    let batch: PaystackTransaction[];
    try {
      batch = await listTransactions({ page, perPage: PER_PAGE, from, status: "success" });
    } catch (error) {
      // First page failing means we cannot talk to Paystack at all.
      if (page === 1) throw error;
      break;
    }

    for (const tx of batch) {
      if (tx.status !== "success") continue;
      if (tx.metadata?.campaign === campaign.id) tagged.push(tx);
      else untaggedSuccessful += 1;
    }

    if (batch.length < PER_PAGE) break;
  }

  // Only donations carrying our campaign tag are ever counted. Anything else on
  // the Paystack account (other business income, refunds, unrelated payments)
  // must never inflate the goal.
  if (untaggedSuccessful > 0) {
    console.warn(
      `[stats] ${untaggedSuccessful} successful transaction(s) since ${from} are not tagged ` +
        `with campaign "${campaign.id}" - ignored on purpose.`,
    );
  }

  return tagged;
}

/* -------------------------------------------------------------------------- */
/* derivation                                                                  */
/* -------------------------------------------------------------------------- */

function toHelper(tx: PaystackTransaction): Helper {
  const meta = tx.metadata ?? {};
  const anonymous = String(meta.anonymous ?? "false") === "true";
  const providedName = typeof meta.donor_name === "string" ? meta.donor_name.trim() : "";
  const fromCustomer =
    tx.customer?.first_name || tx.customer?.last_name
      ? `${tx.customer?.first_name ?? ""} ${tx.customer?.last_name ?? ""}`.trim()
      : "";

  return {
    reference: tx.reference,
    name: anonymous ? "A kind friend" : providedName || fromCustomer || "A kind friend",
    anonymous,
    message: typeof meta.message === "string" ? meta.message.trim() : "",
    amountNaira: Math.round(tx.amount / 100),
    dateISO: tx.paid_at || tx.created_at || null,
  };
}

function computeStats(transactions: PaystackTransaction[]): CampaignStats {
  const goal = campaign.goalNaira;

  const chronological = [...transactions].sort(
    (a, b) =>
      new Date(a.paid_at || a.created_at || 0).getTime() -
      new Date(b.paid_at || b.created_at || 0).getTime(),
  );

  let raisedKobo = 0;
  let completer: Helper | null = null;

  for (const tx of chronological) {
    raisedKobo += tx.amount;
    if (!completer && raisedKobo >= goal * 100) completer = toHelper(tx);
  }

  const raisedNaira = Math.round(raisedKobo / 100);

  // Count each person once: by email when we have one, otherwise by reference
  // (Paystack generates a unique reference per payment).
  const donors = new Set<string>();
  for (const tx of chronological) {
    const email = tx.customer?.email?.toLowerCase();
    donors.add(email || `ref:${tx.reference}`);
  }

  const recent = [...chronological]
    .reverse()
    .slice(0, 12)
    .map(toHelper);

  return {
    goalNaira: goal,
    raisedNaira,
    remainingNaira: Math.max(0, goal - raisedNaira),
    percent: goal > 0 ? Math.round((raisedNaira / goal) * 100) : 0,
    helperCount: donors.size,
    donationCount: chronological.length,
    goalReached: raisedNaira >= goal,
    first: chronological.length ? toHelper(chronological[0]) : null,
    completer,
    recent,
    updatedAt: Date.now(),
  };
}
