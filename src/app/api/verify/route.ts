import { NextRequest } from "next/server";
import { campaign } from "@/lib/campaign";
import { verifyTransaction } from "@/lib/paystack";
import { clearStatsCache } from "@/lib/stats";

export const dynamic = "force-dynamic";

/** GET /api/verify?reference=... - confirms a donation actually settled. */
export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get("reference");
  if (!reference) {
    return Response.json({ verified: false, error: "Missing reference." }, { status: 400 });
  }

  try {
    const transaction = await verifyTransaction(reference);

    const isOurs = transaction.metadata?.campaign === campaign.id;
    const settled = transaction.status === "success";

    if (!isOurs || !settled) {
      return Response.json(
        { verified: false, error: "This payment has not completed yet." },
        { status: 402 },
      );
    }

    // Donation is real - refresh the campaign numbers straight away.
    clearStatsCache();

    return Response.json({
      verified: true,
      amountNaira: Math.round(transaction.amount / 100),
      donorName: transaction.metadata?.donor_name ?? "",
      anonymous: String(transaction.metadata?.anonymous ?? "false") === "true",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to verify this payment.";
    return Response.json({ verified: false, error: message }, { status: 502 });
  }
}
