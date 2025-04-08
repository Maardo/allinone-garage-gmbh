
import { Language } from "../types";
import { LANGUAGES } from "./languages";
import { enTranslations } from "./en";
import { svTranslations } from "./sv";
import { deTranslations } from "./de";

// Export the LANGUAGES constant for use elsewhere
export { LANGUAGES };

// Export the combined translations object
export const TRANSLATIONS: Record<Language, Record<string, any>> = {
  en: enTranslations,
  sv: svTranslations,
  de: deTranslations
};
