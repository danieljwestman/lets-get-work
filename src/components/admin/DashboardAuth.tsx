
import React from 'react';
import { LayoutDashboard } from 'lucide-react';
import { useAuthForm } from './hooks/useAuthForm';
import { BetaNotice } from './BetaNotice';
import { AuthForm } from './AuthForm';

export const DashboardAuth: React.FC = () => {
  const {
    isResetPassword,
    isSignUp,
    showPassword,
    setShowPassword,
    formData,
    error,
    message,
    isSubmitting,
    loading,
    handleSubmit,
    handleInputChange,
    switchToReset,
    switchToSignIn,
    switchToSignUp,
  } = useAuthForm();

  const getTitle = () => {
    if (isResetPassword) return 'Reset Password';
    if (isSignUp) return 'Create Account';
    return 'Dashboard';
  };

  const getSubtitle = () => {
    if (isResetPassword) return 'Enter your email to receive a password reset link';
    if (isSignUp) return 'Create your account to manage your job hunting opportunities';
    return 'Sign in to manage your job hunting';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-pink-400 via-purple-400 via-blue-400 to-cyan-400">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white/95 backdrop-blur-md border-0 shadow-2xl rounded-lg p-6">
          <div className="text-center mb-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <LayoutDashboard className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{getTitle()}</h1>
            <p className="text-gray-600">
              {getSubtitle()}
            </p>
          </div>

          <AuthForm
            isResetPassword={isResetPassword}
            isSignUp={isSignUp}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            formData={formData}
            error={error}
            message={message}
            isSubmitting={isSubmitting}
            loading={loading}
            onSubmit={handleSubmit}
            onInputChange={handleInputChange}
            onSwitchToReset={switchToReset}
            onSwitchToSignIn={switchToSignIn}
            onSwitchToSignUp={switchToSignUp}
          />

          {/* Beta Notice moved to bottom and only shown when not in reset password mode */}
          {!isResetPassword && <BetaNotice />}
        </div>
      </div>
    </div>
  );
};
