
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ServiceType, ServiceTypeInfo, CODE_PREFIXES, COLOR_OPTIONS } from "@/lib/serviceTypes";
import { useLanguage } from "@/context/LanguageContext";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface NewTypeEditorProps {
  nextId: ServiceType;
  onCreate: (newType: ServiceTypeInfo) => void;
  onCancel: () => void;
}

export function NewTypeEditor({ 
  nextId,
  onCreate,
  onCancel 
}: NewTypeEditorProps) {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#0284c7');
  const [codePrefix, setCodePrefix] = useState("S");
  const [codeNumber, setCodeNumber] = useState("01");

  const handleCreate = () => {
    const code = `${codePrefix}${codeNumber}`;
    
    const newServiceType: ServiceTypeInfo = {
      id: nextId,
      name,
      description,
      color,
      code
    };
    
    onCreate(newServiceType);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="service-name">{t('serviceTypes.name')}</Label>
        <Input 
          id="service-name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder={t('serviceTypes.namePlaceholder')}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="service-code-prefix">{t('serviceTypes.code')}</Label>
        <div className="flex gap-2">
          <div className="w-1/2">
            <Select value={codePrefix} onValueChange={setCodePrefix}>
              <SelectTrigger>
                <SelectValue placeholder={t('serviceTypes.codePrefix')} />
              </SelectTrigger>
              <SelectContent>
                {CODE_PREFIXES.map(prefix => (
                  <SelectItem key={prefix} value={prefix}>{prefix}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-1/2">
            <Input
              type="text"
              placeholder={t('serviceTypes.codeNumber')}
              value={codeNumber}
              onChange={(e) => setCodeNumber(e.target.value)}
              maxLength={2}
            />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="service-desc">{t('serviceTypes.desc')}</Label>
        <Textarea 
          id="service-desc" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          rows={3}
          placeholder={t('serviceTypes.descPlaceholder')}
        />
      </div>
      <div className="space-y-2">
        <Label>{t('serviceTypes.calendarColor')}</Label>
        <div className="flex flex-wrap gap-2">
          {COLOR_OPTIONS.map((colorOption) => (
            <TooltipProvider key={colorOption.value}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="h-8 w-8 rounded-full cursor-pointer flex items-center justify-center border-2 transition-transform hover:scale-110"
                    style={{ backgroundColor: colorOption.value, borderColor: color === colorOption.value ? "black" : colorOption.value }}
                    onClick={() => setColor(colorOption.value)}
                  >
                    {color === colorOption.value && <span className="text-white">✓</span>}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t(`serviceTypes.${colorOption.name}`)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onCancel}>
          {t('actions.cancel')}
        </Button>
        <Button onClick={handleCreate} disabled={!name.trim()}>{t('serviceTypes.create')}</Button>
      </div>
    </div>
  );
}
