/* ---------------------------------------------------------------------------
   RUXX PREPAID CROWDFUNDING - campaign content & settings
   ---------------------------------------------------------------------------
   Everything you might want to edit (text, tiers, links) lives in this file.
   You do NOT need to touch any other file to change wording on the page.
--------------------------------------------------------------------------- */

export const campaign = {
  id: "ruxx-prepaid-launch",

  title: "Help me launch Ruxx Digital Services",
  tagline:
    "Help me raise ₦1,500,000 to complete, test, and publish Ruxx Prepaid — a platform designed to make everyday digital payments in Nigeria faster and easier.",

  goalNaira: 1_500_000,
  currency: "NGN" as const,

  /** Used to scope which Paystack transactions belong to this campaign. */
  startedAt: "2026-10-15T00:00:00+01:00",

  fundraiser: {
    name: "Victor Chidiebere Ruben",
    role: "Founder, Ruxx Digital Services",
    photo: "/my-img.png",
    whatsappNumber: "2349037306845",
    whatsappDisplay: "+234 903 730 6845",
    whatsappLink: "https://wa.me/2349037306845",
  },

  images: {
    hero: "/hero-img.jpg",
    logo: "/logo.png",
    /** Lightweight (95 KB) 1200×675 copy of the hero used for link previews —
     *  crawlers on slow networks fetch this fast, so WhatsApp/Telegram never
     *  render a text-only preview. */
    shareBanner: "/share-banner.jpg",
  },

  /** Suggested contribution levels (naira). */
  tiers: [
    {
      amount: 500,
      label: "A small but meaningful start.",
      blurb: "Help me build momentum toward the funding goal.",
    },
    {
      amount: 1000,
      label: "One step closer.",
      blurb: "Help increase the funds available for final development and testing.",
    },
    {
      amount: 2500,
      label: "Support the finishing work.",
      blurb: "Help me move closer to completing the remaining technical tasks.",
    },
    {
      amount: 5000,
      label: "Help prepare for launch.",
      blurb: "Make a meaningful contribution toward testing and publishing preparations.",
    },
    {
      amount: 10000,
      label: "Become a launch supporter.",
      blurb: "Help accelerate progress toward the ₦1,500,000 target.",
    },
  ],

  /** Quick-fill options shown inside the "I'll choose my amount" box. */
  customPresets: [1000, 2500, 5000, 10000, 25000],

  minNaira: 100,
  maxNaira: 5_000_000,

  story: [
    "Hello, my name is Victor Chidiebere Ruben, and I'm the founder behind Ruxx Digital Services.",
    "I've been working toward building a digital service that makes it easier for Nigerians to access essential everyday services from one convenient platform. Today, I'm reaching out to ask for your support in helping me take this project across the finish line.",
    "That vision is Ruxx Digital Services, powered by our official app, Ruxx Prepaid.",
    "Ruxx is designed to make purchasing airtime, subscribing to internet data plans, renewing cable TV subscriptions, and paying electricity bills simpler and more convenient. Rather than making these services complicated, I want to provide users with a straightforward digital experience that saves time and makes everyday transactions easier.",
    "I'm now working toward the final development, testing, and publishing stage. To move forward, I need to raise ₦1,500,000 — approximately $1,000.",
    "This may not be a huge amount compared with the funding many startups seek, but it is an important milestone for me and this project. I've decided to reach out to individuals who might be willing to contribute whatever they can.",
    "I'm not asking one person to carry the entire burden. I'm asking many people to help make a shared goal possible.",
  ],

  services: [
    {
      icon: "airtime",
      title: "Mobile airtime",
      body: "Convenient top-ups across supported mobile networks.",
    },
    {
      icon: "data",
      title: "Internet data bundles",
      body: "Affordable data plans for staying connected.",
    },
    {
      icon: "cable",
      title: "Cable TV subscriptions",
      body: "Payments for DStv, GOtv and StarTimes.",
    },
    {
      icon: "power",
      title: "Electricity payments",
      body: "Electricity bills and utility token purchases across supported providers.",
    },
    {
      icon: "card",
      title: "Convenient digital transactions",
      body: "A streamlined experience supported by payment gateway infrastructure.",
    },
  ],

  fundingAreas: [
    {
      step: "1",
      title: "Final development",
      body: "To help complete the remaining development work needed to prepare the platform for release.",
    },
    {
      step: "2",
      title: "Testing and quality assurance",
      body: "To help test the app, identify issues, and improve its stability and user experience before launch.",
    },
    {
      step: "3",
      title: "Publishing and launch preparation",
      body: "To help cover the costs associated with preparing and publishing the project on its intended platform or platforms.",
    },
  ],
  fundingNote:
    "The exact allocation will depend on the outstanding technical work and publishing requirements. My priority is to use the money responsibly to bring the project closer to launch. Every contribution, regardless of size, will help me work toward this goal.",

  commitment: [
    "I understand that contributing money to someone's project requires trust. I do not take that trust lightly.",
    "My commitment is to use the funds raised toward the stated purpose: final development, testing, and publishing preparations for Ruxx Prepaid.",
    "I want supporters to understand what they are helping me accomplish. I will aim to communicate meaningful progress and share updates about the project's journey as it moves toward launch.",
  ],
  disclaimer:
    "This is a request for voluntary support, not an investment offer. Contributions do not guarantee financial returns, ownership, or rewards unless these are separately agreed upon in writing.",

  cannotDonate: {
    heading: "Your support can mean more than money.",
    body: "If you cannot contribute financially, you can still help by sharing this campaign with your friends, family, colleagues, social media followers, or anyone who believes in supporting emerging founders and technology projects. One share could connect this campaign with someone who is willing and able to help. Please consider sharing this campaign — it costs nothing, but it could make a real difference.",
  },
} as const;

/** Base URL for sharing links, canonical metadata and Paystack callbacks. */
export function siteUrl(): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env.replace(/\/$/, "");

  // Falls back to Vercel's own domain if NEXT_PUBLIC_SITE_URL was not set.
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

export const Naira = {
  format(naira: number, withKobo = false): string {
    const value = withKobo ? naira : Math.round(naira);
    return "₦" + value.toLocaleString("en-NG", { maximumFractionDigits: 0 });
  },
  compact(naira: number): string {
    if (naira >= 1_000_000)
      return `₦${(naira / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}m`;
    if (naira >= 1_000) return `₦${Math.round(naira / 1_000)}k`;
    return `₦${Math.round(naira)}`;
  },
};
