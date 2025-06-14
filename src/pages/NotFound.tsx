
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Frown } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      window.location.pathname
    );
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100/70 via-white to-blue-50 dark:bg-background px-6">
      <div className="max-w-md w-full text-center bg-white dark:bg-card rounded-xl shadow-lg p-8 animate-fade-in flex flex-col items-center gap-6 border md:p-12">
        <div className="bg-blue-100 dark:bg-muted rounded-full p-4 flex items-center justify-center mb-2 shadow">
          <Frown className="h-12 w-12 text-blue-500 dark:text-blue-400" strokeWidth={2.5} />
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-blue-700 dark:text-primary mb-1">404</h1>
        <p className="text-xl font-semibold text-gray-700 dark:text-foreground">Page not found</p>
        <p className="text-sm text-muted-foreground mb-4">
          Sorry, the page you are looking for doesn't exist or has been moved.<br />
          If you believe this is an error, please contact support.
        </p>
        <Button
          className="mt-2 px-6 py-3 text-base rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all"
          onClick={() => navigate("/dashboard")}
        >
          Go back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
