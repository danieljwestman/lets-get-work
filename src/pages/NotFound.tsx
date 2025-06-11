
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const isOpportunityNotFound = location.pathname === "/404";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            {isOpportunityNotFound ? "Opportunity Not Found" : "Page Not Found"}
          </h2>
          <p className="text-gray-600 mb-8">
            {isOpportunityNotFound 
              ? "The opportunity you're looking for doesn't exist or may have been removed."
              : "The page you're looking for doesn't exist or has been moved."
            }
          </p>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={() => window.location.href = "/"} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Go to Home
          </Button>
          
          {isOpportunityNotFound && (
            <p className="text-sm text-gray-500 mt-4">
              If you believe this is an error, please contact the site administrator.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
