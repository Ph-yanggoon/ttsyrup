import { setRequestLocale } from "next-intl/server";
import HeroSection from "../components/HeroSection";
import ElderberryStory from "../components/ElderberryStory";
import NutritionBalance from "../components/NutritionBalance";
import IngredientCards from "../components/IngredientCards";
import SafetyCerts from "../components/SafetyCerts";
import ProductFormats from "../components/ProductFormats";
import PharmacyFinder from "../components/PharmacyFinder";
import FaqCta from "../components/FaqCta";
import Footer from "../components/Footer";

/* ─────────────────────────────────────────────────
   Page Flow — Cinematic Section Sequence

   S1  HeroSection      │ section-dark       → 어둡고 임팩트 있는 첫인상
   S2  ElderberryStory  │ (default warm)     → 따뜻한 엘더베리 이야기
   S3  NutritionBalance │ section-lavender   → 연보라 톤의 영양 균형
   S4  IngredientCards  │ (default warm)     → 따뜻한 배경의 성분 카드
   S5  SafetyCerts      │ section-sage       → 자연스러운 녹색 톤 안전/인증
   S6  ProductFormats   │ section-ivory      → 밝고 깨끗한 제품 라인업
   S7  PharmacyFinder   │ section-peach      → 부드러운 복숭아 톤 약국 찾기
   S8  FaqCta           │ section-lavender   → 연보라 FAQ + CTA
       Footer           │ dark               → 어두운 마무리
   ───────────────────────────────────────────────── */

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <HeroSection />
      <ElderberryStory />
      <NutritionBalance />
      <IngredientCards />
      <SafetyCerts />
      <ProductFormats />
      <PharmacyFinder />
      <FaqCta />
      <Footer />
    </main>
  );
}
