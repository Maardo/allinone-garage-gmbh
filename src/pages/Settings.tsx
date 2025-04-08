
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

export default function Settings() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [completionEmailTemplate, setCompletionEmailTemplate] = useState(
    "Dear customer,\n\nWe are pleased to inform you that your vehicle service has been completed. Your vehicle is now ready for pickup.\n\nThank you for choosing our services.\n\nBest regards,\nAuto Service Center"
  );
  
  const handleSaveGeneralSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your general settings have been updated successfully.",
    });
  };
  
  const handleSaveNotificationSettings = () => {
    // Save notification settings to local storage for demo purposes
    localStorage.setItem("emailNotifications", emailNotifications.toString());
    localStorage.setItem("smsNotifications", smsNotifications.toString());
    localStorage.setItem("completionEmailTemplate", completionEmailTemplate);
    
    toast({
      title: "Notification preferences updated",
      description: "Your notification settings have been saved.",
    });
  };

  return (
    <Layout title="Settings" subtitle="Manage your workshop settings">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Workshop Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workshop-name">Workshop Name</Label>
                  <Input id="workshop-name" defaultValue="Auto Service Center" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input id="contact-email" defaultValue="contact@autoservice.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" defaultValue="123 Repair Street, Mechanic City" />
                </div>
              </div>
              <Button onClick={handleSaveGeneralSettings}>Save Changes</Button>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch 
                  checked={emailNotifications} 
                  onCheckedChange={setEmailNotifications} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates via text message</p>
                </div>
                <Switch 
                  checked={smsNotifications} 
                  onCheckedChange={setSmsNotifications} 
                />
              </div>
              
              <div className="space-y-2 border-t pt-4 mt-4">
                <Label htmlFor="completion-email-template">
                  Service Completion Email Template
                </Label>
                <p className="text-sm text-muted-foreground mb-2">
                  This email will be sent to customers when their service is marked as complete
                </p>
                <Textarea 
                  id="completion-email-template" 
                  className="min-h-[200px]"
                  value={completionEmailTemplate}
                  onChange={(e) => setCompletionEmailTemplate(e.target.value)}
                />
              </div>
              
              <Button onClick={handleSaveNotificationSettings}>Update Preferences</Button>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="system">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">System Settings</h3>
            <p className="text-muted-foreground mb-6">Only administrators can modify system settings.</p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="backup-frequency">Data Backup Frequency</Label>
                <select 
                  id="backup-frequency" 
                  className="w-full p-2 border rounded-md"
                  defaultValue="daily"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              
              <div className="pt-4 border-t">
                <Button variant="destructive">
                  Reset All Settings
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
