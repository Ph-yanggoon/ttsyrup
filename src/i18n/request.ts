import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

/* ── Deep merge helper ──
   Merges locale-specific messages on top of default (ko) messages.
   Ensures untranslated keys fall back to Korean until Task 10 populates
   the en/zh/vi JSON files. */
function deepMerge(
  base: Record<string, unknown>,
  override: Record<string, unknown>
): Record<string, unknown> {
  const result = { ...base };
  for (const key of Object.keys(override)) {
    if (
      typeof base[key] === "object" &&
      base[key] !== null &&
      !Array.isArray(base[key]) &&
      typeof override[key] === "object" &&
      override[key] !== null &&
      !Array.isArray(override[key])
    ) {
      result[key] = deepMerge(
        base[key] as Record<string, unknown>,
        override[key] as Record<string, unknown>
      );
    } else {
      result[key] = override[key];
    }
  }
  return result;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  /* Always load ko.json as the fallback base */
  const defaultMessages = (
    await import(`../../messages/${routing.defaultLocale}.json`)
  ).default;

  /* For non-default locales, deep-merge locale overrides on top */
  let messages = defaultMessages;
  if (locale !== routing.defaultLocale) {
    const localeMessages = (await import(`../../messages/${locale}.json`))
      .default;
    messages = deepMerge(defaultMessages, localeMessages);
  }

  return {
    locale,
    messages,
  };
});
