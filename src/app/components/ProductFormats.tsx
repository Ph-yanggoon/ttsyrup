"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  useScrollAnimation,
  useProgressiveReveal,
} from "./scroll-hooks";

/* ─────────────────────────────────────────────────
   S6 — ProductFormats
   section-ivory 배경의 제품 라인업 쇼케이스.

   Design approach:
   - 밝고 깨끗한 아이보리 배경
   - 3 product cards with transparent PNG images
   - Interactive comparison table
   - Character mention at bottom
   ───────────────────────────────────────────────── */

/* ── Product format data (visual config only, text via i18n) ── */
interface FormatData {
  id: string;
  image: string;
  icon: string;
  color: string;
  characterColor: string;
  hasExtra: boolean;
}

const FORMATS: FormatData[] = [
  {
    id: "syrup",
    image: "/products/syrup-box-transparent.png",
    icon: "🏠",
    color: "var(--color-elderberry)",
    characterColor: "#7CB342",
    hasExtra: false,
  },
  {
    id: "stick",
    image: "/products/stick-transparent.png",
    icon: "✈️",
    color: "var(--color-elderberry-400)",
    characterColor: "#4DB6AC",
    hasExtra: false,
  },
  {
    id: "jjayo",
    image: "/products/jjayo-40pack-transparent.png",
    icon: "🧒",
    color: "var(--color-coral)",
    characterColor: "#4DB6AC",
    hasExtra: true,
  },
];

/* ── Product Card ── */
function FormatCard({
  format,
  isExpanded,
  onToggle,
}: {
  format: FormatData;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const t = useTranslations("formats");

  return (
    <button
      onClick={onToggle}
      className={`format-card group relative rounded-3xl p-5 sm:p-6 text-left transition-all duration-500 w-full border-2 border-transparent ${
        isExpanded
          ? "shadow-xl scale-[1.02]"
          : "bg-white/60 shadow-sm hover:shadow-md hover:bg-white/80"
      }`}
      style={
        isExpanded
          ? {
              background:
                "linear-gradient(#fff, #fff) padding-box, linear-gradient(135deg, var(--color-coral) 0%, var(--color-elderberry-light) 100%) border-box",
            }
          : {}
      }
      aria-expanded={isExpanded}
    >
      {/* Use case badge */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{
            backgroundColor: isExpanded
              ? `color-mix(in srgb, ${format.color} 12%, transparent)`
              : "rgba(0,0,0,0.04)",
            color: isExpanded ? format.color : "var(--color-text-secondary)",
          }}
        >
          <span>{format.icon}</span>
          {t(`products.${format.id}.useCase`)}
        </span>
        <span className="text-[11px] text-text-tertiary font-medium">
          {t(`products.${format.id}.volume`)}
        </span>
      </div>

      {/* Product image */}
      <div className="relative w-full aspect-square mb-4 flex items-center justify-center">
        <div className="relative w-[75%] h-[75%]">
          <Image
            src={format.image}
            alt={t(`products.${format.id}.name`)}
            fill
            sizes="(max-width: 640px) 60vw, (max-width: 1024px) 30vw, 20vw"
            className={`object-contain transition-transform duration-500 ${
              isExpanded
                ? "scale-105 drop-shadow-[0_12px_32px_rgba(0,0,0,0.15)]"
                : "drop-shadow-[0_6px_16px_rgba(0,0,0,0.08)]"
            }`}
          />
        </div>
      </div>

      {/* Name */}
      <h3
        className="text-lg font-bold mb-1.5 transition-colors duration-300"
        style={{ color: isExpanded ? format.color : "var(--color-text-primary)" }}
      >
        {t(`products.${format.id}.name`)}
      </h3>

      {/* Tagline */}
      <p className="text-body-sm text-text-secondary leading-relaxed">
        {t(`products.${format.id}.tagline`)}
      </p>

      {/* ── Expandable Detail ── */}
      <div
        className="grid transition-[grid-template-rows,opacity] duration-500 ease-out"
        style={{
          gridTemplateRows: isExpanded ? "1fr" : "0fr",
          opacity: isExpanded ? 1 : 0,
          marginTop: isExpanded ? "1rem" : 0,
        }}
      >
        <div className="overflow-hidden">
        <div className="pt-3 border-t border-black/[0.06]">
          <p className="text-body-sm text-text-secondary leading-relaxed">
            {t(`products.${format.id}.desc`)}
          </p>
          {format.hasExtra && (
            <p className="text-body-sm text-text-secondary leading-relaxed mt-2">
              {t(`products.${format.id}.extra`)}
            </p>
          )}
          <div className="flex items-center gap-2 mt-3">
            <span
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: format.characterColor }}
            />
            <span className="text-[11px] text-text-tertiary">
              {t(`products.${format.id}.character`)}{t("characterSuffix")}
            </span>
          </div>
        </div>
        </div>
      </div>

      {/* ── Toggle indicator ── */}
      <div
        className="mt-3 flex items-center justify-center gap-1 text-xs font-medium transition-colors duration-300"
        style={{
          color: isExpanded ? format.color : "var(--color-text-tertiary)",
        }}
      >
        <span>{isExpanded ? t("expandButton.collapse") : t("expandButton.expand")}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={`transition-transform duration-300 ${
            isExpanded ? "rotate-180" : ""
          }`}
        >
          <path
            d="M3 4.5l3 3 3-3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </button>
  );
}

/* ═══════ Main Component ═══════ */
export default function ProductFormats() {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const t = useTranslations("formats");

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

  const gridRef = useProgressiveReveal<HTMLDivElement>({
    childSelector: ".format-card",
    stagger: 0.18,
    from: { opacity: 0, y: 44, scale: 0.96 },
    duration: 0.9,
  });

  return (
    <section
      id="product-formats"
      className="section-ivory section-padding relative overflow-hidden"
    >
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
            <span className="text-gradient-warm">{t("headline.highlight")}</span>
          </h2>

          <p
            ref={subRef}
            className="text-body-lg text-text-secondary max-w-[480px] mx-auto"
          >
            {t("subtitle.line1")}
            <br className="hidden sm:block" />
            {t("subtitle.line2")}
          </p>
        </div>

        {/* ── Product Cards Grid ── */}
        <div
          ref={gridRef}
          className="grid sm:grid-cols-3 gap-4 lg:gap-5 mb-8"
        >
          {FORMATS.map((format, i) => (
            <FormatCard
              key={format.id}
              format={format}
              isExpanded={expandedIdx === i}
              onToggle={() => setExpandedIdx(expandedIdx === i ? null : i)}
            />
          ))}
        </div>


      </div>
    </section>
  );
}
