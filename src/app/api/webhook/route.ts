import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest } from "next/server";
import { clearStatsCache } from "@/lib/stats";

export const dynamic = "force-dynamic";

/**
 * POST /api/webhook - Paystack tells us the moment money lands so the counter
 * on the page updates instantly. Protected by the x-paystack-signature header.
 *
 * Add this URL in Paystack: Dashboard > Settings > Webhooks
 *   https://<your-domain>/api/webhook
 */
export async function POST(request: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const signature = request.headers.get("x-paystack-signature");

  if (!secret || !signature) {
    return Response.json({ error: "Not authorised." }, { status: 401 });
  }

  try {
    const raw = await request.text();
    const expected = createHmac("sha512", secret).update(raw).digest("hex");

    const provided = Buffer.from(signature, "utf8");
    const computed = Buffer.from(expected, "utf8");
    const valid = provided.length === computed.length && timingSafeEqual(provided, computed);

    if (!valid) {
      return Response.json({ error: "Invalid signature." }, { status: 401 });
    }

    // Paystack signs every genuine event (charge.success, dedicated_nuban.success,
    // refunds...) with this same signature. The safest reaction to ANY signed
    // event is simply dropping our stats cache: the next page load re-counts
    // straight from Paystack, so nothing a signed event sends can fake a
    // donation - it can only make updates appear instantly.
    clearStatsCache();
    return Response.json({ received: true });
  } catch {
    return Response.json({ received: true });
  }
}
