
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PasscodeModalProps {
  isOpen: boolean;
  personName: string;
  onPasscodeVerify: (passcode: string) => Promise<boolean>;
  onClose?: () => void;
}

export const PasscodeModal: React.FC<PasscodeModalProps> = ({
  isOpen,
  personName,
  onPasscodeVerify,
  onClose
}) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log('PasscodeModal: Rendered with props:', {
    isOpen,
    personName,
    hasOnPasscodeVerify: !!onPasscodeVerify
  });

  useEffect(() => {
    if (isOpen) {
      console.log('PasscodeModal: Modal opened, resetting state');
      setPasscode('');
      setError('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('PasscodeModal: Form submitted with passcode length:', passcode.length);
    
    if (!passcode.trim()) {
      setError('Please enter a passcode');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      console.log('PasscodeModal: Verifying passcode');
      const isValid = await onPasscodeVerify(passcode.trim());
      
      console.log('PasscodeModal: Verification result:', isValid);
      
      if (!isValid) {
        setError('Invalid passcode. Please try again.');
        setIsSubmitting(false);
      }
      // If valid, the modal will be closed by the parent component
    } catch (err) {
      console.error('PasscodeModal: Error verifying passcode:', err);
      setError('An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-pink-400 via-purple-400 via-blue-400 to-cyan-400">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white/95 backdrop-blur-md border-0 shadow-2xl rounded-lg p-6">
          <div className="text-center mb-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Lock className="h-10 w-10 text-white" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600">
                Enter a passcode to access {personName}'s presentation
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="passcode"
                  type="text"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Your Passcode"
                  className="text-center text-lg py-3 border-2 focus:border-blue-500 focus:ring-blue-500/20"
                  autoFocus
                  disabled={isSubmitting}
                />
              </div>

              {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200" 
                disabled={isSubmitting || !passcode.trim()}
              >
                {isSubmitting ? 'Verifying...' : 'Check Out Presentation'}
              </Button>
            </form>

            <div className="text-center pt-2">
              <p className="text-sm text-gray-600">
                Need the passcode? Contact the opportunity owner.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
