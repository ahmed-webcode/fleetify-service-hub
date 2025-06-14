import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, ROLE_DETAILS } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import type { Role } from "@/contexts/AuthContext";

// Role selection screen after successful login
const RoleSelection = ({ roles, onSelect }: { roles: Role[], onSelect: (role: Role) => void }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold">Select Your Role</h2>
        <p className="text-slate-600">Choose which role you would like to use for this session</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role) => {
          const roleDetails = ROLE_DETAILS[role.id];
          return (
            <Card 
              key={role.id} 
              className="cursor-pointer hover:border-primary hover:shadow-md transition-all"
              onClick={() => onSelect(role)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{roleDetails?.name || role.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  {roleDetails?.description || "Role in the fleet management system"}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, roles, selectRole, selectedRole } = useAuth();
  const location = useLocation();
  
  // Get the redirect path from location state if available
  const from = location.state?.from?.pathname || "/dashboard";

  // If already fully logged in, redirect to dashboard
  if (isAuthenticated && selectedRole) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show role selection if authenticated but no role selected yet
  if (isAuthenticated && roles.length > 1 && !selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
              <Car className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold">FleetHub</h1>
            <p className="text-slate-600">Addis Ababa University Fleet Management</p>
          </div>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="py-6">
              <RoleSelection roles={roles} onSelect={selectRole} />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Attempt login via our auth context
      const { success, multipleRoles } = await login(username, password);
      
      if (success) {
        // If we have multiple roles, the role selection page will show next
        // If only one role, we'll redirect automatically to the dashboard
        if (!multipleRoles) {
          // No need to do anything here, redirect will happen automatically
          // since selectedRole will be set in the auth context
        }
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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
              Enter your credentials to access the fleet management system
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
                <Label htmlFor="password">Password</Label>
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
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            {/* Demo account text removed as requested */}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
