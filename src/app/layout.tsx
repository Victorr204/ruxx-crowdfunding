import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { campaign, siteUrl } from "@/lib/campaign";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["600", "700", "800"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FBF6EC",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: "Help me launch Ruxx Prepaid — Victor's ₦700,000 campaign",
  description: campaign.tagline,
  keywords: [
    "Ruxx Prepaid",
    "Ruxx Digital Services",
    "crowdfunding Nigeria",
    "airtime data cable electricity",
    "Paystack donation",
  ],
  openGraph: {
    title: "Help me launch Ruxx Digital Services",
    description: campaign.tagline,
    url: siteUrl(),
    siteName: "Ruxx Prepaid Crowdfunding",
    images: [{ url: campaign.images.hero, width: 1672, height: 941, alt: "Ruxx Digital Services" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Help me launch Ruxx Digital Services",
    description: campaign.tagline,
    images: [campaign.images.hero],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${jakarta.variable}`}>
      <body className="paper min-h-screen">{children}</body>
    </html>
  );
}
