import { NextRequest } from "next/server";
import { campaign } from "@/lib/campaign";
import { assignDedicatedAccount, createPaystackCustomer, dvaAvailable } from "@/lib/paystack";

export const dynamic = "force-dynamic";

interface PayLaterBody {
  name?: string;
  message?: string;
  anonymous?: boolean;
}

/** POST /api/pay-later - assigns a donor their own PERMANENT virtual account
 *  number. Unlike the 30-minute checkout account, it never expires: whenever
 *  they transfer, Paystack records the payment with this metadata attached,
 *  so it counts toward the campaign with their name (or anonymously).
 */
export async function POST(request: NextRequest) {
  let body: PayLaterBody;
  try {
    body = (await request.json()) as PayLaterBody;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Paystack has not activated virtual accounts for this business yet - the
  // client shows a friendly note instead of an error.
  if (!(await dvaAvailable())) {
    return Response.json(
      { error: "Virtual accounts are not activated yet.", code: "dva_unavailable" },
      { status: 503 },
    );
  }

  const name = String(body.name ?? "").trim().slice(0, 60);
  const message = String(body.message ?? "").trim().slice(0, 140);
  const anonymous = Boolean(body.anonymous);

  if (!name) {
    return Response.json(
      { error: "Please tell us your name (or tick 'go anonymous')." },
      { status: 400 },
    );
  }

  const reference = `pl_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  const [firstName, ...rest] = name.split(" ");

  try {
    const customer = await createPaystackCustomer({
      email: `paylater-${reference}@ruxx-prepaid.ng`,
      firstName: firstName || name,
      lastName: rest.join(" ") || "Supporter",
      metadata: { campaign: campaign.id, reference },
    });

    const account = await assignDedicatedAccount({
      customerCode: customer.customer_code,
      metadata: {
        campaign: campaign.id,
        donor_name: name,
        message: message || "",
        anonymous: anonymous ? "true" : "false",
        kind: "pay_later",
        // Makes these visible as columns on the Paystack dashboard.
        custom_fields: [
          { display_name: "Campaign", variable_name: "campaign", value: campaign.id },
          { display_name: "Donor name", variable_name: "donor_name", value: name },
        ],
      },
    });

    return Response.json({
      reference,
      accountNumber: account.account_number,
      bankName: typeof account.bank === "string" ? account.bank : (account.bank?.name ?? ""),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not create your account number.";
    return Response.json({ error: message }, { status: 502 });
  }
}
