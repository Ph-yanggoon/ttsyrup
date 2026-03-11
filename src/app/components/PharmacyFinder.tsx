"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useScrollAnimation } from "./scroll-hooks";

/* ─────────────────────────────────────────────────
   S7 — PharmacyFinder
   section-peach 배경의 약국 찾기 섹션.

   Design approach:
   - Soft peach background for approachable feel
   - Search input (placeholder UI — no backend)
   - Map placeholder illustration
   - Contact info
   ───────────────────────────────────────────────── */

export default function PharmacyFinder() {
  const [query, setQuery] = useState("");
  const t = useTranslations("pharmacy");

  /* ── Scroll hooks ── */
  const headlineRef = useScrollAnimation<HTMLHeadingElement>({
    from: { opacity: 0, y: 40 },
    duration: 1.1,
    ease: "power3.out",
  });

  const subRef = useScrollAnimation<HTMLParagraphElement>({
    from: { opacity: 0, y: 20 },
    duration: 0.85,
    delay: 0.12,
  });

  const searchRef = useScrollAnimation<HTMLDivElement>({
    from: { opacity: 0, y: 28, scale: 0.98 },
    duration: 0.9,
    delay: 0.2,
  });

  const bodyRef = useScrollAnimation<HTMLDivElement>({
    from: { opacity: 0, y: 20 },
    duration: 0.8,
    delay: 0.3,
  });

  return (
    <section
      id="pharmacy-finder"
      className="section-peach section-padding relative overflow-hidden"
    >
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-[20%] right-[5%] w-[300px] h-[300px] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(232,115,74,0.1) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="section-inner relative z-10">
        {/* ── Headline ── */}
        <div className="text-center mb-10 lg:mb-14">
          <h2
            ref={headlineRef}
            className="font-bold text-text-primary leading-[1.15] tracking-[-0.025em] mb-4"
            style={{ fontSize: "var(--font-size-heading-xl)" }}
          >
            {t("headline.line1")}
            <br />
            <span className="text-gradient-warm">{t("headline.highlight")}</span>
          </h2>

          <p
            ref={subRef}
            className="text-body-lg text-text-secondary max-w-[480px] mx-auto leading-relaxed"
          >
            {t("subtitle.line1")}
            <br className="hidden sm:block" />
            {t("subtitle.line2")}
          </p>
        </div>

        {/* ── Search + Map Area ── */}
        <div ref={searchRef} className="max-w-[640px] mx-auto mb-10 lg:mb-12">
          {/* Search bar */}
          <div className="flex gap-2 sm:gap-3 mb-6">
            <div className="flex-1 relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary"
                viewBox="0 0 20 20"
                fill="none"
              >
                <circle
                  cx="9"
                  cy="9"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M13.5 13.5L17 17"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("search.placeholder")}
                className="w-full pl-12 pr-4 py-3.5 bg-white rounded-xl border border-black/[0.06] text-body text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-elderberry-300 transition-shadow"
              />
            </div>
            <button className="btn-primary flex-shrink-0 px-6 !py-3.5 !rounded-xl">
              {t("search.button")}
            </button>
          </div>

          {/* Map placeholder */}
          <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl border border-black/[0.04] overflow-hidden aspect-[16/9]">
            {/* Placeholder map illustration */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <svg
                viewBox="0 0 48 48"
                fill="none"
                className="w-12 h-12 mb-4 text-elderberry-300"
              >
                <path
                  d="M24 4C16.268 4 10 10.268 10 18c0 10.5 14 26 14 26s14-15.5 14-26c0-7.732-6.268-14-14-14z"
                  fill="currentColor"
                  opacity="0.15"
                />
                <path
                  d="M24 4C16.268 4 10 10.268 10 18c0 10.5 14 26 14 26s14-15.5 14-26c0-7.732-6.268-14-14-14z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle
                  cx="24"
                  cy="18"
                  r="5"
                  fill="currentColor"
                  opacity="0.3"
                />
              </svg>
              <p className="text-body text-text-secondary mb-1">
                {t("map.preparing")}
              </p>
              <p className="text-body-sm text-text-tertiary">
                {t("map.callGuide")}
              </p>
            </div>

            {/* Decorative grid dots */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              aria-hidden="true"
              style={{
                backgroundImage:
                  "radial-gradient(circle, currentColor 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
          </div>

          <p className="text-body-sm text-text-primary font-medium mt-4 text-center">
            {t("notice")}
          </p>
        </div>

        {/* ── Body text + Contact ── */}
        <div ref={bodyRef} className="max-w-[480px] mx-auto text-center">
          {/* Contact card */}
          <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-full px-5 py-3 border border-black/[0.04]">
            <svg
              viewBox="0 0 20 20"
              fill="none"
              className="w-5 h-5 text-elderberry-400"
            >
              <path
                d="M3 5.5A2.5 2.5 0 015.5 3h1.148a1.5 1.5 0 011.465 1.175l.513 2.31a1.5 1.5 0 01-.75 1.636l-.97.485a.5.5 0 00-.236.578 8 8 0 004.146 4.146.5.5 0 00.578-.236l.485-.97a1.5 1.5 0 011.636-.75l2.31.513A1.5 1.5 0 0117 13.352V14.5a2.5 2.5 0 01-2.5 2.5h-1A11.5 11.5 0 013 6.5v-1z"
                fill="currentColor"
                opacity="0.2"
              />
              <path
                d="M3 5.5A2.5 2.5 0 015.5 3h1.148a1.5 1.5 0 011.465 1.175l.513 2.31a1.5 1.5 0 01-.75 1.636l-.97.485a.5.5 0 00-.236.578 8 8 0 004.146 4.146.5.5 0 00.578-.236l.485-.97a1.5 1.5 0 011.636-.75l2.31.513A1.5 1.5 0 0117 13.352V14.5a2.5 2.5 0 01-2.5 2.5h-1A11.5 11.5 0 013 6.5v-1z"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
            <span className="text-body-sm font-medium text-text-primary">
              {t("contact.label")}{" "}
              <a
                href="tel:031-662-1395"
                className="text-elderberry-500 hover:underline"
              >
                031-662-1395
              </a>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
