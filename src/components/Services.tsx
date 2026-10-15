import { campaign } from "@/lib/campaign";
import { serviceIcons } from "./Icons";

export default function Services() {
  return (
    <section id="services" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-gold-600">
          What is Ruxx Digital Services?
        </p>
        <h2 className="display mt-3 text-4xl sm:text-5xl">
          Everything you pay for, <span className="text-teal-700">in one place</span>
        </h2>
        <p className="mt-4 text-[17px] leading-relaxed text-ink-soft">
          Ruxx is a Value-Added Services platform and digital reseller focused on convenient,
          automated utility management solutions for Nigerians.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {campaign.services.map((service) => {
          const Icon = serviceIcons[service.icon as keyof typeof serviceIcons];
          return (
            <article
              key={service.title}
              className="card group p-6 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-100 text-teal-700 transition group-hover:bg-teal group-hover:text-white">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="display mt-4 text-xl">{service.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{service.body}</p>
            </article>
          );
        })}

        <article className="flex flex-col justify-between rounded-3xl bg-ink p-6 text-cream">
          <div>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold text-ink">
              <span className="text-xl">₦</span>
            </span>
            <h3 className="display mt-4 text-xl text-gold">Built to save you time</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-cream/75">
              A straightforward digital experience that makes everyday transactions simpler —
              instead of more complicated.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
