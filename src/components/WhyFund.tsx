import { campaign, Naira } from "@/lib/campaign";

/** These multiply out to the goal — people counts derive from it, so they
 *  always stay correct if the target ever changes. */
const combinations = [
  {
    people: campaign.goalNaira / 1000,
    amount: 1000,
    note: "the classic — a small gift from many hands",
  },
  { people: campaign.goalNaira / 5000, amount: 5000, note: "fewer people, bigger strides" },
  {
    people: campaign.goalNaira / 500,
    amount: 500,
    note: "if you can only give ₦500, it still counts",
  },
];

export default function WhyFund() {
  return (
    <section id="why" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-gold-600">
          Why I’m raising {Naira.format(campaign.goalNaira)}
        </p>
        <h2 className="display mt-3 text-4xl sm:text-5xl">
          Three things stand between the app and <span className="text-teal-700">the launch</span>
        </h2>
        <p className="mt-4 text-[17px] leading-relaxed text-ink-soft">
          The funds support the remaining work required to prepare Ruxx Prepaid for publication.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {campaign.fundingAreas.map((area) => (
          <article key={area.step} className="card relative overflow-hidden p-6 pt-8">
            <span className="display absolute right-5 top-3 text-6xl leading-none text-gold/15">
              {area.step}
            </span>
            <p className="text-[13px] font-extrabold uppercase tracking-wider text-teal-700">
              Area {area.step}
            </p>
            <h3 className="display mt-2 text-2xl">{area.title}</h3>
            <p className="mt-3 text-[15.5px] leading-relaxed text-ink-soft">{area.body}</p>
          </article>
        ))}
      </div>

      <p className="mx-auto mt-6 max-w-3xl rounded-3xl bg-white p-6 text-center text-[15.5px] leading-relaxed text-ink-soft">
        {campaign.fundingNote}
      </p>

      {/* -------------------------------------------------- milestone maths */}
      <div className="mt-14 rounded-[2rem] bg-teal-100 p-6 sm:p-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-teal-700">
            Every contribution makes a difference
          </p>
          <h3 className="display mt-3 text-3xl sm:text-4xl">
            You don’t need to be wealthy to back an idea
          </h3>
          <p className="mt-3 text-[16px] leading-relaxed text-teal-700">
            Sometimes the combined generosity of many people accomplishes what one person cannot
            do alone. Here is how the goal gets reached:
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {combinations.map((combo) => (
            <div key={combo.amount} className="rounded-3xl bg-white p-6 text-center shadow-sm">
              <p className="display text-4xl text-ink">{combo.people.toLocaleString("en-NG")}</p>
              <p className="mt-1 text-[13px] font-extrabold uppercase tracking-wider text-ink-soft">
                people × {Naira.format(combo.amount)}
              </p>
              <p className="mt-3 text-[14.5px] leading-snug text-ink-soft">{combo.note}</p>
              <p className="mt-3 rounded-full bg-gold-100 px-3 py-1.5 text-[13px] font-extrabold text-gold-600">
                = {Naira.format(campaign.goalNaira)} 🎯
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
