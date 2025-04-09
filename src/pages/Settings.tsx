
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { resetAppointments } from "@/services/appointmentService";
import { resetStats } from "@/services/statsService";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Settings() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [completionEmailTemplate, setCompletionEmailTemplate] = useState(
    "Dear customer,\n\nWe are pleased to inform you that your vehicle service has been completed. Your vehicle is now ready for pickup.\n\nThank you for choosing our services.\n\nBest regards,\nAuto Service Center"
  );
  const [isResetting, setIsResetting] = useState(false);
  
  const handleSaveGeneralSettings = () => {
    toast({
      title: t('common.success'),
      description: t('common.settingsSaved'),
    });
  };
  
  const handleSaveNotificationSettings = () => {
    // Save notification settings to local storage for demo purposes
    localStorage.setItem("emailNotifications", emailNotifications.toString());
    localStorage.setItem("completionEmailTemplate", completionEmailTemplate);
    
    toast({
      title: t('common.success'),
      description: t('common.notificationPreferencesSaved'),
    });
  };

  const handleResetData = async () => {
    try {
      setIsResetting(true);
      // Reset all data in Supabase
      await resetAppointments();
      await resetStats();
      
      toast({
        title: t('common.success'),
        description: "All data has been reset successfully.",
      });
      
      // Reload the page to refresh all data
      window.location.reload();
    } catch (error) {
      console.error("Error resetting data:", error);
      toast({
        title: t('common.error'),
        description: "Failed to reset data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Layout title={t('pages.settings.title')} subtitle={t('pages.settings.subtitle')}>
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general">{t('common.general')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('common.notifications')}</TabsTrigger>
          <TabsTrigger value="system">{t('common.system')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">{t('common.workshopInformation')}</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workshop-name">{t('common.workshopName')}</Label>
                  <Input id="workshop-name" defaultValue="Auto Service Center" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">{t('common.contactEmail')}</Label>
                  <Input id="contact-email" defaultValue="contact@autoservice.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('common.phoneNumber')}</Label>
                  <Input id="phone" defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">{t('common.address')}</Label>
                  <Input id="address" defaultValue="123 Repair Street, Mechanic City" />
                </div>
              </div>
              <Button onClick={handleSaveGeneralSettings}>{t('common.saveChanges')}</Button>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">{t('common.notificationPreferences')}</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t('common.emailNotifications')}</p>
                  <p className="text-sm text-muted-foreground">{t('common.receiveUpdatesViaEmail')}</p>
                </div>
                <Switch 
                  checked={emailNotifications} 
                  onCheckedChange={setEmailNotifications} 
                />
              </div>
              
              <div className="space-y-2 border-t pt-4 mt-4">
                <Label htmlFor="completion-email-template">
                  {t('common.serviceCompletionEmailTemplate')}
                </Label>
                <p className="text-sm text-muted-foreground mb-2">
                  {t('common.emailSentWhenServiceComplete')}
                </p>
                <Textarea 
                  id="completion-email-template" 
                  className="min-h-[200px]"
                  value={completionEmailTemplate}
                  onChange={(e) => setCompletionEmailTemplate(e.target.value)}
                />
              </div>
              
              <Button onClick={handleSaveNotificationSettings}>{t('common.updatePreferences')}</Button>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="system">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">{t('common.systemSettings')}</h3>
            <p className="text-muted-foreground mb-6">{t('common.adminOnlySettings')}</p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="backup-frequency">{t('common.dataBackupFrequency')}</Label>
                <select 
                  id="backup-frequency" 
                  className="w-full p-2 border rounded-md"
                  defaultValue="daily"
                >
                  <option value="daily">{t('common.daily')}</option>
                  <option value="weekly">{t('common.weekly')}</option>
                  <option value="monthly">{t('common.monthly')}</option>
                </select>
              </div>
              
              <div className="pt-4 border-t">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      Återställ alla data
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Är du säker?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Detta kommer att radera alla dina bokningar, statistik och annan data. 
                        Åtgärden kan inte ångras.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Avbryt</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleResetData} 
                        disabled={isResetting}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {isResetting ? "Återställer..." : "Ja, återställ all data"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
