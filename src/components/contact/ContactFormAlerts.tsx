
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface ContactFormAlertsProps {
  success: boolean;
  error: string;
  rateLimitError: string;
}

export const ContactFormAlerts: React.FC<ContactFormAlertsProps> = ({
  success,
  error,
  rateLimitError
}) => {
  return (
    <>
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Message sent successfully! I'll get back to you soon.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {rateLimitError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{rateLimitError}</AlertDescription>
        </Alert>
      )}
    </>
  );
};
