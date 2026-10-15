import Image from "next/image";
import { campaign } from "@/lib/campaign";
import { IconWhatsApp } from "./Icons";

/** Smooth-scrolls to the donation form. On phones the "ways to give" column
 *  sits above the form, so small screens jump straight to the amount picker. */
export function scrollToDonate() {
  const isSmall = window.matchMedia("(max-width: 1023px)").matches;
  const target =
    (isSmall ? document.getElementById("amounts") : null) ?? document.getElementById("donate");
  target?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Header() {
  const { fundraiser, images } = campaign;

  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#top" className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white ring-1 ring-ink/10">
            <Image
              src={images.logo}
              alt="Ruxx logo"
              width={475}
              height={525}
              sizes="44px"
              priority
              className="h-full w-full object-cover"
            />
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-[15px] font-extrabold">Ruxx Prepaid</span>
            <span className="block text-[11px] font-semibold text-ink-soft">
              Launch campaign · {fundraiser.name.split(" ")[0]} Ruben
            </span>
          </span>
          <span className="block text-[15px] font-extrabold leading-tight sm:hidden">
            Ruxx Prepaid
          </span>
        </a>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={fundraiser.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full border border-teal/25 px-4 py-2 text-sm font-bold text-teal transition hover:bg-teal-100 sm:inline-flex"
          >
            <IconWhatsApp className="h-4 w-4" />
            Ask a question
          </a>
          <button
            type="button"
            onClick={scrollToDonate}
            className="btn-gold whitespace-nowrap rounded-full px-4 py-2.5 text-[13.5px] font-extrabold sm:px-5 sm:text-sm"
          >
            Donate now
          </button>
        </div>
      </div>
    </header>
  );
}
