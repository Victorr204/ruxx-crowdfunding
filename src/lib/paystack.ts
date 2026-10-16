/* ---------------------------------------------------------------------------
   Thin wrapper around the Paystack REST API.
   The SECRET key is only ever read on the server - never shipped to the browser.
--------------------------------------------------------------------------- */

const API = "https://api.paystack.co";

export interface PaystackMetadata {
  campaign?: string;
  donor_name?: string;
  message?: string;
  anonymous?: boolean | string;
  [key: string]: unknown;
}

export interface PaystackTransaction {
  reference: string;
  amount: number; // in kobo
  status: string;
  currency?: string;
  channel?: string;
  paid_at?: string | null;
  created_at?: string;
  metadata?: PaystackMetadata | null;
  customer?: {
    email?: string;
    first_name?: string | null;
    last_name?: string | null;
  } | null;
}

interface Envelope<T> {
  status: boolean;
  message: string;
  data: T;
}

function authHeaders(): HeadersInit {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not configured on this server.");
  return { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { ...authHeaders(), ...(init?.headers ?? {}) },
    cache: "no-store",
  });

  let json: Envelope<T> | null = null;
  try {
    json = (await res.json()) as Envelope<T>;
  } catch {
    /* non-JSON response */
  }

  if (!res.ok || !json || json.status === false) {
    throw new Error(json?.message || `Paystack request failed (${res.status})`);
  }
  return json.data;
}

/** POST /transaction/initialize - creates a donation and returns a payment URL.
 *  Pass `channels` to restrict the checkout (e.g. ["bank_transfer"] opens the
 *  popup straight on the account-number screen, no method picker). */
export async function initializeTransaction(input: {
  amountKobo: number;
  email: string;
  reference: string;
  metadata: PaystackMetadata;
  callbackUrl: string;
  channels?: string[];
}): Promise<{ authorization_url: string; access_code: string; reference: string }> {
  return request("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      amount: input.amountKobo,
      email: input.email,
      reference: input.reference,
      currency: "NGN",
      callback_url: input.callbackUrl,
      metadata: input.metadata,
      ...(input.channels ? { channels: input.channels } : {}),
    }),
  });
}

/** POST /customer - a Paystack customer (needed to own a virtual account). */
export async function createPaystackCustomer(input: {
  email: string;
  firstName: string;
  lastName: string;
  metadata?: Record<string, unknown>;
}): Promise<{ customer_code: string }> {
  return request("/customer", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      first_name: input.firstName,
      last_name: input.lastName,
      ...(input.metadata ? { metadata: input.metadata } : {}),
    }),
  });
}

/** POST /dedicated_nuban - assigns a PERMANENT virtual account to a customer.
 *  Money sent to it is recorded by Paystack with this metadata attached, so
 *  the campaign stats pick the donor up exactly like a checkout payment. */
export async function assignDedicatedAccount(input: {
  customerCode: string;
  metadata: PaystackMetadata;
}): Promise<{ account_number: string; bank?: { name?: string } | string }> {
  return request("/dedicated_nuban", {
    method: "POST",
    body: JSON.stringify({ customer: input.customerCode, metadata: input.metadata }),
  });
}

/** Cheap cached probe: does this Paystack account have virtual accounts yet?
 *  (Paystack returns 404 for accounts without the feature enabled.) */
let dvaCache: { at: number; ok: boolean } | null = null;
export async function dvaAvailable(): Promise<boolean> {
  if (dvaCache && Date.now() - dvaCache.at < 10 * 60 * 1000) return dvaCache.ok;
  let ok = false;
  try {
    await request("/dedicated_nuban");
    ok = true;
  } catch {
    ok = false;
  }
  dvaCache = { at: Date.now(), ok };
  return ok;
}

/** GET /transaction/verify/:reference - the only proof a donation really happened. */
export async function verifyTransaction(reference: string): Promise<PaystackTransaction> {
  return request(`/transaction/verify/${encodeURIComponent(reference)}`);
}

/** GET /transaction - paginated list of transactions for this account. */
export async function listTransactions(options: {
  page: number;
  perPage: number;
  from: string;
  status?: "success" | "failed" | "pending" | "abandoned";
}): Promise<PaystackTransaction[]> {
  const params = new URLSearchParams({
    page: String(options.page),
    per_page: String(options.perPage),
    from: options.from,
  });
  if (options.status) params.set("status", options.status);
  return request(`/transaction?${params.toString()}`);
}
