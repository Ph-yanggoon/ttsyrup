"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getScrollVelocity } from "./ScrollEngine";

/* ─────────────────────────────────────────────────
   scroll-hooks.ts — Premium Animation Hook Library

   Apple-level scroll-driven animation hooks.
   Each hook manages its own GSAP/Observer lifecycle
   and cleans up on unmount.

   Usage: import individual hooks in each section
   component for cinematic scroll interactions.
   ───────────────────────────────────────────────── */

// ── Mobile breakpoint for disabling heavy effects ──
const MOBILE_BP = 767;
function isMobile(): boolean {
  return typeof window !== "undefined" && window.innerWidth <= MOBILE_BP;
}

/* ══════════════════════════════════════════════════
   1. useScrollAnimation
   ──────────────────────────────────────────────────
   Basic GSAP ScrollTrigger animation.
   Triggers once when element enters viewport.

   Usage:
     const ref = useScrollAnimation<HTMLDivElement>({
       from: { opacity: 0, y: 60 },
       duration: 1.2,
       ease: "power3.out",
     });

   <div ref={ref}>content</div>
   ══════════════════════════════════════════════════ */

interface ScrollAnimationOptions {
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  duration?: number;
  ease?: string;
  delay?: number;
  start?: string;
  toggleActions?: string;
  markers?: boolean;
}

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: ScrollAnimationOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      from = { opacity: 0, y: 40 },
      to,
      duration = 1,
      ease = "power3.out",
      delay = 0,
      start = "top 85%",
      toggleActions = "play none none none",
      markers = false,
    } = options;

    // Always use fromTo for reliable ScrollTrigger behavior
    // Note: filter removed from default — avoids unnecessary filter compositing on 13+ instances
    const toVars = to || { opacity: 1, y: 0, scale: 1 };
    const tween = gsap.fromTo(el, { ...from, immediateRender: false }, {
      ...toVars,
      duration,
      ease,
      delay,
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions,
        once: true,
        markers,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return ref;
}

/* ══════════════════════════════════════════════════
   2. useScrubAnimation
   ──────────────────────────────────────────────────
   Scroll-position-linked continuous animation.
   Apple's signature: elements morph as you scroll.

   The animation progress is scrubbed (0→1) based
   on scroll position relative to the trigger.

   Usage:
     const ref = useScrubAnimation<HTMLDivElement>({
       from: { scale: 0.8, opacity: 0.3 },
       to: { scale: 1, opacity: 1 },
       scrub: 1.5,
     });

   <div ref={ref}>scales up as you scroll</div>
   ══════════════════════════════════════════════════ */

interface ScrubAnimationOptions {
  from: gsap.TweenVars;
  to: gsap.TweenVars;
  scrub?: number | boolean;
  start?: string;
  end?: string;
  markers?: boolean;
}

export function useScrubAnimation<T extends HTMLElement = HTMLDivElement>(
  options: ScrubAnimationOptions
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      from,
      to,
      scrub = 1,
      start = "top 80%",
      end = "top 20%",
      markers = false,
    } = options;

    const tween = gsap.fromTo(el, from, {
      ...to,
      scrollTrigger: {
        trigger: el,
        start,
        end,
        scrub,
        markers,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return ref;
}

/* ══════════════════════════════════════════════════
   3. useParallax
   ──────────────────────────────────────────────────
   Parallax depth effect — element moves at
   different speed than scroll.

   Auto-disabled on mobile for performance.

   Usage:
     const ref = useParallax<HTMLImageElement>({
       speed: -0.3,  // negative = slower than scroll
     });

   <img ref={ref} src="..." />
   ══════════════════════════════════════════════════ */

interface ParallaxOptions {
  speed?: number;
  start?: string;
  end?: string;
}

export function useParallax<T extends HTMLElement = HTMLDivElement>(
  options: ParallaxOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || isMobile()) return;

    const { speed = -0.3, start = "top bottom", end = "bottom top" } = options;

    const tween = gsap.to(el, {
      y: () => speed * 200,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start,
        end,
        scrub: 0.5,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return ref;
}

/* ══════════════════════════════════════════════════
   4. useTextReveal
   ──────────────────────────────────────────────────
   Word-by-word or char-by-char text reveal.
   Apple's cinematic text entrance.

   Splits text into spans using safe DOM methods
   and staggers their appearance with
   opacity + y-translate.

   Usage:
     const ref = useTextReveal<HTMLHeadingElement>({
       splitBy: "word",   // "word" | "char"
       stagger: 0.06,
       y: 20,
     });

   <h2 ref={ref}>하루 한 번의 건강 습관</h2>
   ══════════════════════════════════════════════════ */

interface TextRevealOptions {
  splitBy?: "word" | "char";
  stagger?: number;
  y?: number;
  duration?: number;
  ease?: string;
  start?: string;
  delay?: number;
}

export function useTextReveal<T extends HTMLElement = HTMLHeadingElement>(
  options: TextRevealOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      splitBy = "word",
      stagger = 0.05,
      y = 24,
      duration = 0.8,
      ease = "power3.out",
      start = "top 85%",
      delay = 0,
    } = options;

    // Store original child nodes for cleanup
    const originalNodes = Array.from(el.childNodes).map((n) => n.cloneNode(true));
    const text = el.textContent || "";

    // Clear element and build spans using safe DOM methods
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }

    let units: string[];
    if (splitBy === "char") {
      units = text.split("");
    } else {
      units = text.split(/(\s+)/); // Preserve whitespace
    }

    const spans: HTMLSpanElement[] = [];

    units.forEach((unit) => {
      if (/^\s+$/.test(unit)) {
        // Whitespace — append as text node
        el.appendChild(document.createTextNode(unit));
      } else {
        const span = document.createElement("span");
        span.className = "sr-unit";
        span.style.display = "inline-block";
        span.style.opacity = "0";
        span.style.transform = `translateY(${y}px)`;
        span.textContent = unit;
        el.appendChild(span);
        spans.push(span);
      }
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: "play none none none",
        once: true,
      },
    });

    tl.to(spans, {
      opacity: 1,
      y: 0,
      duration,
      ease,
      stagger,
      delay,
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      // Restore original content
      while (el.firstChild) {
        el.removeChild(el.firstChild);
      }
      originalNodes.forEach((node) => el.appendChild(node));
    };
  }, []);

  return ref;
}

