import { getStats } from "@/lib/stats";

export const dynamic = "force-dynamic";

/** GET /api/campaign - live fundraising numbers straight from Paystack. */
export async function GET() {
  try {
    const stats = await getStats();
    return Response.json(stats);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load campaign";
    return Response.json({ error: message }, { status: 502 });
  }
}
