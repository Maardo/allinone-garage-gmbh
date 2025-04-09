
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { PlusCircle } from "lucide-react";

interface CreateNewTypePromptProps {
  onCreateNew: () => void;
}

export function CreateNewTypePrompt({ onCreateNew }: CreateNewTypePromptProps) {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <h3 className="font-medium text-lg mb-3">
          {t('serviceTypes.createNew')}
        </h3>
        <p className="text-muted-foreground mb-6 max-w-xs mx-auto">
          {t('serviceTypes.about')}
        </p>
        <Button onClick={onCreateNew} size="lg" className="gap-2">
          <PlusCircle className="h-5 w-5" />
          {t('serviceTypes.create')}
        </Button>
      </div>
    </div>
  );
}
