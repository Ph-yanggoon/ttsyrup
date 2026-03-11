"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  useScrollAnimation,
  useProgressiveReveal,
} from "./scroll-hooks";

/* ─────────────────────────────────────────────────
   S8 — FaqCta
   section-lavender 배경의 FAQ + 최종 CTA 섹션.

   Design approach:
   - Soft lavender background for calming close
   - Accordion FAQ with smooth expand/collapse
   - Final CTA with warm gradient text
   - Scroll-to-top secondary button
   ───────────────────────────────────────────────── */

/* ── CTA product images (visual config only) ── */
const CTA_PRODUCTS = [
  { id: "syrup", src: "/products/syrup-box-transparent.png", altKey: "cta.products.syrup", w: 200, h: 240 },
  { id: "stick", src: "/products/stick-transparent.png", altKey: "cta.products.stick", w: 180, h: 220 },
  { id: "jjayo", src: "/products/jjayo-40pack-transparent.png", altKey: "cta.products.jjayo", w: 180, h: 220 },
];

/* ── Accordion Item ── */
function FaqItem({
  q,
  a,
  isOpen,
  onToggle,
}: {
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="faq-item border-b border-black/[0.06] last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 sm:py-6 text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-body font-semibold text-text-primary group-hover:text-elderberry-500 transition-colors duration-200 leading-snug pr-2">
          {q}
        </span>
        <span
          className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
            isOpen
              ? "bg-elderberry-500 rotate-45"
              : "bg-black/[0.04] group-hover:bg-elderberry-50"
          }`}
        >
          <svg
            viewBox="0 0 14 14"
            fill="none"
            className={`w-3.5 h-3.5 transition-colors duration-300 ${
              isOpen ? "text-white" : "text-text-secondary"
            }`}
          >
            <path
              d="M7 1v12M1 7h12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>

      <div
        className="grid transition-[grid-template-rows,opacity] duration-500 ease-out"
        style={{
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="overflow-hidden">
          <p className="text-body text-text-secondary leading-relaxed pb-5 sm:pb-6 pr-10">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══════ Main Component ═══════ */
export default function FaqCta() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const t = useTranslations("faq");

  /* ── FAQ items from i18n ── */
  const faqItems = t.raw("items") as Array<{ q: string; a: string }>;

  /* ── Scroll hooks ── */
  const faqHeadRef = useScrollAnimation<HTMLHeadingElement>({
    from: { opacity: 0, y: 40 },
    duration: 1.1,
    ease: "power3.out",
  });

  const faqListRef = useProgressiveReveal<HTMLDivElement>({
    childSelector: ".faq-item",
    stagger: 0.1,
    from: { opacity: 0, y: 20 },
    duration: 0.7,
  });

  const ctaRef = useScrollAnimation<HTMLDivElement>({
    from: { opacity: 0, y: 48, scale: 0.96 },
    duration: 1.2,
    delay: 0.1,
  });

  const handleScrollToTop = () => {
    // Use Lenis smooth scroll (avoids conflict with native smooth-scroll)
    const lenis = (window as unknown as Record<string, unknown>).__lenis;
    if (lenis && typeof (lenis as { scrollTo?: unknown }).scrollTo === "function") {
      (lenis as { scrollTo: (target: number) => void }).scrollTo(0);
    } else {
      window.scrollTo({ top: 0 });
    }
  };

  return (
    <section
      id="faq-cta"
      className="section-lavender section-padding relative overflow-hidden"
    >
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-[10%] left-[5%] w-[300px] h-[300px] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(91,46,140,0.06) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-[20%] right-[10%] w-[250px] h-[250px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(232,115,74,0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="section-inner relative z-10">
        {/* ═══════ FAQ Section ═══════ */}
        <div className="max-w-[680px] mx-auto mb-20 lg:mb-28">
          {/* FAQ Headline */}
          <div className="text-center mb-10 lg:mb-12">
            <h2
              ref={faqHeadRef}
              className="font-bold text-text-primary leading-[1.15] tracking-[-0.025em]"
              style={{ fontSize: "var(--font-size-heading-xl)" }}
            >
              {t("headline")}
            </h2>
          </div>

          {/* FAQ Accordion */}
          <div
            ref={faqListRef}
            className="bg-white/70 backdrop-blur-sm rounded-2xl px-6 sm:px-8 border border-black/[0.04] shadow-sm"
          >
            {faqItems.map((faq, i) => (
              <FaqItem
                key={i}
                q={faq.q}
                a={faq.a}
                isOpen={openIdx === i}
                onToggle={() => setOpenIdx(openIdx === i ? null : i)}
              />
            ))}
          </div>
        </div>

        {/* ═══════ Final CTA Section ═══════ */}
        <div
          ref={ctaRef}
          className="text-center max-w-[720px] mx-auto"
        >
          {/* CTA Headline */}
          <h2
            className="font-bold text-text-primary leading-[1.15] tracking-[-0.025em] mb-4"
            style={{ fontSize: "var(--font-size-heading-xl)" }}
          >
            {t("cta.headline.line1")}
            <br />
            <span className="text-gradient-warm">
              {t("cta.headline.highlight")}
            </span>
          </h2>

          {/* CTA Subcopy */}
          <p className="text-body-lg text-text-secondary leading-relaxed mb-8 lg:mb-10">
            {t("cta.body.line1")}
            <br />
            {t("cta.body.line2")}
          </p>

          {/* Product images */}
          <div className="flex items-end justify-center gap-6 sm:gap-8 mb-10 lg:mb-12">
            {CTA_PRODUCTS.map((p) => (
              <div key={p.id} className="relative" style={{ width: p.w, height: p.h }}>
                <Image
                  src={p.src}
                  alt={t(p.altKey)}
                  fill
                  sizes="120px"
                  className="object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
                />
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center">
            <a href="#pharmacy-finder" className="btn-primary">
              {t("cta.buttons.findPharmacy")}
            </a>
            <button
              onClick={handleScrollToTop}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-body-sm font-semibold text-text-secondary bg-white/80 backdrop-blur-sm border border-black/[0.06] hover:bg-white hover:border-black/[0.1] transition-all duration-200"
            >
              {t("cta.buttons.scrollToTop")}
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-5 mt-8 text-[14px] text-text-tertiary">
            <span className="flex items-center gap-2">
              <svg viewBox="0 0 16 16" fill="none" className="w-4.5 h-4.5">
                <path
                  d="M8 1.5l4.5 2v4c0 3.5-2 6-4.5 7-2.5-1-4.5-3.5-4.5-7v-4L8 1.5z"
                  fill="currentColor"
                  opacity="0.3"
                />
                <path
                  d="M6 8l1.5 1.5L10 6.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t("cta.trustBadges.pharmacyOnly")}
            </span>
            <span className="w-px h-4 bg-text-tertiary/30" />
            <span className="flex items-center gap-2">
              <svg viewBox="0 0 16 16" fill="none" className="w-4.5 h-4.5">
                <circle
                  cx="8"
                  cy="8"
                  r="6"
                  fill="currentColor"
                  opacity="0.2"
                />
                <path
                  d="M8 5v3.5l2 1.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t("cta.trustBadges.fromAge1")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
