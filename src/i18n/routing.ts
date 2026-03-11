import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ko", "en", "zh", "vi"],
  defaultLocale: "ko",
  localePrefix: "as-needed",
});
