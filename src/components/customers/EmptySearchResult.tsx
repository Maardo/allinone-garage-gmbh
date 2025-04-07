
import { Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface EmptySearchResultProps {
  searchTerm: string;
}

export function EmptySearchResult({ searchTerm }: EmptySearchResultProps) {
  const { t } = useLanguage();

  return (
    <div className="text-center py-12">
      <Search className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
      <h3 className="text-lg font-medium mb-1">{t('customer.noResults')}</h3>
      <p className="text-muted-foreground">
        {t('customer.noResultsFor')} "{searchTerm}"
      </p>
    </div>
  );
}
