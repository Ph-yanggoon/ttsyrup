"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  useScrollAnimation,
  useProgressiveReveal,
} from "./scroll-hooks";

/* ─────────────────────────────────────────────────
   S4 — IngredientCards
   따뜻한 배경의 핵심 원료 딥다이브 카드 섹션.

   Design approach:
   - Warm default background (no section-* class)
   - 3 feature-rich ingredient cards
   - Each card: illustration area + title + body + expandable detail
   - Tags for quick scanning
   - Progressive reveal on scroll
   ───────────────────────────────────────────────── */

/* ── Ingredient data (keep SVG icons + visual config, text via i18n) ── */
const INGREDIENTS = [
  {
    id: "duoligo",
    icon: (
      <svg
        viewBox="0 0 56 56"
        fill="none"
        className="w-14 h-14"
        aria-hidden="true"
      >
        <circle cx="28" cy="28" r="26" fill="var(--color-elderberry-50)" />
        <circle cx="20" cy="22" r="4" fill="var(--color-elderberry-300)" opacity="0.7" />
        <circle cx="34" cy="20" r="3" fill="var(--color-elderberry-400)" opacity="0.6" />
        <circle cx="28" cy="32" r="5" fill="var(--color-elderberry)" opacity="0.5" />
        <circle cx="38" cy="34" r="3.5" fill="var(--color-elderberry-300)" opacity="0.7" />
        <circle cx="18" cy="36" r="3" fill="var(--color-elderberry-400)" opacity="0.5" />
        <path
          d="M16 28c4-6 12-6 16-2s8 4 10 0"
          stroke="var(--color-elderberry)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.3"
        />
      </svg>
    ),
    tagColor: "var(--color-elderberry)",
    highlightKeys: ["lactulose", "gos"],
    hasCitation: true,
  },
  {
    id: "amla",
    icon: (
      <svg
        viewBox="0 0 56 56"
        fill="none"
        className="w-14 h-14"
        aria-hidden="true"
      >
        <circle cx="28" cy="28" r="26" fill="#F1F8E9" />
        <circle cx="28" cy="27" r="11" fill="#AED581" opacity="0.45" />
        <circle cx="28" cy="27" r="7.5" fill="#8BC34A" opacity="0.5" />
        <circle cx="25" cy="25" r="2" fill="white" opacity="0.35" />
        <path
          d="M28 16c-1 0-3 2-3 4s2 2 3 2 3 0 3-2-2-4-3-4z"
          fill="#558B2F"
          opacity="0.6"
        />
      </svg>
    ),
    tagColor: "#7CB342",
    highlightKeys: ["amla", "vitaminC"],
    hasCitation: false,
  },
  {
    id: "monkfruit",
    icon: (
      <svg
        viewBox="0 0 56 56"
        fill="none"
        className="w-14 h-14"
        aria-hidden="true"
      >
        <circle cx="28" cy="28" r="26" fill="#EFEBE9" />
        <circle cx="28" cy="29" r="11" fill="#A1887F" opacity="0.4" />
        <circle cx="28" cy="29" r="7" fill="#795548" opacity="0.35" />
        <circle cx="25" cy="27" r="1.8" fill="white" opacity="0.2" />
        <path
          d="M28 18c-1 0-2.5 1.5-2.5 3.5s1.5 2 2.5 2 2.5-.5 2.5-2S29 18 28 18z"
          fill="#4E342E"
          opacity="0.5"
        />
      </svg>
    ),
    tagColor: "#6D4C41",
    highlightKeys: ["zeroCal", "fdaGras"],
    hasCitation: false,
  },
];

