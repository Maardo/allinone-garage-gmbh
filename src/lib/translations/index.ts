
import { Language } from "../types";
import { LANGUAGES } from "./languages";
import en from "./en";
import sv from "./sv";
import de from "./de";

// Export the LANGUAGES constant for use elsewhere
export { LANGUAGES };

// Export the combined translations object
export const TRANSLATIONS: Record<Language, Record<string, any>> = {
  en,
  sv,
  de
};
