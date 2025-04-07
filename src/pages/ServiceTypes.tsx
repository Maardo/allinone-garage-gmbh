
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SERVICE_TYPES, ServiceType, ServiceTypeInfo } from "@/lib/serviceTypes";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";

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
                    <div 
                      className="h-8 w-8 flex-shrink-0 rounded mr-4" 
                      style={{ backgroundColor: type.color }}
                    ></div>
                    <div className="overflow-hidden">
                      <h3 className="font-medium text-sm md:text-base">{type.name}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground truncate">
                        {type.description}
                      </p>
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

  const handleUpdate = () => {
    // Update the service type
    const updatedTypes = {
      ...serviceTypes,
      [typeId]: {
        ...serviceTypes[typeId],
        name,
        description,
        color
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
        <RadioGroup defaultValue={color} onValueChange={setColor} className="flex flex-wrap gap-2">
          <div className="flex items-center">
            <RadioGroupItem value="#0284c7" id="color-blue" className="sr-only" />
            <Label
              htmlFor="color-blue"
              className="h-8 w-8 rounded-full cursor-pointer flex items-center justify-center border-2"
              style={{ backgroundColor: "#0284c7", borderColor: color === "#0284c7" ? "black" : "#0284c7" }}
            >
              {color === "#0284c7" && (
                <span className="text-white">✓</span>
              )}
            </Label>
          </div>
          <div className="flex items-center">
            <RadioGroupItem value="#dc2626" id="color-red" className="sr-only" />
            <Label
              htmlFor="color-red"
              className="h-8 w-8 rounded-full cursor-pointer flex items-center justify-center border-2"
              style={{ backgroundColor: "#dc2626", borderColor: color === "#dc2626" ? "black" : "#dc2626" }}
            >
              {color === "#dc2626" && (
                <span className="text-white">✓</span>
              )}
            </Label>
          </div>
          <div className="flex items-center">
            <RadioGroupItem value="#16a34a" id="color-green" className="sr-only" />
            <Label
              htmlFor="color-green"
              className="h-8 w-8 rounded-full cursor-pointer flex items-center justify-center border-2"
              style={{ backgroundColor: "#16a34a", borderColor: color === "#16a34a" ? "black" : "#16a34a" }}
            >
              {color === "#16a34a" && (
                <span className="text-white">✓</span>
              )}
            </Label>
          </div>
          <div className="flex items-center">
            <RadioGroupItem value="#9333ea" id="color-purple" className="sr-only" />
            <Label
              htmlFor="color-purple"
              className="h-8 w-8 rounded-full cursor-pointer flex items-center justify-center border-2"
              style={{ backgroundColor: "#9333ea", borderColor: color === "#9333ea" ? "black" : "#9333ea" }}
            >
              {color === "#9333ea" && (
                <span className="text-white">✓</span>
              )}
            </Label>
          </div>
          <div className="flex items-center">
            <RadioGroupItem value="#d97706" id="color-amber" className="sr-only" />
            <Label
              htmlFor="color-amber"
              className="h-8 w-8 rounded-full cursor-pointer flex items-center justify-center border-2"
              style={{ backgroundColor: "#d97706", borderColor: color === "#d97706" ? "black" : "#d97706" }}
            >
              {color === "#d97706" && (
                <span className="text-white">✓</span>
              )}
            </Label>
          </div>
        </RadioGroup>
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

  const handleCreate = () => {
    // Create a new service type
    const newServiceType: ServiceTypeInfo = {
      id: nextId,
      name,
      description,
      color
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
        <RadioGroup value={color} onValueChange={setColor} className="flex flex-wrap gap-2">
          <div className="flex items-center">
            <RadioGroupItem value="#0284c7" id="color-blue-new" className="sr-only" />
            <Label
              htmlFor="color-blue-new"
              className="h-8 w-8 rounded-full cursor-pointer flex items-center justify-center border-2"
              style={{ backgroundColor: "#0284c7", borderColor: color === "#0284c7" ? "black" : "#0284c7" }}
            >
              {color === "#0284c7" && (
                <span className="text-white">✓</span>
              )}
            </Label>
          </div>
          <div className="flex items-center">
            <RadioGroupItem value="#dc2626" id="color-red-new" className="sr-only" />
            <Label
              htmlFor="color-red-new"
              className="h-8 w-8 rounded-full cursor-pointer flex items-center justify-center border-2"
              style={{ backgroundColor: "#dc2626", borderColor: color === "#dc2626" ? "black" : "#dc2626" }}
            >
              {color === "#dc2626" && (
                <span className="text-white">✓</span>
              )}
            </Label>
          </div>
          <div className="flex items-center">
            <RadioGroupItem value="#16a34a" id="color-green-new" className="sr-only" />
            <Label
              htmlFor="color-green-new"
              className="h-8 w-8 rounded-full cursor-pointer flex items-center justify-center border-2"
              style={{ backgroundColor: "#16a34a", borderColor: color === "#16a34a" ? "black" : "#16a34a" }}
            >
              {color === "#16a34a" && (
                <span className="text-white">✓</span>
              )}
            </Label>
          </div>
          <div className="flex items-center">
            <RadioGroupItem value="#9333ea" id="color-purple-new" className="sr-only" />
            <Label
              htmlFor="color-purple-new"
              className="h-8 w-8 rounded-full cursor-pointer flex items-center justify-center border-2"
              style={{ backgroundColor: "#9333ea", borderColor: color === "#9333ea" ? "black" : "#9333ea" }}
            >
              {color === "#9333ea" && (
                <span className="text-white">✓</span>
              )}
            </Label>
          </div>
          <div className="flex items-center">
            <RadioGroupItem value="#d97706" id="color-amber-new" className="sr-only" />
            <Label
              htmlFor="color-amber-new"
              className="h-8 w-8 rounded-full cursor-pointer flex items-center justify-center border-2"
              style={{ backgroundColor: "#d97706", borderColor: color === "#d97706" ? "black" : "#d97706" }}
            >
              {color === "#d97706" && (
                <span className="text-white">✓</span>
              )}
            </Label>
          </div>
        </RadioGroup>
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