/* ══════════════════════════════════════════════════
   5. usePinSection
   ──────────────────────────────────────────────────
   Pins a section to viewport during scroll.
   Returns progress (0→1) for internal animations.

   Auto-disabled on mobile — returns progress=0.

   Usage:
     const { ref, progress } = usePinSection({
       pinSpacerHeight: "200vh",
     });

   <section ref={ref}>
     <div style={{ opacity: progress }}>
       fades in as you scroll through
     </div>
   </section>
   ══════════════════════════════════════════════════ */

interface PinSectionOptions {
  pinSpacerHeight?: string;
  start?: string;
  markers?: boolean;
}

export function usePinSection<T extends HTMLElement = HTMLElement>(
  options: PinSectionOptions = {}
) {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || isMobile()) return;

    const {
      pinSpacerHeight = "200vh",
      start = "top top",
      markers = false,
    } = options;

    const st = ScrollTrigger.create({
      trigger: el,
      start,
      end: `+=${pinSpacerHeight}`,
      pin: true,
      scrub: true,
      markers,
      onUpdate: (self) => {
        setProgress(self.progress);
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  return { ref, progress };
}

/* ══════════════════════════════════════════════════
   6. useProgressiveReveal
   ──────────────────────────────────────────────────
   Staggered children reveal — for card grids,
   ingredient lists, feature rows.

   Each child element fades in sequentially.

   Usage:
     const ref = useProgressiveReveal<HTMLDivElement>({
       stagger: 0.12,
       childSelector: ".card",
     });

   <div ref={ref}>
     <div className="card">A</div>
     <div className="card">B</div>
   </div>
   ══════════════════════════════════════════════════ */

interface ProgressiveRevealOptions {
  childSelector?: string;
  stagger?: number;
  from?: gsap.TweenVars;
  duration?: number;
  ease?: string;
  start?: string;
}

export function useProgressiveReveal<T extends HTMLElement = HTMLDivElement>(
  options: ProgressiveRevealOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      childSelector = ":scope > *",
      stagger = 0.1,
      from = { opacity: 0, y: 32, scale: 0.97 },
      duration = 0.8,
      ease = "power3.out",
      start = "top 80%",
    } = options;

    const children = el.querySelectorAll(childSelector);
    if (children.length === 0) return;

    // Use fromTo for reliable ScrollTrigger behavior
    const tween = gsap.fromTo(children,
      { ...from, immediateRender: false },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration,
        ease,
        stagger,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none none",
          once: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return ref;
}

/* ══════════════════════════════════════════════════
   7. useCountUp
   ──────────────────────────────────────────────────
   Number counter animation — triggers when
   element enters viewport.

   Usage:
     const ref = useCountUp<HTMLSpanElement>({
       target: 1400,
       suffix: "mg",
       duration: 2,
     });

   <span ref={ref}>0</span>
   ══════════════════════════════════════════════════ */

interface CountUpOptions {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  separator?: boolean;
  start?: string;
}

export function useCountUp<T extends HTMLElement = HTMLSpanElement>(
  options: CountUpOptions
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      target,
      duration = 2,
      prefix = "",
      suffix = "",
      decimals = 0,
      separator = true,
      start = "top 85%",
    } = options;

    const obj = { value: 0 };

    const tween = gsap.to(obj, {
      value: target,
      duration,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: "play none none none",
        once: true,
      },
      onUpdate: () => {
        const formatted = decimals > 0
          ? obj.value.toFixed(decimals)
          : Math.round(obj.value).toString();

        const withSeparator = separator
          ? Number(formatted).toLocaleString("ko-KR", {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })
          : formatted;

        el.textContent = `${prefix}${withSeparator}${suffix}`;
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return ref;
}

/* ══════════════════════════════════════════════════
   8. useFadeOnScroll
   ──────────────────────────────────────────────────
   Apple-style dual-phase fade:
   - Phase 1: fade IN as element enters
   - Phase 2: fade OUT as element exits (optional)

   Creates a cinematic "window" of visibility.

   Usage:
     const ref = useFadeOnScroll<HTMLDivElement>({
       fadeOut: true,
     });

   <div ref={ref}>visible only while in view</div>
   ══════════════════════════════════════════════════ */

interface FadeOnScrollOptions {
  fadeOut?: boolean;
  scrub?: number;
  start?: string;
  end?: string;
}

export function useFadeOnScroll<T extends HTMLElement = HTMLDivElement>(
  options: FadeOnScrollOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      fadeOut = false,
      scrub = 1,
      start = "top 80%",
      end = "bottom 20%",
    } = options;

    if (fadeOut) {
      // Dual-phase: fade in → visible → fade out
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start,
          end,
          scrub,
        },
      });

      tl.fromTo(
        el,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.4 }
      ).to(el, { opacity: 0, y: -30, duration: 0.4 }, 0.6);

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    } else {
      // Single-phase: fade in and stay
      const tween = gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: el,
            start,
            end: "top 40%",
            scrub,
          },
        }
      );

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    }
  }, []);

  return ref;
}

