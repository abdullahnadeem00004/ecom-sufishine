import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings as SettingsIcon,
  Store,
  Mail,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Save,
  Upload,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StoreSettings {
  name: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  timezone: string;
  language: string;
  logo: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  orderNotifications: boolean;
  reviewNotifications: boolean;
  inventoryAlerts: boolean;
  marketingEmails: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  ipWhitelist: string;
  passwordPolicy: string;
}

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("store");
  const { toast } = useToast();

  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    name: "SUFI SHINE",
    description: "Premium natural beauty and wellness products",
    email: "info.sufishine@gmail.com",
    phone: "+92 304 1146524",
    address: "Lahore, Punjab, Pakistan",
    currency: "PKR",
    timezone: "Asia/Karachi",
    language: "en",
    logo: "",
  });

  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      emailNotifications: true,
      orderNotifications: true,
      reviewNotifications: true,
      inventoryAlerts: true,
      marketingEmails: false,
    });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: false,
    sessionTimeout: 24,
    ipWhitelist: "",
    passwordPolicy: "standard",
  });

  const handleStoreSettingsSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Settings Saved",
        description: "Store settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationsSave = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Notifications Updated",
        description: "Notification preferences have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notifications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySave = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Security Updated",
        description: "Security settings have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update security settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your store settings, notifications, and security preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="store" className="flex items-center space-x-2">
            <Store className="h-4 w-4" />
            <span>Store</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center space-x-2"
          >
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Advanced</span>
          </TabsTrigger>
        </TabsList>

        {/* Store Settings */}
        <TabsContent value="store" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Store className="mr-2 h-5 w-5" />
                Store Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="store-name">Store Name</Label>
                  <Input
                    id="store-name"
                    value={storeSettings.name}
                    onChange={(e) =>
                      setStoreSettings({
                        ...storeSettings,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-email">Contact Email</Label>
                  <Input
                    id="store-email"
                    type="email"
                    value={storeSettings.email}
                    onChange={(e) =>
                      setStoreSettings({
                        ...storeSettings,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="store-description">Store Description</Label>
                <Textarea
                  id="store-description"
                  value={storeSettings.description}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="store-phone">Phone Number</Label>
                  <Input
                    id="store-phone"
                    value={storeSettings.phone}
                    onChange={(e) =>
                      setStoreSettings({
                        ...storeSettings,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-currency">Currency</Label>
                  <Select
                    value={storeSettings.currency}
                    onValueChange={(value) =>
                      setStoreSettings({ ...storeSettings, currency: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PKR">PKR - Pakistani Rupee</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="store-address">Store Address</Label>
                <Textarea
                  id="store-address"
                  value={storeSettings.address}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      address: e.target.value,
                    })
                  }
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="store-timezone">Timezone</Label>
                  <Select
                    value={storeSettings.timezone}
                    onValueChange={(value) =>
                      setStoreSettings({ ...storeSettings, timezone: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Karachi">
                        Asia/Karachi (PKT)
                      </SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">
                        America/New_York (EST)
                      </SelectItem>
                      <SelectItem value="Europe/London">
                        Europe/London (GMT)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-language">Language</Label>
                  <Select
                    value={storeSettings.language}
                    onValueChange={(value) =>
                      setStoreSettings({ ...storeSettings, language: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ur">Urdu</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Store Logo</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload your store logo (recommended: 200x200px)
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Logo
                </Button>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleStoreSettingsSave}
                  disabled={loading}
                  className="min-w-32"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-base font-medium">
                    Email Notifications
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Receive general email notifications
                  </div>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      emailNotifications: checked,
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-base font-medium">
                    Order Notifications
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Get notified when new orders are placed
                  </div>
                </div>
                <Switch
                  checked={notificationSettings.orderNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      orderNotifications: checked,
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-base font-medium">
                    Review Notifications
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Get notified when customers leave reviews
                  </div>
                </div>
                <Switch
                  checked={notificationSettings.reviewNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      reviewNotifications: checked,
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-base font-medium">Inventory Alerts</div>
                  <div className="text-sm text-muted-foreground">
                    Get alerts when products are running low
                  </div>
                </div>
                <Switch
                  checked={notificationSettings.inventoryAlerts}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      inventoryAlerts: checked,
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-base font-medium">Marketing Emails</div>
                  <div className="text-sm text-muted-foreground">
                    Receive marketing tips and product updates
                  </div>
                </div>
                <Switch
                  checked={notificationSettings.marketingEmails}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      marketingEmails: checked,
                    })
                  }
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleNotificationsSave}
                  disabled={loading}
                  className="min-w-32"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-base font-medium">
                    Two-Factor Authentication
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={
                      securitySettings.twoFactorAuth ? "default" : "secondary"
                    }
                  >
                    {securitySettings.twoFactorAuth ? "Enabled" : "Disabled"}
                  </Badge>
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({
                        ...securitySettings,
                        twoFactorAuth: checked,
                      })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (hours)</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="session-timeout"
                    type="number"
                    min="1"
                    max="168"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        sessionTimeout: parseInt(e.target.value) || 24,
                      })
                    }
                    className="w-24"
                  />
                  <p className="text-sm text-muted-foreground">
                    Automatically log out after this many hours of inactivity
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="password-policy">Password Policy</Label>
                <Select
                  value={securitySettings.passwordPolicy}
                  onValueChange={(value) =>
                    setSecuritySettings({
                      ...securitySettings,
                      passwordPolicy: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">
                      Basic - 8 characters minimum
                    </SelectItem>
                    <SelectItem value="standard">
                      Standard - 8+ chars with numbers
                    </SelectItem>
                    <SelectItem value="strong">
                      Strong - 12+ chars with special characters
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="ip-whitelist">IP Whitelist</Label>
                <Textarea
                  id="ip-whitelist"
                  placeholder="Enter IP addresses (one per line)"
                  value={securitySettings.ipWhitelist}
                  onChange={(e) =>
                    setSecuritySettings({
                      ...securitySettings,
                      ipWhitelist: e.target.value,
                    })
                  }
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Only allow admin access from these IP addresses (leave empty
                  to allow all)
                </p>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSecuritySave}
                  disabled={loading}
                  className="min-w-32"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                Advanced Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    System Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary rounded-lg">
                      <div className="text-sm font-medium text-muted-foreground">
                        Database Status
                      </div>
                      <div className="text-lg font-semibold text-green-600">
                        Connected
                      </div>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg">
                      <div className="text-sm font-medium text-muted-foreground">
                        Cache Status
                      </div>
                      <div className="text-lg font-semibold text-blue-600">
                        Active
                      </div>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg">
                      <div className="text-sm font-medium text-muted-foreground">
                        Storage Used
                      </div>
                      <div className="text-lg font-semibold">
                        2.4 GB / 10 GB
                      </div>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg">
                      <div className="text-sm font-medium text-muted-foreground">
                        API Requests
                      </div>
                      <div className="text-lg font-semibold">1,234 today</div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-2">Maintenance</h3>
                  <div className="space-y-3">
                    <Button variant="outline" size="sm">
                      Clear Cache
                    </Button>
                    <Button variant="outline" size="sm">
                      Rebuild Search Index
                    </Button>
                    <Button variant="outline" size="sm">
                      Export Database
                    </Button>
                    <Button variant="destructive" size="sm">
                      Reset Settings
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    API Configuration
                  </h3>
                  <div className="space-y-2">
                    <Label>API Rate Limit</Label>
                    <div className="text-sm text-muted-foreground">
                      Current limit: 1000 requests per hour
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
