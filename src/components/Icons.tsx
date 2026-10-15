import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const IconAirtime = (p: Props) => (
  <svg {...base} {...p}>
    <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
    <path d="M11 18.5h2" />
    <path d="M9.5 7.5c1.7 1.4 3.3 1.4 5 0" />
    <path d="M9.5 10.5c1.7 1.4 3.3 1.4 5 0" />
  </svg>
);

export const IconData = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M5 19a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" stroke="none" />
    <path d="M10 19a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" stroke="none" />
    <path d="M15 19a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" stroke="none" />
    <path d="M20 19a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" stroke="none" />
    <path d="M5 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" stroke="none" />
    <path d="M10 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" stroke="none" />
    <path d="M15 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" stroke="none" />
    <path d="M20 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" stroke="none" />
    <path d="M6 9.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" stroke="none" />
    <path d="M11 9.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" stroke="none" />
    <path d="M16 9.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" stroke="none" />
    <path d="M21 9.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" stroke="none" />
    <path d="M7 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" stroke="none" />
    <path d="M12 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" stroke="none" />
    <path d="M17 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" stroke="none" />
  </svg>
);

export const IconCable = (p: Props) => (
  <svg {...base} {...p}>
    <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
    <path d="M7 10.5h10" />
    <path d="M7 14h6" />
  </svg>
);

export const IconPower = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M13 2.5 4.5 13.5h6.2L11 21.5l8.5-11h-6.2L13 2.5Z" />
  </svg>
);

export const IconCard = (p: Props) => (
  <svg {...base} {...p}>
    <rect x="2.5" y="5" width="19" height="14" rx="3" />
    <path d="M2.5 10h19" />
    <path d="M6 15h4" />
  </svg>
);

export const IconHeart = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M12 20.5s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 3.1c0 5.4-7.5 10-7.5 10Z" />
  </svg>
);

export const IconShield = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M12 2.8 4.5 6v6c0 4.4 3.1 7.9 7.5 9.2 4.4-1.3 7.5-4.8 7.5-9.2V6L12 2.8Z" />
    <path d="m9 12 2.2 2.2L15.3 10" />
  </svg>
);

export const IconSparkle = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M12 3.2c.6 4 2.3 5.7 6.3 6.3-4 .6-5.7 2.3-6.3 6.3-.6-4-2.3-5.7-6.3-6.3 4-.6 5.7-2.3 6.3-6.3Z" />
    <path d="M18.5 15.5c.3 1.9 1.1 2.7 3 3-1.9.3-2.7 1.1-3 3-.3-1.9-1.1-2.7-3-3 1.9-.3 2.7-1.1 3-3Z" />
  </svg>
);

export const IconTrophy = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
    <path d="M7 5.5H4.8A1.8 1.8 0 0 0 3 7.3c0 2 1.3 3.4 3.3 3.7" />
    <path d="M17 5.5h2.2a1.8 1.8 0 0 1 1.8 1.8c0 2-1.3 3.4-3.3 3.7" />
    <path d="M12 14v3" />
    <path d="M8.5 20.5h7" />
    <path d="M10 17h4v3.5h-4z" />
  </svg>
);

export const IconUsers = (p: Props) => (
  <svg {...base} {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 19.5a5.5 5.5 0 0 1 11 0" />
    <path d="M16 5.4a3.2 3.2 0 0 1 0 6.2" />
    <path d="M17.5 14.6a5.5 5.5 0 0 1 3 4.9" />
  </svg>
);

export const IconTarget = (p: Props) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.8" />
    <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
  </svg>
);

export const IconWhatsApp = (p: Props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.87 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z" />
    <path d="M12.04 2.5c-5.24 0-9.5 4.26-9.5 9.5 0 1.67.44 3.3 1.27 4.74L2.5 21.5l4.9-1.28a9.46 9.46 0 0 0 4.64 1.2h.01c5.23 0 9.49-4.26 9.49-9.5 0-2.54-.99-4.92-2.78-6.71a9.42 9.42 0 0 0-6.72-2.71Zm0 17.36h-.01a7.9 7.9 0 0 1-4.02-1.1l-.29-.17-2.91.76.78-2.84-.19-.29a7.86 7.86 0 0 1-1.21-4.22c0-4.35 3.54-7.89 7.9-7.89 2.11 0 4.09.82 5.58 2.31a7.84 7.84 0 0 1 2.31 5.59c0 4.35-3.54 7.85-7.94 7.85Z" />
  </svg>
);

export const IconX = (p: Props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M17.53 3h3.05l-6.66 7.61L21.75 21h-6.13l-4.8-6.28L5.32 21H2.27l7.12-8.14L2.25 3h6.29l4.34 5.74L17.53 3Zm-1.07 16.2h1.69L7.6 4.71H5.79l10.67 14.49Z" />
  </svg>
);

export const IconTelegram = (p: Props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M21.5 4.3 2.9 11.4c-.9.35-.88 1.63.03 1.95l4.6 1.62 1.78 5.4c.24.72 1.16.93 1.69.4l2.5-2.4 4.7 3.45c.6.44 1.46.11 1.62-.6l3.1-14.7c.18-.83-.63-1.52-1.42-1.22ZM8.6 14.3l9.1-5.6c.42-.26.86.3.5.63l-7.4 6.83-.29 3.1-1.91-4.96Z" />
  </svg>
);

export const IconCopy = (p: Props) => (
  <svg {...base} {...p}>
    <rect x="9" y="9" width="11.5" height="11.5" rx="2.5" />
    <path d="M15 6.5V5.5A2.5 2.5 0 0 0 12.5 3h-7A2.5 2.5 0 0 0 3 5.5v7A2.5 2.5 0 0 0 5.5 15h1" />
  </svg>
);

export const IconCheck = (p: Props) => (
  <svg {...base} {...p}>
    <path d="m4.5 12.5 5 5 10-11" />
  </svg>
);

export const IconLock = (p: Props) => (
  <svg {...base} {...p}>
    <rect x="4.5" y="10" width="15" height="10.5" rx="2.5" />
    <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
  </svg>
);

export const IconArrow = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M4.5 12h15" />
    <path d="m13.5 6 6 6-6 6" />
  </svg>
);

export const IconGift = (p: Props) => (
  <svg {...base} {...p}>
    <rect x="3" y="9.5" width="18" height="11.5" rx="2.5" />
    <path d="M3 14h18" />
    <path d="M12 9.5v11.5" />
    <path d="M12 9.5S10.8 4 8.3 4a2.4 2.4 0 0 0 0 5.5H12Z" />
    <path d="M12 9.5S13.2 4 15.7 4a2.4 2.4 0 0 1 0 5.5H12Z" />
  </svg>
);

export const serviceIcons = {
  airtime: IconAirtime,
  data: IconData,
  cable: IconCable,
  power: IconPower,
  card: IconCard,
} as const;
