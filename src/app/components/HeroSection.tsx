"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import gsap from "gsap";

/* ─────────────────────────────────────────────────
   S1 — HeroSection
   Apple-level premium hero with cinematic entrance.

   Design approach:
   - Dark elderberry gradient background
   - Three transparent PNG products side by side
   - Bounds-aware positioning: each product's visible
     (non-transparent) pixels are aligned to equal height
     with equal visible-edge gaps
   - Staggered GSAP entrance (double-rAF pattern)
   - 2-col desktop / stacked mobile
   ───────────────────────────────────────────────── */

/* ── Product data with visible-pixel bounding boxes ──
   All PNGs are 1772×1772 with transparent backgrounds.
   bbox = actual visible (non-transparent) pixel region
   from canvas alpha-channel analysis (alpha > 10).
   Used to align visible products at equal height with equal gaps. */
const CANVAS = 1772;
const VIS_GAP = 6; // px gap between visible product edges

const PRODUCTS = [
  {
    src: "/products/syrup-box-transparent.png",
    altKey: "products.syrup",
    bbox: { minX: 652, minY: 133, maxX: 1119, maxY: 1638 },
    zIndex: 2,
  },
  {
    src: "/products/stick-transparent.png",
    altKey: "products.stick",
    bbox: { minX: 477, minY: 153, maxX: 1295, maxY: 1618 },
    zIndex: 3,
  },
  {
    src: "/products/jjayo-40pack-transparent.png",
    altKey: "products.jjayo",
    bbox: { minX: 437, minY: 133, maxX: 1334, maxY: 1638 },
    zIndex: 2,
  },
];

/* ── Position computation engine ──
   Sizes each product so visible height = stageH,
   aligns visible tops/bottoms, spaces with equal visible gaps.
   Allows controlled overflow beyond the stage column. */
interface ProductPos {
  left: number;
  top: number;
  size: number;
  zIndex: number;
}

function computePositions(
  stageW: number,
  stageH: number
): ProductPos[] | null {
  if (stageW <= 0 || stageH <= 0) return null;

  /* Responsive overflow strategy:
     Desktop (≥600px): allow 40% overflow for maximum product size
     Mobile  (<600px): no overflow, all products fully visible */
  const isMobile = stageW < 600;

  /* Per-product metrics at target visible height = stageH */
  const items = PRODUCTS.map((p) => {
    const visH = p.bbox.maxY - p.bbox.minY;
    const visW = p.bbox.maxX - p.bbox.minX;
    /* Square container size so visible height fills stageH */
    const rendered = (stageH * CANVAS) / visH;
    return {
      visWidthPx: (visW / CANVAS) * rendered,
      topPad: (p.bbox.minY / CANVAS) * rendered,
      leftPad: (p.bbox.minX / CANVAS) * rendered,
      rendered,
      zIndex: p.zIndex,
    };
  });

  /* Total width of visible product content + gaps */
  const totalVisW = items.reduce((s, it) => s + it.visWidthPx, 0);
  const totalNeeded = totalVisW + VIS_GAP * (PRODUCTS.length - 1);

  /* Desktop: allow overflow for larger products
     Mobile: fit within stage width to keep all products visible */
  const maxW = isMobile ? stageW : stageW * 1.4;
  const scale = totalNeeded > maxW ? maxW / totalNeeded : 1;

  /* On mobile, center products vertically in the stage
     On desktop, align visible top with stage top (matches badge position) */
  const actualVisH = stageH * scale;
  const yOffset = isMobile ? (stageH - actualVisH) / 2 : 0;

  /* Layout: center the scaled composition horizontally */
  const compositionW = totalNeeded * scale;
  let x = (stageW - compositionW) / 2;

  return items.map((it) => {
    const sVisW = it.visWidthPx * scale;
    const sRendered = it.rendered * scale;
    const sTopPad = it.topPad * scale;
    const sLeftPad = it.leftPad * scale;

    /* Container positioned so visible product aligns:
       - visible top at y=yOffset (stage top on desktop, centered on mobile)
       - visible left at current x cursor */
    const pos: ProductPos = {
      left: x - sLeftPad,
      top: -sTopPad + yOffset,
      size: sRendered,
      zIndex: it.zIndex,
    };

    x += sVisW + VIS_GAP * scale;
    return pos;
  });
}

