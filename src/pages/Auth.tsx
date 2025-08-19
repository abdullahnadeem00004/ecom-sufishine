import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  Shield,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import SufiShineLogo from "@/components/ui/SufiShineLogo";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { signIn, signUp, signInWithGoogle, signOut, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    navigate("/");
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin) {
      if (!formData.firstName) {
        newErrors.firstName = "First name is required";
      }
      if (!formData.lastName) {
        newErrors.lastName = "Last name is required";
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({
              title: "Login failed",
              description: "Invalid email or password. Please try again.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Login failed",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          // Check if user is admin and redirect accordingly
          if (isAdminLogin) {
            // Get user profile to check role
            const { data: profile } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", (await supabase.auth.getUser()).data.user?.id)
              .single();

            if (profile?.role === "admin") {
              toast({
                title: "Welcome Admin!",
                description:
                  "You have been successfully logged in to the admin panel.",
              });
              navigate("/admin");
            } else {
              toast({
                title: "Access Denied",
                description: "You don't have admin privileges.",
                variant: "destructive",
              });
              await signOut();
            }
          } else {
            toast({
              title: "Welcome back!",
              description: "You have been successfully logged in.",
            });
            navigate("/");
          }
        }
      } else {
        const { error } = await signUp(formData.email, formData.password, {
          first_name: formData.firstName,
          last_name: formData.lastName,
        });

        if (error) {
          if (error.message.includes("User already registered")) {
            toast({
              title: "Account exists",
              description:
                "An account with this email already exists. Please sign in instead.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Sign up failed",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Account created!",
            description: "Please check your email to verify your account.",
          });
          setIsLogin(true);
        }
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await signInWithGoogle();

      if (error) {
        console.error("Google sign in error:", error);
        toast({
          title: "Google sign in failed",
          description:
            error.message || "An error occurred during Google sign in",
          variant: "destructive",
        });
      } else {
        // The user will be redirected to Google, so we don't need to show success message here
      }
    } catch (error) {
      console.error("Google sign in exception:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 to-muted/50 spiritual-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8 animate-fade-in">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 hover-glow"
          >
            <SufiShineLogo className="h-12 w-auto text-primary" />
            <span className="font-script text-3xl font-bold text-primary">
              SUFI SHINE
            </span>
          </Link>
          <p className="mt-2 text-muted-foreground">
            {isAdminLogin
              ? "Admin Portal Access"
              : isLogin
              ? "Welcome back to your journey"
              : "Begin your organic beauty journey"}
          </p>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              {isAdminLogin && <Shield className="h-6 w-6 text-primary" />}
              {isAdminLogin
                ? "Admin Login"
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </CardTitle>
            <CardDescription>
              {isAdminLogin
                ? "Enter your admin credentials to access the dashboard"
                : isLogin
                ? "Enter your credentials to access your account"
                : "Join our community of natural beauty enthusiasts"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Admin/User Toggle */}
            {isLogin && (
              <div className="flex items-center justify-center space-x-4 mb-4">
                <Button
                  type="button"
                  variant={!isAdminLogin ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsAdminLogin(false)}
                  disabled={isLoading}
                >
                  <User className="mr-2 h-4 w-4" />
                  User Login
                </Button>
                <Button
                  type="button"
                  variant={isAdminLogin ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsAdminLogin(true)}
                  disabled={isLoading}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Login
                </Button>
              </div>
            )}

            {/* Google Sign In - Only for regular users */}
            {!isAdminLogin && (
              <Button
                variant="outline"
                className="w-full hover-glow"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
            )}

            {/* Separator - Only show if not admin login */}
            {!isAdminLogin && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && !isAdminLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`pl-10 ${
                          errors.firstName ? "border-destructive" : ""
                        }`}
                        disabled={isLoading}
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-xs text-destructive">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`pl-10 ${
                          errors.lastName ? "border-destructive" : ""
                        }`}
                        disabled={isLoading}
                      />
                    </div>
                    {errors.lastName && (
                      <p className="text-xs text-destructive">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`pl-10 ${
                      errors.email ? "border-destructive" : ""
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`pl-10 pr-10 ${
                      errors.password ? "border-destructive" : ""
                    }`}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password}</p>
                )}
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`pl-10 ${
                        errors.confirmPassword ? "border-destructive" : ""
                      }`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              <Button
                type="submit"
                className="w-full btn-spiritual"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </>
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Switch between login/signup - Only for regular users */}
            {!isAdminLogin && (
              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  {isLogin
                    ? "Don't have an account? "
                    : "Already have an account? "}
                </span>
                <Button
                  variant="link"
                  className="p-0 font-medium text-primary hover:underline"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setErrors({});
                    setFormData({
                      email: "",
                      password: "",
                      firstName: "",
                      lastName: "",
                      confirmPassword: "",
                    });
                  }}
                  disabled={isLoading}
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </Button>
              </div>
            )}

            {!isLogin && !isAdminLogin && (
              <Alert>
                <AlertDescription className="text-xs">
                  By creating an account, you agree to our spiritual principles
                  of natural beauty and sustainable practices. Welcome to the
                  SUFI SHINE community! 🌿
                </AlertDescription>
              </Alert>
            )}

            {isAdminLogin && (
              <Alert>
                <AlertDescription className="text-xs flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Admin access only. Please contact support if you need admin
                  privileges.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <Button variant="link" asChild>
            <Link to="/" className="text-muted-foreground hover:text-primary">
              ← Back to Sufi Shine
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
