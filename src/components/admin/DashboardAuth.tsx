
import React from 'react';
import { AuthForm } from './AuthForm';
import { BetaNotice } from './BetaNotice';
import { useAuthForm } from './hooks/useAuthForm';

export const DashboardAuth = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 pt-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto flex items-center justify-center">
            <div className="text-white text-2xl font-bold">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="7" fill="currentColor" rx="1"/>
                <rect x="14" y="3" width="7" height="7" fill="currentColor" rx="1"/>
                <rect x="3" y="14" width="7" height="7" fill="currentColor" rx="1"/>
                <rect x="14" y="14" width="7" height="7" fill="currentColor" rx="1"/>
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Sign in to manage your job hunting</p>
          </div>
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
        <BetaNotice />
      </div>
    </div>
  );
};