export default function HeroSection() {
  const t = useTranslations("hero");
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<ProductPos[] | null>(null);

  /* ── Responsive position recomputation ── */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    // Use contentRect from ResizeObserver entries (avoids forced synchronous layout)
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) {
        setPositions(computePositions(width, height));
      }
    });
    ro.observe(stage);

    return () => ro.disconnect();
  }, []);

  /* ── GSAP entrance animations ── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let ctx: gsap.Context | undefined;
    let raf2Id: number | undefined;

    /* Double-rAF — entrance after first paint */
    const raf1 = requestAnimationFrame(() => {
      raf2Id = requestAnimationFrame(() => {
        ctx = gsap.context(() => {
          /* ── Set initial hidden state ── */
          gsap.set(".hero-badge", { opacity: 0, y: 14, scale: 0.92 });
          gsap.set(".hero-headline", { opacity: 0, y: 44 });
          gsap.set(".hero-sub", { opacity: 0, y: 28 });
          gsap.set(".hero-product-stage", {
            opacity: 0,
            scale: 0.88,
            /* filter: blur removed — animating blur on 3 product images causes heavy repaint */
          });
          gsap.set(".hero-body", { opacity: 0, y: 18 });
          gsap.set(".hero-cta", { opacity: 0, y: 18 });
          gsap.set(".hero-scroll-hint", { opacity: 0, y: -8 });

          /* ── Staggered entrance timeline ── */
          const tl = gsap.timeline({
            defaults: { ease: "power3.out" },
          });

          tl.to(".hero-badge", {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.1,
            duration: 0.55,
          })
            .to(
              ".hero-headline",
              { opacity: 1, y: 0, duration: 1.1 },
              "-=0.25"
            )
            .to(
              ".hero-sub",
              { opacity: 1, y: 0, stagger: 0.08, duration: 0.85 },
              "-=0.6"
            )
            .to(
              ".hero-product-stage",
              {
                opacity: 1,
                scale: 1,
                duration: 1.4,
                ease: "power2.out",
              },
              "-=0.55"
            )
            .to(
              ".hero-body",
              { opacity: 1, y: 0, duration: 0.75 },
              "-=0.25"
            )
            .to(
              ".hero-cta",
              { opacity: 1, y: 0, stagger: 0.1, duration: 0.55 },
              "-=0.3"
            )
            .to(
              ".hero-scroll-hint",
              { opacity: 1, y: 0, duration: 0.55 },
              "-=0.15"
            );

          /* ── Breathing glow on product ── */
          gsap.to(".hero-glow-pulse", {
            scale: 1.08,
            opacity: 0.65,
            duration: 3.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });

          /* ── Scroll indicator dot bounce ── */
          gsap.to(".hero-scroll-dot", {
            y: 6,
            opacity: 0.8,
            duration: 0.9,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }, section);
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      if (raf2Id) cancelAnimationFrame(raf2Id);
      ctx?.revert();
    };
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="section-dark min-h-screen relative overflow-hidden"
    >
      {/* ═══════ Background Decorative Orbs ═══════ */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="absolute -top-[260px] -right-[180px] w-[640px] h-[640px] rounded-full opacity-50"
          style={{
            background:
              "radial-gradient(circle, rgba(91,46,140,0.28) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-[180px] -left-[160px] w-[480px] h-[480px] rounded-full opacity-35"
          style={{
            background:
              "radial-gradient(circle, rgba(232,115,74,0.14) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-[45%] left-[55%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(circle, rgba(91,46,140,0.18) 0%, transparent 55%)",
          }}
        />
      </div>

      {/* ═══════ Main Hero Content ═══════ */}
      <div className="section-inner relative z-10 min-h-screen flex items-center">
        <div className="w-full grid lg:grid-cols-2 gap-6 lg:gap-10 xl:gap-14 items-center py-24 lg:py-0">
          {/* ─── Left Column: Text ─── */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Badges */}
            <div className="flex gap-2.5 justify-center lg:justify-start mb-5 lg:mb-7">
              <span className="hero-badge badge badge-glass">{t("badges.pharmacyOnly")}</span>
              <span className="hero-badge badge badge-glass">{t("badges.fromAge1")}</span>
            </div>

            {/* ── Headcopy ── */}
            <h1 className="hero-headline font-bold text-white leading-[1.15] tracking-[-0.025em] mb-4 lg:mb-5 text-[clamp(1.85rem,4.5vw,3rem)]">
              {t("headline.line1")}
              <br className="hidden lg:inline" />
              {" "}{t("headline.line2")}
              <br />
              <span className="text-gradient-warm">{t("headline.highlight")}</span>
              {t("headline.suffix")}
            </h1>

            {/* ── Subcopy ── */}
            <p className="hero-sub text-body-lg text-white/60 leading-relaxed mb-3">
              {t("subcopy.ingredients")}
            </p>
            <p className="hero-sub text-body-lg text-white/80 font-medium leading-relaxed mb-5 lg:mb-6">
              {t("subcopy.description")}
            </p>

            {/* ── Body text ── */}
            <p className="hero-body text-body text-white/50 leading-[1.75] mb-7 lg:mb-9 max-w-[480px] mx-auto lg:mx-0">
              {t("body.line1")}
              <br className="hidden sm:block" />
              {t("body.line2")}
              <br className="hidden sm:block" />
              {t("body.line3")}
            </p>

            {/* ── CTA Buttons ── */}
            <div className="flex flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <a href="#ingredient-cards" className="hero-cta btn-primary">
                {t("cta.viewIngredients")}
              </a>
              <a href="#pharmacy-finder" className="hero-cta btn-glass">
                {t("cta.findPharmacy")}
              </a>
            </div>
          </div>

          {/* ─── Right Column: 3 Products — Bounds-Aware Positioning ─── */}
          <div className="relative order-1 lg:order-2 flex items-center justify-center lg:self-stretch">
            <div
              ref={stageRef}
              className="hero-product-stage relative w-full h-[360px] sm:h-[440px] lg:h-full"
            >
              {/* ── Product spotlight glow ── */}
              <div
                className="hero-glow-pulse absolute -inset-[15%] rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 55%, rgba(250,244,234,0.08) 0%, rgba(123,78,172,0.05) 40%, transparent 70%)",
                }}
              />

              {/* ── Products — computed absolute positions ──
                  Each container is a square sized so the visible (non-transparent)
                  product height fills the stage height. Containers overlap in their
                  transparent areas; visible products are spaced with equal gaps. */}
              <div className="relative z-10 w-full h-full">
                {positions?.map((pos, i) => (
                  <div
                    key={PRODUCTS[i].altKey}
                    className="absolute"
                    style={{
                      left: pos.left,
                      top: pos.top,
                      width: pos.size,
                      height: pos.size,
                      zIndex: pos.zIndex,
                    }}
                  >
                    <Image
                      src={PRODUCTS[i].src}
                      alt={t(PRODUCTS[i].altKey)}
                      fill
                      priority
                      sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 35vw"
                      className="object-contain
                        drop-shadow-[0_16px_48px_rgba(0,0,0,0.4)]
                        drop-shadow-[0_4px_12px_rgba(91,46,140,0.12)]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ Scroll Indicator ═══════ */}
      <div className="hero-scroll-hint absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
        <span className="text-white/20 text-[9px] tracking-[0.2em] uppercase font-medium">
          {t("scrollHint")}
        </span>
        <div className="w-[18px] h-7 border border-white/[0.12] rounded-full flex justify-center pt-1.5">
          <div className="hero-scroll-dot w-[3px] h-[6px] rounded-full bg-white/25" />
        </div>
      </div>
    </section>
  );
}
