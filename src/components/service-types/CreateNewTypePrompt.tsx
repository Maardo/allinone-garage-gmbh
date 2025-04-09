
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { PlusCircle } from "lucide-react";

interface CreateNewTypePromptProps {
  onCreateNew: () => void;
}

export function CreateNewTypePrompt({ onCreateNew }: CreateNewTypePromptProps) {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center justify-center p-6">
      <div className="text-center">
        <h3 className="font-medium mb-2">
          {t('serviceTypes.createNew')}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {t('serviceTypes.about')}
        </p>
        <Button onClick={onCreateNew}>
          <PlusCircle className="h-4 w-4 mr-2" />
          {t('serviceTypes.create')}
        </Button>
      </div>
    </div>
  );
}
