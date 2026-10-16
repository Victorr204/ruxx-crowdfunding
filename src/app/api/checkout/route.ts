import { NextRequest } from "next/server";
import { campaign, siteUrl } from "@/lib/campaign";
import { initializeTransaction } from "@/lib/paystack";

export const dynamic = "force-dynamic";

interface CheckoutBody {
  amount?: number;
  name?: string;
  email?: string;
  message?: string;
  anonymous?: boolean;
  /** "transfer" restricts the checkout to bank transfer only, so the popup
   *  opens straight on the account number. */
  channel?: string;
}

/** POST /api/checkout - creates a Paystack transaction for one donation. */
export async function POST(request: NextRequest) {
  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const amount = Number(body.amount);
  const name = String(body.name ?? "").trim().slice(0, 60);
  const email = String(body.email ?? "").trim().slice(0, 120);
  const message = String(body.message ?? "").trim().slice(0, 140);
  const anonymous = Boolean(body.anonymous);

  if (!Number.isInteger(amount) || amount < campaign.minNaira || amount > campaign.maxNaira) {
    return Response.json(
      { error: `Please choose an amount between ₦${campaign.minNaira.toLocaleString()} and ₦${campaign.maxNaira.toLocaleString()}.` },
      { status: 400 },
    );
  }

  if (!name) {
    return Response.json({ error: "Please tell us your name (or tick 'go anonymous')." }, { status: 400 });
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "That email address does not look right." }, { status: 400 });
  }

  const reference = `rx_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

  // Paystack requires an email for every transaction. If the donor did not give
  // one we generate a unique placeholder so the donation still processes.
  const payerEmail = email || `donor-${reference}@ruxx-prepaid.ng`;

  try {
    // Paystack sends the supporter back here after paying. Use the domain the
    // request actually came from (never localhost once the site is live),
    // falling back to the configured site URL.
    const origin = request.headers.get("origin")?.replace(/\/+$/, "") || siteUrl();

    const transaction = await initializeTransaction({
      amountKobo: amount * 100,
      email: payerEmail,
      reference,
      channels: body.channel === "transfer" ? ["bank_transfer"] : undefined,
      metadata: {
        campaign: campaign.id,
        donor_name: name,
        message: message || "",
        anonymous: anonymous ? "true" : "false",
        email_provided: email ? "true" : "false",
        // Makes these visible as columns on the Paystack dashboard.
        custom_fields: [
          { display_name: "Campaign", variable_name: "campaign", value: campaign.id },
          { display_name: "Donor name", variable_name: "donor_name", value: name },
          { display_name: "Supporter message", variable_name: "message", value: message || "-" },
        ],
      },
      callbackUrl: `${origin}/?reference={reference}`,
    });

    return Response.json({
      reference,
      amount,
      accessCode: transaction.access_code,
      publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "",
      authorizationUrl: transaction.authorization_url,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not start the payment.";
    return Response.json({ error: message }, { status: 502 });
  }
}
