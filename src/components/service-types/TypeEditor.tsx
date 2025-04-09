
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
import { Trash2 } from "lucide-react";

interface TypeEditorProps {
  typeId: ServiceType;
  serviceTypes: Record<ServiceType, ServiceTypeInfo>;
  onUpdate: (updatedType: ServiceTypeInfo) => void;
  onCancel: () => void;
  onDelete: (typeId: ServiceType) => void;
}

export function TypeEditor({ 
  typeId, 
  serviceTypes,
  onUpdate,
  onCancel,
  onDelete
}: TypeEditorProps) {
  const { t } = useLanguage();
  const [name, setName] = useState(serviceTypes[typeId].name);
  const [description, setDescription] = useState(serviceTypes[typeId].description);
  const [color, setColor] = useState(serviceTypes[typeId].color);
  const [codePrefix, setCodePrefix] = useState(serviceTypes[typeId].code?.charAt(0) || "S");
  const [codeNumber, setCodeNumber] = useState(serviceTypes[typeId].code?.substring(1) || "01");

  const handleUpdate = () => {
    const code = `${codePrefix}${codeNumber}`;
    
    const updatedType = {
      ...serviceTypes[typeId],
      name,
      description,
      color,
      code
    };
    
    onUpdate(updatedType);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="service-code">{t('serviceTypes.code')}</Label>
        <Input id="service-code" value={typeId} disabled className="bg-muted/50" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="service-name">{t('serviceTypes.name')}</Label>
        <Input 
          id="service-name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="bg-card border-muted"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="service-code-prefix">{t('serviceTypes.code')}</Label>
        <div className="flex gap-2">
          <div className="w-1/2">
            <Select value={codePrefix} onValueChange={setCodePrefix}>
              <SelectTrigger className="bg-card border-input">
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
              className="bg-card border-input"
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
          className="bg-card border-input resize-none"
        />
      </div>
      <div className="space-y-2">
        <Label>{t('serviceTypes.calendarColor')}</Label>
        <div className="flex flex-wrap gap-2 bg-muted/20 p-3 rounded-md border">
          {COLOR_OPTIONS.map((colorOption) => (
            <TooltipProvider key={colorOption.value}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="h-8 w-8 rounded-md cursor-pointer flex items-center justify-center border-2 transition-transform hover:scale-110 shadow-sm"
                    style={{ 
                      backgroundColor: colorOption.value, 
                      borderColor: color === colorOption.value ? "black" : "transparent" 
                    }}
                    onClick={() => setColor(colorOption.value)}
                    aria-label={t(`serviceTypes.${colorOption.name}`)}
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
      <div className="flex justify-between pt-4 border-t mt-6">
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            {t('actions.cancel')}
          </Button>
          <Button 
            variant="destructive" 
            size="icon" 
            onClick={() => onDelete(typeId)}
            title={t('serviceTypes.deleteTitle')}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={handleUpdate}>{t('serviceTypes.update')}</Button>
      </div>
    </div>
  );
}
