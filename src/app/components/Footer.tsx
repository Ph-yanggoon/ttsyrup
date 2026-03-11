"use client";

/* ─────────────────────────────────────────────────
   Footer
   Dark elderberry gradient background.
   Company info, disclaimer, links, copyright.
   ───────────────────────────────────────────────── */

import { useTranslations } from "next-intl";
import ProductInfoTable from "./ProductInfoTable";

export default function Footer() {
  const t = useTranslations("footer");
  const disclaimerItems = t.raw("disclaimer.items") as string[];

  return (
    <footer className="section-dark relative overflow-hidden">
      {/* Background subtle texture */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
          }}
        />
      </div>

      <div className="section-inner relative z-10 py-14 sm:py-18 lg:py-20">
        {/* ── Top: Logo / Brand ── */}
        <div className="text-center mb-10 lg:mb-14">
          <div className="inline-flex items-center gap-2.5 mb-3">
            {/* Brand mark */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-elderberry-400 to-elderberry-600 flex items-center justify-center">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                className="w-4.5 h-4.5 text-white"
              >
                <circle
                  cx="10"
                  cy="8"
                  r="5"
                  fill="currentColor"
                  opacity="0.6"
                />
                <circle
                  cx="7"
                  cy="12"
                  r="4"
                  fill="currentColor"
                  opacity="0.4"
                />
                <circle
                  cx="13"
                  cy="12"
                  r="4"
                  fill="currentColor"
                  opacity="0.5"
                />
              </svg>
            </div>
            <span className="text-lg font-bold text-white/90 tracking-tight">
              Cellromax
            </span>
          </div>
          <p className="text-body-sm text-white/30">
            {t("brandTagline")}
          </p>
        </div>

        {/* ── Disclaimer ── */}
        <div className="max-w-[640px] mx-auto mb-10 lg:mb-14">
          <div className="bg-white/[0.04] backdrop-blur-sm rounded-xl p-5 sm:p-6 border border-white/[0.06]">
            <div className="flex items-start gap-3 mb-3">
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className="w-4 h-4 text-white/30 flex-shrink-0 mt-0.5"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="6.5"
                  stroke="currentColor"
                  strokeWidth="1"
                />
                <path
                  d="M8 5v3.5M8 10.5v.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                {t("disclaimer.title")}
              </span>
            </div>
            <div className="space-y-1.5 text-[12px] text-white/30 leading-relaxed">
              {disclaimerItems.map((item, i) => (
                <p key={i}>{item}</p>
              ))}
            </div>
          </div>
        </div>

        {/* ── Product Info Table ── */}
        <div className="mb-10 lg:mb-14">
          <ProductInfoTable />
        </div>

        {/* ── Company Info ── */}
        <div className="max-w-[640px] mx-auto text-center mb-8 lg:mb-10">
          <div className="space-y-2 text-[12px] text-white/25 leading-relaxed">
            <p>{t("company.name")}</p>
            <p>{t("company.bizNumber")}</p>
            <p>{t("company.address")}</p>
            <p>
              {t("company.customerCenter")}{" "}
              <a
                href="tel:031-662-1395"
                className="text-white/35 hover:text-white/50 transition-colors"
              >
                031-662-1395
              </a>{" "}
              {t("company.customerCenterHours")}
            </p>
            <p>
              {t("company.emailLabel")}{" "}
              <a
                href="mailto:health1395@kshp.co.kr"
                className="text-white/35 hover:text-white/50 transition-colors"
              >
                health1395@kshp.co.kr
              </a>
            </p>
            <p>{t("company.privacyOfficer")}</p>
            <p>{t("company.insurance")}</p>
          </div>
        </div>

        {/* ── Bottom Links + Copyright ── */}
        <div className="border-t border-white/[0.06] pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Links */}
            <div className="flex items-center gap-4 text-[11px]">
              <a
                href="#"
                className="text-white/25 hover:text-white/50 transition-colors"
              >
                {t("links.privacy")}
              </a>
              <span className="w-px h-3 bg-white/10" />
              <a
                href="#"
                className="text-white/25 hover:text-white/50 transition-colors"
              >
                {t("links.terms")}
              </a>
              <span className="w-px h-3 bg-white/10" />
              <a
                href="#"
                className="text-white/25 hover:text-white/50 transition-colors"
              >
                {t("links.bizInfo")}
              </a>
            </div>

            {/* Copyright */}
            <p className="text-[11px] text-white/20">
              {t("copyright")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
