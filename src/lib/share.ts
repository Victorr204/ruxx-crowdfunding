"use client";

import { useEffect, useState } from "react";
import { siteUrl } from "./campaign";

/** Matches http(s)://localhost, 127.0.0.1 or [::1], with an optional port. */
const LOCAL_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i;

const clean = (url: string) => url.replace(/\/+$/, "").trim();

/**
 * The base URL used in every share link (WhatsApp, X, Telegram, copy-link).
 *
 * Rules, applied after hydration:
 *  1. A visitor on the live site always shares **their own address** — whatever
 *     domain they are on, with no configuration needed.
 *  2. While previewing on localhost, a real `NEXT_PUBLIC_SITE_URL` wins instead,
 *     so the link you copy during development already points at the live site.
 *
 * The first paint uses `siteUrl()` so server and client markup match exactly
 * (no hydration warnings); the browser then corrects the URL in an effect.
 */
export function useShareUrl(): string {
  const [url, setUrl] = useState(siteUrl);

  useEffect(() => {
    const origin = clean(window.location.origin);
    if (!LOCAL_ORIGIN.test(origin)) {
      setUrl(origin); // live domain → always truthful
      return;
    }
    const configured = clean(siteUrl());
    if (configured && !LOCAL_ORIGIN.test(configured)) {
      setUrl(configured); // localhost preview → share the live link
    }
  }, []);

  return url;
}
