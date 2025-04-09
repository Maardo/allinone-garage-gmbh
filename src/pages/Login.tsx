
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Login() {
  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Registration state
  const [regEmail, setRegEmail] = useState("");
  const [regName, setRegName] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  
  const { login, register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Handle login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        toast.success(t("login.successMessage"));
        navigate("/overview");
      } else {
        toast.error(t("login.invalidCredentials"));
      }
    } catch (error) {
      toast.error(t("login.failedMessage"));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle registration submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    
    // Basic validation
    if (!regEmail.includes("@") || !regEmail.includes(".")) {
      toast.error(t("register.invalidEmail"));
      setIsRegistering(false);
      return;
    }

    if (regPassword.length < 6) {
      toast.error(t("register.passwordTooShort"));
      setIsRegistering(false);
      return;
    }

    if (regPassword !== regConfirmPassword) {
      toast.error(t("register.passwordsDoNotMatch"));
      setIsRegistering(false);
      return;
    }

    try {
      const success = await register(regName, regEmail, regPassword);
      
      if (success) {
        toast.success(t("register.successMessage"));
        navigate("/overview");
      } else {
        toast.error(t("register.failedMessage"));
      }
    } catch (error) {
      toast.error(t("register.failedMessage"));
      console.error(error);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-3">
      <div className="w-full max-w-md animate-scale-in">
        <Card className="border-none shadow-lg glass-panel backdrop-blur-md bg-white/90">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-3 h-14 w-14 rounded-full bg-primary/10 p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-full w-full text-primary"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold">{t("login.title")}</CardTitle>
            <CardDescription className="text-sm">
              {t("login.subtitle")}
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-3">
              <TabsTrigger value="login">{t("login.signIn")}</TabsTrigger>
              <TabsTrigger value="register">{t("register.createAccount")}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLoginSubmit}>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="email">{t("login.email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@workshop.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="transition-all text-sm sm:text-base"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">{t("login.password")}</Label>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="transition-all text-sm sm:text-base"
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p>{t("login.demoAccounts")}</p>
                    <ul className="list-disc list-inside mt-1">
                      <li>{t("login.adminAccount")}</li>
                      <li>{t("login.mechanicAccount")}</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                        <span className="ml-2">{t("login.loggingIn")}</span>
                      </div>
                    ) : (
                      t("login.signIn")
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegisterSubmit}>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="reg-name">{t("register.name")}</Label>
                    <Input
                      id="reg-name"
                      type="text"
                      placeholder={t("register.fullName")}
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                      className="transition-all text-sm sm:text-base"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="reg-email">{t("register.workEmail")}</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="your.name@workshop.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                      className="transition-all text-sm sm:text-base"
                    />
                    <p className="text-xs text-muted-foreground">{t("register.workEmailNote")}</p>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="reg-password">{t("register.password")}</Label>
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                      className="transition-all text-sm sm:text-base"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="reg-confirm-password">{t("register.confirmPassword")}</Label>
                    <Input
                      id="reg-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      required
                      className="transition-all text-sm sm:text-base"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full transition-all"
                    disabled={isRegistering}
                  >
                    {isRegistering ? (
                      <div className="flex items-center justify-center">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                        <span className="ml-2">{t("register.processing")}</span>
                      </div>
                    ) : (
                      t("register.createAccount")
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
