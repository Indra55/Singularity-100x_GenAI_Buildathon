import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ToastAction } from "@/components/ui/toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (requiresOnboarding: boolean) => void;
}

interface FormData {
  email: string;
  password: string;
  fullName: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    fullName: ""
  });
  const { toast } = useToast();
  const { login, register } = useAuth();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEmailAuth = async (isSignUp = false) => {
    setIsLoading(true);
    try {
      if (isSignUp) {
        const { requiresOnboarding } = await register(
          formData.fullName,
          formData.email,
          formData.password
        );
        
        toast({
          title: "Success",
          description: "Account created successfully!",
        });

        // Pass onboarding status to parent component
        onSuccess(requiresOnboarding);
      } else {
        const { requiresOnboarding } = await login(
          formData.email,
          formData.password
        );
        
        toast({
          title: "Success",
          description: "Welcome back!",
        });

        // Pass onboarding status to parent component
        onSuccess(requiresOnboarding);
      }
    } catch (error) {
      console.error("Auth error:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Authentication failed. Please try again.';
      
      toast({
        title: "Error",
        variant: "destructive",
        description: errorMessage,
        action: <ToastAction altText="Try again" onClick={() => {}}>Try again</ToastAction>,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Welcome to TalentGPT
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="signin-password">Password</Label>
                <div className="relative">
                  <Input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button 
                onClick={() => handleEmailAuth(false)} 
                className="w-full bg-pulse-500 hover:bg-pulse-600"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button 
                onClick={() => handleEmailAuth(true)} 
                className="w-full bg-pulse-500 hover:bg-pulse-600"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <p className="text-xs text-center text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;