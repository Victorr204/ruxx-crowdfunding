import Image from "next/image";
import { campaign } from "@/lib/campaign";

export default function Story() {
  const { story, fundraiser, images } = campaign;
  const paragraphs = [...story];

  // The pull quote sits between the third and fourth paragraphs.
  const quote = paragraphs.splice(2, 1)[0];

  return (
    <section id="story" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 sm:px-6 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="card overflow-hidden p-3">
            <Image
              src={fundraiser.photo}
              alt={fundraiser.name}
              width={1152}
              height={1431}
              sizes="(max-width: 1024px) calc(100vw - 64px), 420px"
              className="h-auto w-full rounded-2xl object-cover"
            />
            <div className="px-2 pb-2 pt-4 text-center lg:text-left">
              <p className="text-[15px] font-extrabold">{fundraiser.name}</p>
              <p className="text-[13px] text-ink-soft">{fundraiser.role}</p>
            </div>
          </div>

          <div className="mt-4 rounded-3xl bg-teal-100 p-5">
            <p className="text-[13px] font-extrabold uppercase tracking-wider text-teal-700">
              The vision
            </p>
            <p className="mt-1.5 text-[15px] font-semibold leading-relaxed text-teal-700">
              Make utility payments stress-free for Nigerians — so many platforms already do the
              same thing, and people deserve one simple place to get it all done.
            </p>
          </div>
        </div>

        <div>
          <p className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-gold-600">
            My story
          </p>
          <h2 className="display mt-3 text-4xl sm:text-5xl">
            Help me turn this vision into reality
          </h2>

          <div className="mt-6 space-y-5 text-[17px] leading-[1.75] text-ink-soft">
            {paragraphs.slice(0, 3).map((p) => (
              <p key={p.slice(0, 24)}>
                {p.startsWith("Hello") ? (
                  <>
                    <strong className="text-ink">{p.split(",")[0]},</strong>
                    {p.slice(p.indexOf(",") + 1)}
                  </>
                ) : (
                  p
                )}
              </p>
            ))}

            <blockquote className="relative rounded-3xl border-l-4 border-gold bg-white p-6 shadow-sm">
              <span className="display absolute -top-5 left-5 text-6xl leading-none text-gold/40">
                “
              </span>
              <p className="display relative text-xl leading-snug text-ink sm:text-2xl">
                {quote}
              </p>
            </blockquote>

            {paragraphs.slice(3).map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>
      </div>

      {/* small app shot tucked under the story */}
      <div className="mt-12 overflow-hidden rounded-3xl bg-white p-4 sm:p-6">
        <Image
          src={images.shareBanner}
          alt="The Ruxx Prepaid app — airtime, data, cable TV and electricity payments"
          width={1200}
          height={675}
          sizes="(max-width: 800px) calc(100vw - 72px), 768px"
          className="mx-auto h-auto w-full max-w-3xl rounded-2xl"
        />
      </div>
    </section>
  );
}
