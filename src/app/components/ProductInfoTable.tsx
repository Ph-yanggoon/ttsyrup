"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

/* ─────────────────────────────────────────────────
   ProductInfoTable — 제품 기본 정보 테이블

   Footer 안내사항 하단에 배치.
   Desktop: 4-column grid (라벨 + 3제품)
   Mobile: 탭 전환 (시럽/스틱/짜요)

   Glass morphism box, dark theme 대응.

   Note: 제품 고유 데이터(원재료명, 알레르기 등)는 규제 정보이므로
   번역 대상에서 제외. UI 라벨만 i18n 적용.
   ───────────────────────────────────────────────── */

/* ── 제품 데이터 (규제 정보 — 번역 제외) ── */
const PRODUCTS = [
  {
    id: "syrup",
    name: "셀로맥스 어린이튼튼시럽",
    foodType: "혼합음료",
    manufacturer: "㈜네이처텍 / 충북 진천군 초평면 용정길 29-8",
    ingredients:
      "정제수, 듀올리고(락툴로즈, 갈락토올리고당), 팔라티노스, 엘더베리농축액(오스트리아산), 향료(천연믹스베리향), 나한과농축액(중국산), 잔탄검, 레몬농축액(이스라엘산), 혼합제제[BCAA믹스(L-로이신, L-이소로이신, L-발린), L-아르지닌, L-글루타민, L-메티오닌, L-알라닌], 수용성발효칼슘, 인디언구스베리추출물, 안식향산나트륨(보존료), 베리주스, 베가비컴플렉스(과·채가공품)",
    allergen: "우유, 조개류(굴) 함유",
    intake: "1일 1회, 1회 10ml을 섭취하십시오.",
    caution:
      "권장섭취량을 확인하신 후 섭취하십시오. 특이체질 및 알러지 체질의 경우 성분을 확인하신 후 섭취하십시오. 원료 성분에 의해 침전물이 생길 수 있으나 이물질이 아니오니 안심하고 잘 흔들어 드십시오.",
    storage:
      "직사광선이나 고온다습한 곳을 피하여 건조한 곳에 보관하십시오. 개봉 후 뚜껑을 꼭 닫아서 냉장 보관해 주십시오.",
  },
  {
    id: "stick",
    name: "셀로맥스 어린이튼튼시럽 스틱",
    foodType: "혼합음료",
    manufacturer: "㈜노바렉스 / 충북 청주시 흥덕구 오송읍 오송생명14로 80",
    ingredients:
      "정제수, 올리고당(락툴로즈, 갈락토올리고당), 팔라티노스(정제수, 설탕), 엘더베리농축액(오스트리아산), 천연향료(믹스베리향), 나한과농축액(중국산), 복합황금추출물{황금농축액(황금:국산), 감초농축액(감초:국산)}, 잔탄검, 레몬농축액, 혼합제제{혼합제제(L-로이신, L-이소로이신, L-발린), L-아르지닌, L-글루타민, L-메티오닌, L-알라닌}, 수용성발효칼슘S, 인디안구스베리추출물분말, 과일허브추출물분말",
    allergen: "우유, 조개류(굴) 함유",
    intake: "1일 1회, 1회 1포를 섭취하십시오.",
    caution:
      "특이체질, 알레르기 체질이신 경우 성분을 확인하신 후 섭취하여 주시기 바랍니다. 제품 개봉 또는 섭취 시 포장재에 의해 상처를 입을 수 있으니 주의하시기 바랍니다.",
    storage:
      "직사광선을 피하고, 고온다습한 곳을 피해 습기가 적고 서늘한 곳에 보관하십시오. 개봉 후에는 공기의 노출을 최대한 차단하여 보관하십시오.",
  },
  {
    id: "jjayo",
    name: "셀로맥스 어린이튼튼짜요",
    foodType: "기타가공품",
    manufacturer: "㈜네이처텍 / 충북 진천군 초평면 용정길 29-8",
    ingredients:
      "정제수, 기타과당, 듀올리고(락툴로즈, 갈락토올리고당), 팔라티노스, 엘더베리농축액(오스트리아산), 덱스트린, 기타가공품[한천(꼬시래기:인도네시아산)], 구연산, 젖산칼슘, 천연향료(천연믹스베리향), 구연산삼나트륨, 레몬농축액(이스라엘산), 혼합제제2[BCAA믹스(로이신, 이소로이신, 발린), L-아르지닌, L-글루타민, L-메티오닌, L-알라닌], 수용성발효칼슘[발효칼슘(굴각:국산)], 인디언구스베리추출물분말(인도산), 베리주스, 효소처리스테비아, 베가비컴플렉스(과·채가공품)",
    allergen: "우유, 조개류(굴) 함유",
    intake: "1일 1회, 1회 1포를 씹어서 섭취하십시오.",
    caution:
      "개봉 시 절단면에 손이 베이지 않도록 주의하십시오. 임산부, 수유부, 알레르기 체질, 치료를 받고 계신 분은 섭취 전 구입처 또는 소비자상담실로 문의하십시오. 한번에 섭취할 경우 목에 걸릴 수 있으니 삼키지 마시고 잘 씹어서 섭취하십시오.",
    storage: "실온보관 / 냉장보관 하시면 더욱 좋습니다.",
  },
];

/* 행 라벨 키 정의 */
const ROW_KEYS = [
  "name",
  "foodType",
  "manufacturer",
  "ingredients",
  "allergen",
  "intake",
  "caution",
  "storage",
] as const;

