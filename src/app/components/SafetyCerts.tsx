"use client";

import { useTranslations } from "next-intl";
import {
  useScrollAnimation,
  useProgressiveReveal,
} from "./scroll-hooks";

/* ─────────────────────────────────────────────────
   S5 — SafetyCerts
   section-sage (자연스러운 녹색 톤) 배경의 안전·인증 섹션.

   Design approach:
   - Clean, trust-building layout
   - Certification badges with icons
   - Safety evidence callout
   - Pharmacy-only badge emphasis
   ───────────────────────────────────────────────── */

/* ── Certification data (visual config only, text via i18n) ── */
const CERTS = [
  {
    id: "gmp",
    abbr: "GMP",
    label: "Good Manufacturing Practice",
    color: "var(--color-elderberry)",
  },
  {
    id: "fssc",
    abbr: "FSSC 22000",
    label: "Food Safety System Certification",
    color: "var(--color-elderberry)",
  },
  {
    id: "iso",
    abbr: "ISO",
    label: "International Organization for Standardization",
    color: "var(--color-elderberry)",
  },
  {
    id: "fssai",
    abbr: "FSSAI",
    label: "Food Safety and Standards Authority of India",
    color: "var(--color-coral)",
  },
];

/* ── Shield icon SVG ── */
function ShieldIcon({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className="w-10 h-10 flex-shrink-0"
      aria-hidden="true"
    >
      <path
        d="M20 4l12 5v9c0 8.5-5.2 14.5-12 17-6.8-2.5-12-8.5-12-17V9l12-5z"
        fill={`color-mix(in srgb, ${color} 12%, transparent)`}
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M15 20l3.5 3.5L26 16"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SafetyCerts() {
  const t = useTranslations("safety");

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

  const certGridRef = useProgressiveReveal<HTMLDivElement>({
    childSelector: ".cert-card",
    stagger: 0.14,
    from: { opacity: 0, y: 32, scale: 0.97 },
    duration: 0.8,
  });

  const safetyRef = useScrollAnimation<HTMLDivElement>({
    from: { opacity: 0, y: 30 },
    duration: 0.9,
    delay: 0.25,
  });

  const pharmacyRef = useScrollAnimation<HTMLDivElement>({
    from: { opacity: 0, y: 24, scale: 0.96 },
    duration: 0.85,
    delay: 0.35,
  });

  return (
    <section
      id="safety-certs"
      className="section-sage section-padding relative overflow-hidden"
    >
      {/* ═══════ Background texture ═══════ */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 20% 30%, rgba(124,179,66,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(91,46,140,0.04) 0%, transparent 50%)",
        }}
      />

      <div className="section-inner relative z-10">
        {/* ── Headline ── */}
        <div className="text-center mb-12 lg:mb-16">
          <h2
            ref={headlineRef}
            className="font-bold text-text-primary leading-[1.15] tracking-[-0.025em] mb-4"
            style={{ fontSize: "var(--font-size-heading-xl)" }}
          >
            {t("headline.line1")}
            <br />
            {t("headline.line2prefix")} <span className="text-gradient-elderberry">{t("headline.highlight")}</span>
          </h2>

          <p
            ref={subRef}
            className="text-body-lg text-text-secondary max-w-[520px] mx-auto leading-relaxed"
          >
            {t("subtitle.line1")}
            <br className="hidden sm:block" />
            {t("subtitle.line2")}
          </p>
        </div>

        {/* ── Certification Cards ── */}
        <div
          ref={certGridRef}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-12 lg:mb-16"
        >
          {CERTS.map((cert) => (
            <div
              key={cert.id}
              className="cert-card bg-white/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-white/60 hover:shadow-lg transition-all duration-300"
            >
              {/* Category */}
              <span className="text-[10px] uppercase tracking-widest font-semibold text-text-tertiary mb-3 block">
                {t(`certs.${cert.id}.category`)}
              </span>

              {/* Icon + Abbr */}
              <div className="flex items-center gap-3 mb-3">
                <ShieldIcon color={cert.color} />
                <span
                  className="text-lg font-bold"
                  style={{ color: cert.color }}
                >
                  {cert.abbr}
                </span>
              </div>

              {/* Label */}
              <p className="text-[11px] text-text-tertiary mb-1.5 leading-snug">
                {cert.label}
              </p>

              {/* Description */}
              <p className="text-body-sm text-text-secondary leading-relaxed">
                {t(`certs.${cert.id}.desc`)}
              </p>
            </div>
          ))}
        </div>

        {/* ── Safety Evidence + Pharmacy Section ── */}
        <div className="grid lg:grid-cols-2 gap-5 lg:gap-6">
          {/* Safety callout */}
          <div
            ref={safetyRef}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-elderberry-100/40"
          >
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background:
                    "color-mix(in srgb, var(--color-elderberry) 10%, transparent)",
                }}
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  className="w-5 h-5"
                  aria-hidden="true"
                >
                  <path
                    d="M10 2l6 3v5c0 5-2.6 8.5-6 10-3.4-1.5-6-5-6-10V5l6-3z"
                    fill="var(--color-elderberry)"
                    opacity="0.15"
                  />
                  <path
                    d="M10 6v5m0 2.5v.5"
                    stroke="var(--color-elderberry)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-text-primary leading-snug">
                {t("safetyEvidence.title")}
              </h3>
            </div>

            <p className="text-body text-text-secondary leading-relaxed mb-3">
              {t("safetyEvidence.body")}
            </p>

            <p className="text-[11px] text-text-tertiary/60 italic leading-relaxed">
              {t("safetyEvidence.citation")}
            </p>
          </div>

          {/* Pharmacy Only */}
          <div
            ref={pharmacyRef}
            className="relative rounded-2xl p-6 sm:p-8 overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, var(--color-elderberry) 0%, color-mix(in srgb, var(--color-elderberry) 80%, #1a1a2e) 100%)",
            }}
          >
            {/* Subtle pattern */}
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              aria-hidden="true"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 21px)",
              }}
            />

            <div className="relative z-10">
              {/* Badge */}
              <span className="inline-block text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-full bg-white/15 text-white/90 mb-5">
                {t("pharmacyOnly.badge")}
              </span>

              <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-3">
                {t("pharmacyOnly.title.line1")}
                <br />
                {t("pharmacyOnly.title.line2")}
              </h3>

              <p className="text-body text-white/70 leading-relaxed mb-5">
                {t("pharmacyOnly.body")}
              </p>

              <a
                href="#pharmacy-finder"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-white/15 hover:bg-white/25 rounded-full px-5 py-2.5 transition-colors duration-200"
              >
                {t("pharmacyOnly.cta")}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <path
                    d="M5 3l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