/* ══════════════════════════════════════════════════
   9. useScrollVelocity
   ──────────────────────────────────────────────────
   Returns a ref that always holds the current
   scroll velocity (px/sec). Uses the shared
   velocity tracker from ScrollEngine.

   Usage:
     const velocity = useScrollVelocity();

     // In a GSAP callback or animation:
     const speed = velocity.current; // px/sec
   ══════════════════════════════════════════════════ */

export function useScrollVelocity() {
  const velocity = useRef(0);

  useEffect(() => {
    const update = () => {
      velocity.current = getScrollVelocity();
    };

    gsap.ticker.add(update);
    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return velocity;
}

/* ══════════════════════════════════════════════════
   10. useTimelineOnScroll
   ──────────────────────────────────────────────────
   GSAP timeline linked to scroll with optional pin.
   Most powerful hook — for complex multi-step
   cinematic sequences.

   Usage:
     const ref = useTimelineOnScroll<HTMLElement>({
       pin: true,
       end: "+=300%",
       buildTimeline: (tl, el) => {
         tl.from(el.querySelector(".step1"), { opacity: 0, y: 40 })
           .from(el.querySelector(".step2"), { opacity: 0, y: 40 })
           .from(el.querySelector(".step3"), { opacity: 0, y: 40 });
       },
     });

   <section ref={ref}>
     <div className="step1">...</div>
     <div className="step2">...</div>
     <div className="step3">...</div>
   </section>
   ══════════════════════════════════════════════════ */

interface TimelineOnScrollOptions {
  buildTimeline: (tl: gsap.core.Timeline, el: HTMLElement) => void;
  pin?: boolean;
  scrub?: number | boolean;
  start?: string;
  end?: string;
  markers?: boolean;
}

export function useTimelineOnScroll<T extends HTMLElement = HTMLElement>(
  options: TimelineOnScrollOptions
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      buildTimeline,
      pin = false,
      scrub = 1,
      start = "top top",
      end = "+=200%",
      markers = false,
    } = options;

    // Disable pin on mobile for performance
    const shouldPin = pin && !isMobile();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start,
        end,
        pin: shouldPin,
        scrub,
        markers,
      },
    });

    buildTimeline(tl, el);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return ref;
}

