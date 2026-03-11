import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";
import "lenis/dist/lenis.css";
import ScrollEngine from "../components/ScrollEngine";
import LanguageSwitcher from "../components/LanguageSwitcher";

export const metadata: Metadata = {
  title: "셀로맥스 어린이튼튼시럽 | 엘더베리로 채우는 우리 아이 건강",
  description:
    "유럽산 엘더베리, 프리바이오틱스, 아미노산 7종 등 6가지 핵심 영양을 담은 어린이 건강시럽. 약국 전용, 만 1세부터.",
  keywords: [
    "어린이튼튼시럽",
    "셀로맥스",
    "엘더베리",
    "어린이건강",
    "약국전용",
    "프리바이오틱스",
    "아미노산",
  ],
  openGraph: {
    title: "셀로맥스 어린이튼튼시럽",
    description: "하루 한 번, 엘더베리의 힘으로 우리 아이 건강을 채우다",
    type: "website",
    locale: "ko_KR",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#5B2E8C",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="antialiased">
        <NextIntlClientProvider>
          <ScrollEngine />
          <div className="scroll-progress-bar" aria-hidden="true" />
          {children}
          <LanguageSwitcher />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
