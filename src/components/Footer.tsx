import Image from "next/image";
import { campaign, Naira } from "@/lib/campaign";
import { IconShield, IconWhatsApp } from "./Icons";

export default function Footer() {
  const { fundraiser, images, goalNaira, business } = campaign;
  const year = new Date().getFullYear();

  return (
    <footer className="mt-6 border-t border-ink/5 bg-white/70">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {/* -------------------------------------------------------- sign-off */}
        <div className="rounded-[2rem] bg-cream-2 p-6 text-center sm:p-10">
          <p className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-gold-600">
            Thank you for reading my story
          </p>

          <p className="display mx-auto mt-4 max-w-2xl text-2xl leading-snug sm:text-3xl">
            If you believe in supporting ideas, encouraging founders and helping promising projects
            get off the ground, I’d be grateful to have you on this journey.
          </p>

          <p className="mt-6 text-[15px] text-ink-soft">With gratitude,</p>
          <div className="mt-3 flex items-center justify-center gap-3">
            <Image
              src={fundraiser.avatar}
              alt={fundraiser.name}
              width={530}
              height={470}
              sizes="48px"
              className="h-12 w-12 rounded-full object-cover ring-2 ring-gold/50"
            />
            <div className="text-left">
              <p className="text-[16px] font-extrabold leading-tight">{fundraiser.name}</p>
              <p className="text-[13.5px] text-ink-soft">{fundraiser.role}</p>
            </div>
          </div>

          <p className="mt-6 display text-xl text-teal-700">
            My goal is {Naira.format(goalNaira)}. Your support can help me get there.
          </p>
        </div>

        {/* ---------------------------------------------------------- contact */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <a
            href={fundraiser.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-3xl bg-teal p-5 text-white transition hover:bg-teal-700 sm:col-span-2"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/15">
              <IconWhatsApp className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-[13px] font-bold uppercase tracking-wider text-white/70">
                Questions or enquiries
              </span>
              <span className="block text-[17px] font-extrabold">
                WhatsApp {fundraiser.whatsappDisplay}
              </span>
            </span>
          </a>

          <div className="flex items-center gap-3 rounded-3xl bg-ink p-5 text-cream">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold text-ink">
              <IconShield className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-[13px] font-bold uppercase tracking-wider text-cream/60">
                Payments
              </span>
              <span className="block text-[16px] font-extrabold">Secured by Paystack</span>
            </span>
          </div>

          <a
            href={business.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-3xl bg-gold-100 p-5 transition hover:bg-white sm:col-span-3"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white ring-1 ring-ink/10">
              <Image
                src={images.logo}
                alt="Ruxx Digital Services logo"
                width={475}
                height={525}
                sizes="44px"
                className="h-full w-full object-cover"
              />
            </span>
            <span>
              <span className="block text-[13px] font-bold uppercase tracking-wider text-ink-soft">
                The business behind the campaign
              </span>
              <span className="block text-[17px] font-extrabold">{business.name}</span>
            </span>
            <span aria-hidden className="ml-auto pr-1 text-2xl text-gold-600">
              →
            </span>
          </a>
        </div>

        {/* ----------------------------------------------------------- bottom */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-ink/10 pt-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-white ring-1 ring-ink/10">
              <Image
                src={images.logo}
                alt="Ruxx logo"
                width={475}
                height={525}
                sizes="40px"
                className="h-full w-full object-cover"
              />
            </span>
            <span className="text-[13.5px] text-ink-soft">
              © {year} {business.name} ·{" "}
              <a
                href={business.cac.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline underline-offset-2 hover:text-ink"
              >
                RC {business.cac.rc}
              </a>{" "}
              · Campaign started 15 October 2026
            </span>
          </div>

          <p className="text-[12.5px] font-semibold text-ink-soft">
            Voluntary support, not an investment. Figures update live from Paystack.
          </p>
        </div>
      </div>
    </footer>
  );
}
