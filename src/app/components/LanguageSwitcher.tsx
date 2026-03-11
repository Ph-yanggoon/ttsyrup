"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/* ─────────────────────────────────────────────
   Language Switcher — Floating FAB (bottom-right)
   Glass morphism + Spring animation
   ───────────────────────────────────────────── */

/** Uppercase locale code for display (KO, EN, ZH, VI) */
function localeLabel(locale: string): string {
  return locale.toUpperCase();
}

export default function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("languageSwitcher");
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  /* ── Toggle menu ────────────────────────── */
  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  /* ── Switch locale ──────────────────────── */
  const switchLocale = useCallback(
    (newLocale: string) => {
      if (newLocale === locale) {
        setIsOpen(false);
        return;
      }
      router.replace(pathname, { locale: newLocale });
      setIsOpen(false);
    },
    [locale, pathname, router],
  );

  /* ── Close on outside click ─────────────── */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  /* ── Close on Escape key ────────────────── */
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  /* ── Keyboard navigation within menu ────── */
  const handleMenuKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!menuRef.current) return;
      const items = menuRef.current.querySelectorAll<HTMLButtonElement>(
        '[role="menuitem"]',
      );
      const currentIndex = Array.from(items).indexOf(
        document.activeElement as HTMLButtonElement,
      );

      if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        items[prev]?.focus();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        items[next]?.focus();
      } else if (e.key === "Tab") {
        /* Let Tab close the menu naturally */
        setIsOpen(false);
      }
    },
    [],
  );

  /* ── Focus first item when menu opens ───── */
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const firstItem =
        menuRef.current.querySelector<HTMLButtonElement>('[role="menuitem"]');
      /* Small delay to wait for the CSS transition to begin */
      requestAnimationFrame(() => {
        firstItem?.focus();
      });
    }
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 md:bottom-8 md:right-8"
    >
      {/* ── Drop-up Menu ──────────────────── */}
      <div
        ref={menuRef}
        role="menu"
        aria-label={t("label")}
        onKeyDown={handleMenuKeyDown}
        className="lang-menu"
        style={{
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? "visible" : "hidden",
          transform: isOpen
            ? "translateY(0) scale(1)"
            : "translateY(8px) scale(0.92)",
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        {routing.locales.map((loc) => {
          const isActive = loc === locale;
          return (
            <button
              key={loc}
              role="menuitem"
              tabIndex={isOpen ? 0 : -1}
              onClick={() => switchLocale(loc)}
              className={`lang-menu-item ${isActive ? "lang-menu-item--active" : ""}`}
              aria-current={isActive ? "true" : undefined}
            >
              <span className="lang-menu-item__label">
                {t(loc)}
              </span>
              <span className="lang-menu-item__code">
                {localeLabel(loc)}
              </span>
              {isActive && (
                <svg
                  className="lang-menu-item__check"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3.5 8.5L6.5 11.5L12.5 4.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {/* ── FAB Trigger ───────────────────── */}
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-label={t("label")}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="lang-fab"
      >
        {/* Globe icon */}
        <svg
          className="lang-fab__icon"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="9"
            cy="9"
            r="7.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <ellipse
            cx="9"
            cy="9"
            rx="3.5"
            ry="7.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <line
            x1="1.5"
            y1="9"
            x2="16.5"
            y2="9"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        <span className="lang-fab__text">{localeLabel(locale)}</span>
      </button>
    </div>
  );
}
