
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Mail, Eye, EyeOff, AlertCircle, Lock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AuthFormProps {
  isResetPassword: boolean;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  formData: {
    email: string;
    password: string;
  };
  error: string;
  message: string;
  isSubmitting: boolean;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (field: string, value: string) => void;
  onSwitchToReset: () => void;
  onSwitchToSignIn: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  isResetPassword,
  showPassword,
  setShowPassword,
  formData,
  error,
  message,
  isSubmitting,
  loading,
  onSubmit,
  onInputChange,
  onSwitchToReset,
  onSwitchToSignIn,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            required
            className="pl-10 border-2 focus:border-blue-500 focus:ring-blue-500/20"
            disabled={isSubmitting}
          />
          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Password Field (Not shown for reset) */}
      {!isResetPassword && (
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => onInputChange('password', e.target.value)}
              required
              className="pl-10 pr-10 border-2 focus:border-blue-500 focus:ring-blue-500/20"
              disabled={isSubmitting}
            />
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isSubmitting}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="destructive" className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Message */}
      {message && (
        <Alert className="bg-green-50 border-green-200">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">{message}</AlertDescription>
        </Alert>
      )}

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200" 
        disabled={isSubmitting || loading}
      >
        {isSubmitting 
          ? 'Processing...' 
          : isResetPassword 
            ? 'Send Reset Email' 
            : 'Sign In'
        }
      </Button>

      {/* Password Reset Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {isResetPassword ? 'Remember your password? ' : 'Forgot your password? '}
          <button
            type="button"
            onClick={isResetPassword ? onSwitchToSignIn : onSwitchToReset}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            disabled={isSubmitting}
          >
            {isResetPassword ? 'Sign In' : 'Reset Password'}
          </button>
        </p>
      </div>
    </form>
  );
};
