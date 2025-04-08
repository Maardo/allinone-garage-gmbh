
import { useLanguage } from "@/context/LanguageContext";
import { Language } from "@/lib/types";
import { LANGUAGES } from "@/lib/translations";
import { cn } from "@/lib/utils";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  // Define languages in desired order
  const orderedLanguages: [Language, string][] = [
    ['sv', LANGUAGES.sv],
    ['de', LANGUAGES.de],
    ['en', LANGUAGES.en]
  ];

  return (
    <div className="px-3 py-4 border-b border-sidebar-border">
      <div className="flex gap-2">
        {orderedLanguages.map(([code, name]) => (
          <button
            key={code}
            onClick={() => handleLanguageChange(code as Language)}
            className={cn(
              "flex-1 py-2 px-3 text-sm rounded-md transition-colors",
              language === code 
                ? "bg-blue-600 text-white" 
                : "bg-transparent text-gray-400 hover:bg-blue-700/30 hover:text-gray-300"
            )}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