type RowKey = (typeof ROW_KEYS)[number];

/* ── Expandable 원재료 텍스트 ── */
function ExpandableText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const t = useTranslations("productInfo");
  const isLong = text.length > 60;

  if (!isLong) {
    return <span>{text}</span>;
  }

  return (
    <span>
      <span className={expanded ? "" : "line-clamp-2"}>
        {text}
      </span>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-elderberry-300/60 hover:text-elderberry-300 text-[10px] mt-1 transition-colors inline-block"
      >
        {expanded ? t("expandButton.collapse") : t("expandButton.expand")}
      </button>
    </span>
  );
}

/* ═══════ Desktop Table ═══════ */
function DesktopTable() {
  const t = useTranslations("productInfo");

  return (
    <div className="hidden md:block overflow-hidden rounded-xl border border-white/[0.06]">
      <table className="w-full text-[12px] leading-relaxed">
        {/* ── Header ── */}
        <thead>
          <tr className="border-b border-white/[0.06]">
            <th className="text-left py-3 px-4 text-white/30 font-medium w-[130px] bg-white/[0.02]">
              {t("category")}
            </th>
            {PRODUCTS.map((p) => (
              <th
                key={p.id}
                className="text-left py-3 px-4 text-white/50 font-semibold bg-white/[0.02]"
              >
                {t(`tabs.${p.id}`)}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* ── 개별 행 ── */}
          {ROW_KEYS.map((key, ri) => (
            <tr
              key={key}
              className={`border-b border-white/[0.04] ${
                ri % 2 === 0 ? "" : "bg-white/[0.01]"
              }`}
            >
              <td className="py-3 px-4 text-white/35 font-medium align-top whitespace-nowrap">
                {t(`rowLabels.${key}`)}
              </td>
              {PRODUCTS.map((p) => {
                const val = p[key as RowKey];
                return (
                  <td
                    key={p.id}
                    className="py-3 px-4 text-white/25 align-top"
                  >
                    {key === "ingredients" ? (
                      <ExpandableText text={val} />
                    ) : (
                      val
                    )}
                  </td>
                );
              })}
            </tr>
          ))}

          {/* ── 공통 행 (유전자재조합) ── */}
          <tr
            className={`${
              ROW_KEYS.length % 2 === 0 ? "" : "bg-white/[0.01]"
            }`}
          >
            <td className="py-3 px-4 text-white/35 font-medium align-top whitespace-nowrap">
              {t("commonRows.gmo.label")}
            </td>
            <td
              colSpan={3}
              className="py-3 px-4 text-white/25 align-top"
            >
              {t("commonRows.gmo.value")}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/* ═══════ Mobile Tabs ═══════ */
function MobileTable() {
  const [activeTab, setActiveTab] = useState(0);
  const t = useTranslations("productInfo");
  const product = PRODUCTS[activeTab];

  return (
    <div className="md:hidden">
      {/* ── Tab Bar ── */}
      <div className="flex rounded-lg overflow-hidden border border-white/[0.06] mb-4 bg-white/[0.02]">
        {PRODUCTS.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setActiveTab(i)}
            className={`flex-1 py-2.5 px-3 text-[11px] font-medium transition-all duration-200 ${
              activeTab === i
                ? "bg-elderberry-500/20 text-elderberry-300 border-b-2 border-elderberry-400"
                : "text-white/30 hover:text-white/50 hover:bg-white/[0.02]"
            }`}
          >
            {t(`tabs.${p.id}`)}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="rounded-xl border border-white/[0.06] overflow-hidden">
        <dl>
          {ROW_KEYS.map((key, ri) => {
            const val = product[key as RowKey];
            return (
              <div
                key={key}
                className={`flex flex-col gap-1 px-4 py-3 ${
                  ri < ROW_KEYS.length - 1
                    ? "border-b border-white/[0.04]"
                    : ""
                } ${ri % 2 === 0 ? "" : "bg-white/[0.01]"}`}
              >
                <dt className="text-[11px] text-white/35 font-medium">
                  {t(`rowLabels.${key}`)}
                </dt>
                <dd className="text-[12px] text-white/25 leading-relaxed">
                  {key === "ingredients" ? (
                    <ExpandableText text={val} />
                  ) : (
                    val
                  )}
                </dd>
              </div>
            );
          })}

          {/* ── 공통 행 (유전자재조합) ── */}
          <div
            className={`flex flex-col gap-1 px-4 py-3 ${
              ROW_KEYS.length % 2 === 0 ? "" : "bg-white/[0.01]"
            }`}
          >
            <dt className="text-[11px] text-white/35 font-medium">
              {t("commonRows.gmo.label")}
            </dt>
            <dd className="text-[12px] text-white/25 leading-relaxed">
              {t("commonRows.gmo.value")}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

/* ═══════ Main Component ═══════ */
export default function ProductInfoTable() {
  const t = useTranslations("productInfo");

  return (
    <div className="max-w-[900px] mx-auto">
      {/* Section title */}
      <div className="text-center mb-5">
        <span className="text-[13px] font-semibold text-white/40 tracking-wider">
          {t("sectionTitle")}
        </span>
      </div>

      {/* Glass container */}
      <div className="bg-white/[0.04] backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-white/[0.06]">
        <DesktopTable />
        <MobileTable />
      </div>
    </div>
  );
}
