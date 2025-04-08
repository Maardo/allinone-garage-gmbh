
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CODE_PREFIXES, COLOR_OPTIONS, SERVICE_TYPES, ServiceType, ServiceTypeInfo } from "@/lib/serviceTypes";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export default function ServiceTypes() {
  const { t } = useLanguage();
  const [selectedType, setSelectedType] = useState<ServiceType | null>(null);
  const [serviceTypes, setServiceTypes] = useState<Record<ServiceType, ServiceTypeInfo>>(SERVICE_TYPES);
  const [newType, setNewType] = useState<boolean>(false);
  const [nextId, setNextId] = useState<ServiceType>(6 as ServiceType);

  const handleSelectType = (type: ServiceType) => {
    setNewType(false);
    setSelectedType(type);
  };

  const handleCreateNew = () => {
    setSelectedType(null);
    setNewType(true);
  };

  return (
    <Layout 
      title={t('serviceTypes.title')} 
      subtitle={t('serviceTypes.subtitle')}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-6 md:col-span-2 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('serviceTypes.description')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.values(serviceTypes).map((type) => (
                  <div
                    key={type.id}
                    className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors"
                    style={{ borderColor: type.color, borderWidth: '2px' }}
                    onClick={() => handleSelectType(type.id)}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className="h-8 w-8 flex-shrink-0 rounded mr-4 cursor-help" 
                            style={{ backgroundColor: type.color }}
                          ></div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{type.color}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <div className="overflow-hidden">
                      <h3 className="font-medium text-sm md:text-base">{type.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-xs bg-muted px-2 py-0.5 rounded">
                          {type.code || type.id}
                        </span>
                        <p className="text-xs md:text-sm text-muted-foreground truncate">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedType 
                  ? t('serviceTypes.edit')
                  : newType 
                    ? t('serviceTypes.new')
                    : t('serviceTypes.select')
                }
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedType ? (
                <TypeEditor 
                  typeId={selectedType} 
                  serviceTypes={serviceTypes}
                  setServiceTypes={setServiceTypes}
                  onCancel={() => setSelectedType(null)} 
                />
              ) : newType ? (
                <NewTypeEditor 
                  nextId={nextId}
                  setNextId={setNextId}
                  serviceTypes={serviceTypes}
                  setServiceTypes={setServiceTypes}
                  onCancel={() => setNewType(false)} 
                />
              ) : (
                <div className="flex items-center justify-center p-6">
                  <div className="text-center">
                    <h3 className="font-medium mb-2">
                      {t('serviceTypes.createNew')}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {t('serviceTypes.about')}
                    </p>
                    <Button onClick={handleCreateNew}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      {t('serviceTypes.create')}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

function TypeEditor({ 
  typeId, 
  serviceTypes,
  setServiceTypes,
  onCancel 
}: { 
  typeId: ServiceType; 
  serviceTypes: Record<ServiceType, ServiceTypeInfo>;
  setServiceTypes: React.Dispatch<React.SetStateAction<Record<ServiceType, ServiceTypeInfo>>>;
  onCancel: () => void; 
}) {
  const { t } = useLanguage();
  const [name, setName] = useState(serviceTypes[typeId].name);
  const [description, setDescription] = useState(serviceTypes[typeId].description);
  const [color, setColor] = useState(serviceTypes[typeId].color);
  const [codePrefix, setCodePrefix] = useState(serviceTypes[typeId].code?.charAt(0) || "S");
  const [codeNumber, setCodeNumber] = useState(serviceTypes[typeId].code?.substring(1) || "01");

  const handleUpdate = () => {
    // Update the service type
    const code = `${codePrefix}${codeNumber}`;
    
    const updatedTypes = {
      ...serviceTypes,
      [typeId]: {
        ...serviceTypes[typeId],
        name,
        description,
        color,
        code
      }
    };
    setServiceTypes(updatedTypes);
    toast.success(t('serviceTypes.updated'));
    onCancel();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="service-code">{t('serviceTypes.code')}</Label>
        <Input id="service-code" value={typeId} disabled />
      </div>
      <div className="space-y-2">
        <Label htmlFor="service-name">{t('serviceTypes.name')}</Label>
        <Input 
          id="service-name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
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
        <Button onClick={handleUpdate}>{t('serviceTypes.update')}</Button>
      </div>
    </div>
  );
}

function NewTypeEditor({ 
  nextId,
  setNextId,
  serviceTypes,
  setServiceTypes,
  onCancel 
}: { 
  nextId: ServiceType;
  setNextId: React.Dispatch<React.SetStateAction<ServiceType>>;
  serviceTypes: Record<ServiceType, ServiceTypeInfo>;
  setServiceTypes: React.Dispatch<React.SetStateAction<Record<ServiceType, ServiceTypeInfo>>>;
  onCancel: () => void; 
}) {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#0284c7');
  const [codePrefix, setCodePrefix] = useState("S");
  const [codeNumber, setCodeNumber] = useState("01");

  const handleCreate = () => {
    // Create a new service type
    const code = `${codePrefix}${codeNumber}`;
    
    const newServiceType: ServiceTypeInfo = {
      id: nextId,
      name,
      description,
      color,
      code
    };

    const updatedTypes = {
      ...serviceTypes,
      [nextId]: newServiceType
    };
    
    setServiceTypes(updatedTypes);
    setNextId((prevId => (prevId + 1) as ServiceType));
    toast.success(t('serviceTypes.created'));
    onCancel();
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
