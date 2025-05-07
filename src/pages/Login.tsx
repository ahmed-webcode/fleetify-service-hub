
import { useState, useEffect } from "react";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useJWTAuth } from "@/contexts/JWTAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, AlertCircle, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login: mockLogin } = useAuth();
  const { login: jwtLogin, user } = useJWTAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state if available
  const from = location.state?.from?.pathname || "/dashboard";

  // If already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check if user was logged out (via state)
  useEffect(() => {
    if (location.state?.loggedOut) {
      toast.info("You have been logged out");
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Try JWT auth first
      const success = await jwtLogin(username, password);
      
      if (success) {
        toast.success(`Welcome back!`);
        navigate(from, { replace: true });
        return;
      } 
      
      // If JWT auth fails, try the mock auth as fallback
      const mockSuccess = await mockLogin(username, password);
      if (mockSuccess) {
        toast.success(`Welcome back!`);
        navigate(from, { replace: true });
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Sample credentials to show on the login page
  const credentialInfo = [
    { role: "Transport Director", username: "transport_director", description: "Full system access" },
    { role: "Operational Director", username: "operational_director", description: "Request services" },
    { role: "FOTL", username: "fotl", description: "Fuel approvals" },
    { role: "FTL", username: "ftl", description: "Fleet approvals" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <Car className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold">FleetHub</h1>
          <p className="text-slate-600">Addis Ababa University Fleet Management</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  disabled={isLoading}
                  className="border-slate-300"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={isLoading}
                  className="border-slate-300"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <div className="w-full text-sm text-slate-500">
              <p className="mb-2 font-medium">Demo credentials (use password: password123)</p>
              <div className="grid grid-cols-2 gap-2">
                {credentialInfo.map((cred) => (
                  <div key={cred.username} className="border rounded p-2 text-xs hover:bg-slate-50 cursor-pointer" onClick={() => setUsername(cred.username)}>
                    <div className="font-medium flex items-center gap-1">
                      <Shield className="h-3 w-3 text-primary" />
                      {cred.role}
                    </div>
                    <div className="text-slate-400">@{cred.username}</div>
                    <div className="text-slate-500 text-[10px] mt-1">{cred.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
