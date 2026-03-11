"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  useScrollAnimation,
  useProgressiveReveal,
} from "./scroll-hooks";

/* ─────────────────────────────────────────────────
   S2 — ElderberryStory
   Elderberry origin narrative with nutrition profile.

   Story arc:
   1. Headline — text-gradient reveal
   2. Elderberry transparent image
   3. Origin — Austrian Steiermark / Haschberg
   4. Anthocyanin comparison — animated bar chart
   5. Elderberry Nutrition Table — minerals & vitamins
   6. Bridge CTA — scroll to next section
   ───────────────────────────────────────────────── */

/* ── Anthocyanin data for animated chart ── */
const ANTHOCYANIN_DATA = [
  {
    labelKey: "anthocyanin.labels.elderberry",
    min: 600,
    max: 1400,
    color: "var(--color-elderberry)",
    gradientFrom: "var(--color-elderberry-light)",
    gradientTo: "var(--color-elderberry)",
  },
  {
    labelKey: "anthocyanin.labels.blueberry",
    min: 60,
    max: 300,
    color: "var(--color-elderberry-300)",
    gradientFrom: "var(--color-elderberry-200)",
    gradientTo: "var(--color-elderberry-300)",
  },
];

/* ── Nutrition data ── */
const MINERALS = [
  { nameKey: "nutritionTable.minerals.potassium", value: "280mg" },
  { nameKey: "nutritionTable.minerals.phosphorus", value: "39mg" },
  { nameKey: "nutritionTable.minerals.calcium", value: "38mg" },
  { nameKey: "nutritionTable.minerals.sodium", value: "6mg" },
  { nameKey: "nutritionTable.minerals.magnesium", value: "5mg" },
  { nameKey: "nutritionTable.minerals.iron", value: "1.6mg" },
  { nameKey: "nutritionTable.minerals.zinc", value: "0.11mg" },
];

const VITAMINS = [
  { nameKey: "nutritionTable.vitamins.vitaminC", value: "36mg" },
  { nameKey: "nutritionTable.vitamins.niacin", value: "0.5mg" },
  { nameKey: "nutritionTable.vitamins.pyridoxine", value: "0.23mg" },
  { nameKey: "nutritionTable.vitamins.thiamine", value: "0.07mg" },
  { nameKey: "nutritionTable.vitamins.riboflavin", value: "0.06mg" },
  { nameKey: "nutritionTable.vitamins.vitaminA", value: "30\u00B5g RE" },
  { nameKey: "nutritionTable.vitamins.folate", value: "6\u00B5g" },
];

/* ── Animated bar component ── */
function AnthocyaninBar({
  item,
  maxVal,
  inView,
}: {
  item: (typeof ANTHOCYANIN_DATA)[0];
  maxVal: number;
  inView: boolean;
}) {
  const t = useTranslations("elderberry");
  const widthPct = (item.max / maxVal) * 100;

  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-body font-semibold" style={{ color: item.color }}>
          {t(item.labelKey)}
        </span>
        <span className="text-body-sm text-text-secondary font-medium tabular-nums">
          {item.min.toLocaleString()}~{item.max.toLocaleString()}mg / 100g
        </span>
      </div>
      <div className="relative h-10 sm:h-12 rounded-xl overflow-hidden bg-elderberry-50/60">
        <div
          className="absolute inset-y-0 left-0 rounded-xl"
          style={{
            width: `${widthPct}%`,
            transform: inView ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "left",
            transition: "transform 1.6s ease-out 0.3s",
            background: `linear-gradient(90deg, ${item.gradientFrom}, ${item.gradientTo})`,
            willChange: "transform",
          }}
        />
        <div
          className="absolute inset-y-0 left-0 rounded-xl opacity-30"
          style={{
            width: `${widthPct}%`,
            transform: inView ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "left",
            transition: "transform 1.6s ease-out 0.3s",
            background:
              "linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)",
            backgroundSize: "200% 100%",
            animation: inView ? "shimmer 3s linear infinite 2s" : "none",
          }}
        />
      </div>
    </div>
  );
}

/* ── Nutrition row component ── */
function NutritionRow({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/[0.06] last:border-b-0">
      <span className="text-white/80 text-[0.9rem] sm:text-[0.95rem]">{name}</span>
      <span className="text-white font-semibold text-[0.9rem] sm:text-[0.95rem] tabular-nums">{value}</span>
    </div>
  );
}

