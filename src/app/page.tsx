import Landing from "@/components/Landing";
import { getStats } from "@/lib/stats";
import type { CampaignStats } from "@/lib/stats";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let initial: CampaignStats | null = null;

  try {
    initial = await getStats();
  } catch {
    // Paystack unreachable (or keys missing) - the client will keep retrying
    // and the page still renders with its zero state.
    initial = null;
  }

  return <Landing initial={initial} />;
}
