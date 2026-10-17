import { campaign } from "@/lib/campaign";
import { IconCheck, IconLock, IconShield } from "./Icons";

export default function Trust() {
  const { commitment, disclaimer, fundraiser } = campaign;

  return (
    <section id="trust" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-10 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="card p-6 sm:p-8">
          <p className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-gold-600">
            My commitment to you
          </p>
          <h2 className="display mt-3 text-3xl sm:text-4xl">
            Trust is the real currency here
          </h2>

          <div className="mt-5 space-y-4 text-[16.5px] leading-relaxed text-ink-soft">
            {commitment.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

          <p className="mt-5 rounded-2xl border border-ink/10 bg-cream-2 p-4 text-[14.5px] leading-relaxed text-ink-soft">
            {disclaimer}
          </p>

          <a
            href={fundraiser.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-teal/25 px-5 py-3 text-[15px] font-extrabold text-teal transition hover:bg-teal-100"
          >
            Questions? Ask {fundraiser.name.split(" ")[0]} on WhatsApp
          </a>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl bg-white p-6 ring-1 ring-ink/5">
            <p className="flex items-center gap-2 text-[15px] font-extrabold">
              <IconShield className="h-5 w-5 text-teal" />
              How to know this campaign is genuine
            </p>
            <ul className="mt-3.5 space-y-3 text-[14px] leading-relaxed text-ink-soft">
              <li>
                <strong className="text-ink">Money goes to Paystack, never a personal account.</strong>{" "}
                Payments are received by Paystack (paystack.com), Nigeria’s payment processor. I
                receive the funds only after Paystack verifies each payment — your bank app will
                show a Paystack account, not an individual’s name.
              </li>
              <li>
                <strong className="text-ink">A real business stands behind it.</strong> This
                campaign belongs to {campaign.business.name} — see{" "}
                <a
                  href={campaign.business.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-teal-700 underline underline-offset-2"
                >
                  {campaign.business.display}
                </a>{" "}
                for our services and official contact details.
              </li>
              <li className="rounded-2xl bg-cream-2 p-3.5">
                <strong className="text-ink">Registered with the Nigerian government.</strong>{" "}
                {campaign.business.cac.registeredName} —{" "}
                <a
                  href={campaign.business.cac.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-extrabold text-teal-700 underline underline-offset-2"
                >
                  RC {campaign.business.cac.rc}
                </a>{" "}
                is registered with the Corporate Affairs Commission (CAC). Tap the RC number to
                verify the company yourself on the official CAC portal — it will show the
                registration as valid.
              </li>
              <li>
                <strong className="text-ink">Talk to the founder before you give.</strong> WhatsApp{" "}
                {fundraiser.whatsappDisplay} — the same number published on our website — and I
                will answer any question personally.
              </li>
            </ul>
          </div>

          <div className="rounded-3xl bg-ink p-6 text-cream">
            <p className="flex items-center gap-2 text-[13px] font-extrabold uppercase tracking-wider text-gold">
              <IconShield className="h-4 w-4" />
              Where your money goes
            </p>
            <ul className="mt-4 space-y-3 text-[15px] text-cream/85">
              {campaign.fundingAreas.map((area) => (
                <li key={area.step} className="flex items-start gap-2.5">
                  <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>{area.title}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-6 ring-1 ring-ink/5">
            <p className="flex items-center gap-2 text-[15px] font-extrabold">
              <IconLock className="h-5 w-5 text-teal" />
              Safe, every time
            </p>
            <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft">
              Payments are handled entirely by Paystack. Card details never touch this website —
              I only ever see the amount, your name and your message.
            </p>
            <p className="mt-3 text-[13.5px] font-bold text-ink-soft">
              Live transactions are checked against Paystack before they are counted.
            </p>
          </div>

          <a
            href={campaign.business.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-3xl bg-white p-6 ring-1 ring-ink/5 transition hover:ring-gold/50"
          >
            <p className="text-[15px] font-extrabold">See the business behind the campaign</p>
            <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft">
              {campaign.business.name} has its own website — browse the services offered and find
              the official contact details.
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-[13.5px] font-extrabold text-teal-700">
              {campaign.business.name} →
            </p>
          </a>
        </div>
      </div>
    </section>
  );
}