export default function ElderberryStory() {
  const t = useTranslations("elderberry");
  const sectionRef = useRef<HTMLElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartInView, setChartInView] = useState(false);

  /* ── Scroll animation refs ── */
  const headlineRef = useScrollAnimation<HTMLHeadingElement>({
    from: { opacity: 0, y: 48 },
    duration: 1.2,
    ease: "power3.out",
  });

  const subRef = useScrollAnimation<HTMLParagraphElement>({
    from: { opacity: 0, y: 32 },
    duration: 1,
    delay: 0.15,
  });

  const originTitleRef = useScrollAnimation<HTMLHeadingElement>({
    from: { opacity: 0, y: 36 },
    duration: 1,
  });

  const originBodyRef = useScrollAnimation<HTMLDivElement>({
    from: { opacity: 0, y: 28 },
    duration: 0.9,
    delay: 0.1,
  });

  const chartTitleRef = useScrollAnimation<HTMLHeadingElement>({
    from: { opacity: 0, y: 36 },
    duration: 1,
  });

  const nutritionTitleRef = useScrollAnimation<HTMLHeadingElement>({
    from: { opacity: 0, y: 36 },
    duration: 1,
  });

  /* ── Anthocyanin chart IntersectionObserver ── */
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setChartInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(chart);
    return () => observer.disconnect();
  }, []);

  /* ── GSAP entrance for decorative orbs ── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.to(".elderberry-blob-1", {
        y: -20,
        x: 10,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".elderberry-blob-2", {
        y: 15,
        x: -12,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".elderberry-blob-3", {
        y: -12,
        x: -8,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const maxAnthocyanin = Math.max(...ANTHOCYANIN_DATA.map((d) => d.max));

  return (
    <section
      id="elderberry-story"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
    >
      {/* ═══════ Background Decorative Elements ═══════ */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="elderberry-blob-1 deco-blob deco-blob-elderberry absolute -top-[120px] -right-[100px] w-[400px] h-[400px]"
          style={{ opacity: 0.05 }}
        />
        <div
          className="elderberry-blob-2 deco-blob deco-blob-elderberry absolute top-[40%] -left-[120px] w-[320px] h-[320px]"
          style={{ opacity: 0.04 }}
        />
        <div
          className="elderberry-blob-3 deco-blob deco-blob-coral absolute bottom-[10%] right-[5%] w-[240px] h-[240px]"
          style={{ opacity: 0.03 }}
        />
      </div>

      <div className="section-inner relative z-10">
        {/* ═══════ 1. Opening Headline ═══════ */}
        <div className="text-center mb-10 sm:mb-14 lg:mb-16">
          <h2
            ref={headlineRef}
            className="font-bold text-text-primary leading-[1.2] tracking-[-0.025em] mb-5 lg:mb-6"
            style={{ fontSize: "var(--font-size-heading-xl)" }}
          >
            {t("headline.line1")}
            <br />
            <span className="text-gradient-elderberry">{t("headline.highlight")}</span>
          </h2>

          <p
            ref={subRef}
            className="text-body-lg text-text-secondary leading-relaxed max-w-[560px] mx-auto"
          >
            {t("subtitle")}
          </p>
        </div>

        {/* ═══════ 3. Elderberry Transparent Image ═══════ */}
        <div className="flex justify-center mb-14 sm:mb-18 lg:mb-24" data-reveal>
          <div className="relative w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] lg:w-[420px] lg:h-[420px]">
            <Image
              src="/ingredients/elderberry-transparent.png"
              alt={t("imageAlt")}
              fill
              className="object-contain drop-shadow-lg"
              sizes="(max-width: 640px) 280px, (max-width: 1024px) 360px, 420px"
              priority
            />
          </div>
        </div>

        {/* ═══════ 2. Origin Story ═══════ */}
        <div className="max-w-[800px] mx-auto mb-20 sm:mb-24 lg:mb-32">
          <div className="flex items-center gap-3 mb-4" data-reveal data-reveal-delay="0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-elderberry-50"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-elderberry-50), var(--color-elderberry-100))",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="10" cy="11" r="6" fill="var(--color-elderberry-300)" opacity="0.5" />
                <circle cx="7" cy="9" r="4" fill="var(--color-elderberry)" opacity="0.7" />
                <circle cx="13" cy="9" r="4" fill="var(--color-elderberry)" opacity="0.7" />
                <circle cx="10" cy="13" r="3.5" fill="var(--color-elderberry-dark)" opacity="0.6" />
                <path
                  d="M10 2 C10 2, 8 5, 10 7"
                  stroke="var(--color-green-dino)"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span
              className="badge badge-elderberry"
              style={{ fontSize: "var(--font-size-caption)" }}
            >
              {t("origin.badge")}
            </span>
          </div>

          <h3
            ref={originTitleRef}
            className="font-bold text-text-primary leading-[1.25] tracking-[-0.02em] mb-4"
            style={{ fontSize: "var(--font-size-heading-md)" }}
          >
            {t("origin.title.line1")}
            <br />
            {t("origin.title.line2")}
          </h3>

          <div ref={originBodyRef} className="text-body text-text-secondary leading-[1.85] space-y-4">
            <p>{t("origin.body1")}</p>
            <p>{t("origin.body2")}</p>
          </div>

          {/* Origin image */}
          <div className="mt-8" data-reveal data-reveal-delay="0.15">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/ingredients/elderberry-2.png"
                alt={t("origin.imageAlt")}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 800px"
              />
            </div>
          </div>
        </div>

        {/* ═══════ 3. Anthocyanin Comparison ═══════ */}
        <div className="max-w-[800px] mx-auto mb-20 sm:mb-24 lg:mb-32">
          <div className="flex items-center gap-3 mb-4" data-reveal>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-elderberry-50), var(--color-elderberry-100))",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <rect x="3" y="10" width="4" height="7" rx="1" fill="var(--color-elderberry-300)" />
                <rect x="8" y="6" width="4" height="11" rx="1" fill="var(--color-elderberry)" />
                <rect x="13" y="3" width="4" height="14" rx="1" fill="var(--color-elderberry-dark)" />
              </svg>
            </div>
            <span className="badge badge-elderberry text-caption">
              {t("anthocyanin.badge")}
            </span>
          </div>

          <h3
            ref={chartTitleRef}
            className="font-bold text-text-primary leading-[1.25] tracking-[-0.02em] mb-3"
            style={{ fontSize: "var(--font-size-heading-md)" }}
          >
            {t("anthocyanin.title")}
          </h3>

          <p
            className="text-body text-text-secondary leading-[1.85] mb-8"
            data-reveal
          >
            {t("anthocyanin.intro")}
          </p>

          {/* Animated bar chart */}
          <div
            ref={chartRef}
            className="card-surface p-6 sm:p-8 mb-3"
          >
            {ANTHOCYANIN_DATA.map((item) => (
              <AnthocyaninBar
                key={item.labelKey}
                item={item}
                maxVal={maxAnthocyanin}
                inView={chartInView}
              />
            ))}

            <div className="flex justify-between mt-4 pt-3 border-t border-border-subtle">
              <span className="text-caption text-text-tertiary">0</span>
              <span className="text-caption text-text-tertiary">{t("anthocyanin.chartUnit")}</span>
              <span className="text-caption text-text-tertiary">1,400</span>
            </div>
          </div>

          <p className="text-[11px] text-text-tertiary/70 text-right mb-6">
            {t("anthocyanin.citation")}
          </p>

          {/* Anthocyanin explanation paragraph */}
          <div className="card-surface p-5 sm:p-6" data-reveal>
            <p className="text-body-sm text-text-secondary leading-[1.9]">
              <strong className="text-text-primary">{t("anthocyanin.explanationKeyword")}</strong>
              {t("anthocyanin.explanation").slice(t("anthocyanin.explanationKeyword").length)}
            </p>
          </div>
        </div>

        {/* ═══════ 4. Elderberry Nutrition Table ═══════ */}
        <div className="max-w-[800px] mx-auto mb-14 sm:mb-16">
          <div className="flex items-center gap-3 mb-4" data-reveal>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-elderberry-50), var(--color-elderberry-100))",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="10" cy="10" r="7" fill="none" stroke="var(--color-elderberry)" strokeWidth="1.5" />
                <circle cx="10" cy="10" r="3" fill="var(--color-elderberry)" opacity="0.5" />
                <path d="M10 3v2M10 15v2M3 10h2M15 10h2" stroke="var(--color-elderberry-dark)" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="badge badge-elderberry text-caption">
              {t("nutritionTable.badge")}
            </span>
          </div>

          <h3
            ref={nutritionTitleRef}
            className="font-bold text-text-primary leading-[1.25] tracking-[-0.02em] mb-8"
            style={{ fontSize: "var(--font-size-heading-md)" }}
          >
            {t("nutritionTable.title")}
          </h3>

          {/* Nutrition Table Card */}
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #3D1A5C 0%, #5B2E8C 40%, #7B42B8 100%)",
            }}
            data-reveal
          >
            {/* Decorative subtle glow */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(190,160,240,0.15) 0%, transparent 70%)",
              }}
              aria-hidden="true"
            />

            <div className="relative z-10 p-6 sm:p-8 lg:p-10">
              {/* Center badge — visible on mobile at top */}
              <div className="flex justify-center mb-8 sm:hidden">
                <div
                  className="w-[140px] h-[140px] rounded-full flex items-center justify-center text-center"
                  style={{
                    background: "radial-gradient(circle, rgba(190,160,240,0.2) 0%, rgba(190,160,240,0.05) 100%)",
                    border: "2px solid rgba(190,160,240,0.25)",
                  }}
                >
                  <div>
                    <p className="text-white font-bold text-[1rem] leading-tight">
                      {t("nutritionTable.centerBadge.line1")}
                    </p>
                    <p className="text-white font-bold text-[1rem] leading-tight">
                      {t("nutritionTable.centerBadge.line2")}
                    </p>
                    <p className="text-white font-bold text-[1rem] leading-tight">
                      {t("nutritionTable.centerBadge.line3")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Two columns on mobile, three on desktop */}
              <div className="grid grid-cols-2 sm:grid-cols-[1fr_auto_1fr] gap-4 sm:gap-6 lg:gap-10 items-start">
                {/* Minerals Column */}
                <div>
                  <div className="mb-4 sm:mb-5">
                    <h4
                      className="font-bold text-[0.85rem] sm:text-[0.95rem] tracking-[0.15em] uppercase"
                      style={{ color: "#E8734A" }}
                    >
                      Minerals
                    </h4>
                    <p className="text-white/40 text-[0.75rem] mt-0.5">{t("nutritionTable.perUnit")}</p>
                  </div>
                  <div>
                    {MINERALS.map((m) => (
                      <NutritionRow key={m.nameKey} name={t(m.nameKey)} value={m.value} />
                    ))}
                  </div>
                </div>

                {/* Center Badge — desktop only */}
                <div className="hidden sm:flex items-center justify-center self-center">
                  <div
                    className="w-[160px] h-[160px] lg:w-[190px] lg:h-[190px] rounded-full flex items-center justify-center text-center"
                    style={{
                      background: "radial-gradient(circle, rgba(190,160,240,0.2) 0%, rgba(190,160,240,0.05) 100%)",
                      border: "2px solid rgba(190,160,240,0.25)",
                    }}
                  >
                    <div>
                      <p className="text-white font-bold text-[1.1rem] lg:text-[1.25rem] leading-tight">
                        {t("nutritionTable.centerBadge.line1")}
                      </p>
                      <p className="text-white font-bold text-[1.1rem] lg:text-[1.25rem] leading-tight">
                        {t("nutritionTable.centerBadge.line2")}
                      </p>
                      <p className="text-white font-bold text-[1.1rem] lg:text-[1.25rem] leading-tight">
                        {t("nutritionTable.centerBadge.line3")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Vitamins Column */}
                <div>
                  <div className="mb-4 sm:mb-5 sm:text-right">
                    <h4
                      className="font-bold text-[0.85rem] sm:text-[0.95rem] tracking-[0.15em] uppercase"
                      style={{ color: "#E8734A" }}
                    >
                      Vitamins
                    </h4>
                    <p className="text-white/40 text-[0.75rem] mt-0.5">{t("nutritionTable.perUnit")}</p>
                  </div>
                  <div>
                    {VITAMINS.map((v) => (
                      <NutritionRow key={v.nameKey} name={t(v.nameKey)} value={v.value} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Source citation */}
          <p className="text-[11px] text-text-tertiary/70 text-right mt-3">
            {t("nutritionTable.citation")}
          </p>
        </div>

        {/* ═══════ Section Disclaimer ═══════ */}
        <div className="text-center" data-reveal>
          <p className="text-caption text-text-primary">
            {t("disclaimer")}
          </p>
        </div>
      </div>
    </section>
  );
}