/* ══════════════════════════════════════════════════
   11. useHorizontalScroll
   ──────────────────────────────────────────────────
   Converts vertical scroll into horizontal movement.
   Apple's product showcase pattern.

   Auto-disabled on mobile (stacks vertically).

   Usage:
     const ref = useHorizontalScroll<HTMLDivElement>({
       panelSelector: ".panel",
     });

   <div ref={ref} style={{ display: "flex" }}>
     <div className="panel">1</div>
     <div className="panel">2</div>
     <div className="panel">3</div>
   </div>
   ══════════════════════════════════════════════════ */

interface HorizontalScrollOptions {
  panelSelector?: string;
  scrub?: number;
  markers?: boolean;
}

export function useHorizontalScroll<T extends HTMLElement = HTMLDivElement>(
  options: HorizontalScrollOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || isMobile()) return;

    const {
      panelSelector = ":scope > *",
      scrub = 1,
      markers = false,
    } = options;

    const panels = el.querySelectorAll(panelSelector);
    if (panels.length <= 1) return;

    const totalWidth = el.scrollWidth - window.innerWidth;

    const tween = gsap.to(el, {
      x: -totalWidth,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top top",
        end: () => `+=${totalWidth}`,
        pin: true,
        scrub,
        markers,
        anticipatePin: 1,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return ref;
}

/* ══════════════════════════════════════════════════
   12. useBlurReveal
   ──────────────────────────────────────────────────
   Apple's signature blur-to-clear reveal.
   Element starts blurred and clears as it
   enters the viewport.

   Usage:
     const ref = useBlurReveal<HTMLDivElement>({
       blurAmount: 8,
     });

   <div ref={ref}>crispy clear on scroll</div>
   ══════════════════════════════════════════════════ */

interface BlurRevealOptions {
  blurAmount?: number;
  duration?: number;
  y?: number;
  scale?: number;
  start?: string;
  scrub?: number | boolean;
}

export function useBlurReveal<T extends HTMLElement = HTMLDivElement>(
  options: BlurRevealOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      blurAmount = 6,
      duration = 1,
      y = 40,
      scale = 0.96,
      start = "top 85%",
      scrub = false,
    } = options;

    if (scrub) {
      const tween = gsap.fromTo(
        el,
        { filter: `blur(${blurAmount}px)`, opacity: 0, y, scale },
        {
          filter: "blur(0px)",
          opacity: 1,
          y: 0,
          scale: 1,
          scrollTrigger: {
            trigger: el,
            start,
            end: "top 30%",
            scrub: typeof scrub === "number" ? scrub : 1,
          },
        }
      );

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    } else {
      const tween = gsap.fromTo(el,
        { filter: `blur(${blurAmount}px)`, opacity: 0, y, scale, immediateRender: false },
        {
          filter: "blur(0px)",
          opacity: 1,
          y: 0,
          scale: 1,
          duration,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: "play none none none",
            once: true,
          },
        }
      );

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    }
  }, []);

  return ref;
}

/* ══════════════════════════════════════════════════
   13. useScaleOnScroll
   ──────────────────────────────────────────────────
   Scale transformation linked to scroll.
   Great for hero images that zoom in/out
   as user scrolls.

   Usage:
     const ref = useScaleOnScroll<HTMLDivElement>({
       fromScale: 1.15,
       toScale: 1,
     });
   ══════════════════════════════════════════════════ */

interface ScaleOnScrollOptions {
  fromScale?: number;
  toScale?: number;
  scrub?: number;
  start?: string;
  end?: string;
}

export function useScaleOnScroll<T extends HTMLElement = HTMLDivElement>(
  options: ScaleOnScrollOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      fromScale = 1.15,
      toScale = 1,
      scrub = 1,
      start = "top bottom",
      end = "bottom top",
    } = options;

    const tween = gsap.fromTo(
      el,
      { scale: fromScale },
      {
        scale: toScale,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start,
          end,
          scrub,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return ref;
}
