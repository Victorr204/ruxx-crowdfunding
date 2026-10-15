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

/** POST /transaction/initialize - creates a donation and returns a payment URL. */
export async function initializeTransaction(input: {
  amountKobo: number;
  email: string;
  reference: string;
  metadata: PaystackMetadata;
  callbackUrl: string;
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
    }),
  });
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