/* ── Single Card Component ── */
function IngredientCard({
  ingredient,
}: {
  ingredient: (typeof INGREDIENTS)[number];
}) {
  const [expanded, setExpanded] = useState(false);
  const t = useTranslations("ingredients");

  return (
    <article className="ingredient-card group relative rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
        style={{
          background: `linear-gradient(90deg, ${ingredient.tagColor}, color-mix(in srgb, ${ingredient.tagColor} 60%, white))`,
        }}
      />

      <div className="p-6 sm:p-8">
        {/* Tag + Icon row */}
        <div className="flex items-start justify-between mb-5">
          <span
            className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{
              backgroundColor: `color-mix(in srgb, ${ingredient.tagColor} 10%, transparent)`,
              color: ingredient.tagColor,
            }}
          >
            {t(`cards.${ingredient.id}.tagLabel`)}
          </span>
          {ingredient.icon}
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-text-primary leading-snug mb-3">
          {t(`cards.${ingredient.id}.title`)}
        </h3>

        {/* Body */}
        <p className="text-body text-text-secondary leading-relaxed mb-4">
          {t(`cards.${ingredient.id}.body`)}
        </p>

        {/* Expandable detail */}
        <div
          className="grid transition-[grid-template-rows,opacity] duration-500 ease-out"
          style={{
            gridTemplateRows: expanded ? "1fr" : "0fr",
            opacity: expanded ? 1 : 0,
          }}
        >
          <div className="overflow-hidden">
            <div className="pb-4">
              <p className="text-body-sm text-text-tertiary leading-relaxed mb-2">
                {t(`cards.${ingredient.id}.detail`)}
              </p>
              {ingredient.hasCitation && (
                <p className="text-[11px] text-text-tertiary/60 italic">
                  — {t(`cards.${ingredient.id}.citation`)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Highlight pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {ingredient.highlightKeys.map((hKey) => (
            <div
              key={hKey}
              className="flex items-center gap-1.5 text-xs bg-bg-warm/60 rounded-lg px-3 py-2"
            >
              <span className="font-semibold text-text-primary">
                {t(`cards.${ingredient.id}.highlights.${hKey}.label`)}
              </span>
              <span className="text-text-tertiary">
                {t(`cards.${ingredient.id}.highlights.${hKey}.desc`)}
              </span>
            </div>
          ))}
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-body-sm font-medium transition-colors duration-200 hover:underline"
          style={{ color: ingredient.tagColor }}
          aria-expanded={expanded}
          aria-controls={`detail-${ingredient.id}`}
        >
          {expanded ? t("expandButton.collapse") : t("expandButton.expand")}
        </button>
      </div>
    </article>
  );
}

/* ═══════ Main Component ═══════ */
export default function IngredientCards() {
  const t = useTranslations("ingredients");

  /* ── Scroll animation hooks ── */
  const headlineRef = useScrollAnimation<HTMLHeadingElement>({
    from: { opacity: 0, y: 40 },
    duration: 1.1,
    ease: "power3.out",
  });

  const subRef = useScrollAnimation<HTMLParagraphElement>({
    from: { opacity: 0, y: 20 },
    duration: 0.85,
    ease: "power2.out",
    delay: 0.15,
  });

  const gridRef = useProgressiveReveal<HTMLDivElement>({
    childSelector: ".ingredient-card",
    stagger: 0.2,
    from: { opacity: 0, y: 48, scale: 0.96 },
    duration: 0.95,
    ease: "power2.out",
  });

  return (
    <section
      id="ingredient-cards"
      className="section-padding relative overflow-hidden"
    >
      {/* ═══════ Subtle Warm Background Texture ═══════ */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(250,244,234,0.6) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(248,244,251,0.4) 0%, transparent 50%)",
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
            <span className="text-gradient-warm">{t("headline.highlight")}</span> {t("headline.suffix")}
          </h2>

          <p
            ref={subRef}
            className="text-body-lg text-text-secondary max-w-[480px] mx-auto"
          >
            {t("subtitle")}
          </p>
        </div>

        {/* ── Ingredient Cards Grid ── */}
        <div
          ref={gridRef}
          className="grid md:grid-cols-3 gap-5 lg:gap-7"
        >
          {INGREDIENTS.map((ingredient) => (
            <IngredientCard key={ingredient.id} ingredient={ingredient} />
          ))}
        </div>
      </div>
    </section>
  );
}
