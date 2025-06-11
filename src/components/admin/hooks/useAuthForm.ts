
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useAuthForm = () => {
  const { signIn, signUp, resetPassword, loading } = useAuth();
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);

    console.log('useAuthForm: Form submission', {
      isResetPassword,
      isSignUp,
      email: formData.email
    });

    try {
      if (isResetPassword) {
        const { error } = await resetPassword(formData.email);
        if (error) {
          setError(error.message);
        } else {
          setMessage('Password reset email sent! Check your inbox.');
        }
      } else if (isSignUp) {
        const { error } = await signUp(formData.email, formData.password);
        if (error) {
          setError(error.message);
        } else {
          setMessage('Account created! Check your email to verify your account.');
        }
      } else {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          setError(error.message);
        }
        // Success will be handled by the auth context state change
      }
    } catch (err) {
      console.error('useAuthForm: Submission error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (error) setError('');
    if (message) setMessage('');
  };

  const switchToReset = () => {
    setIsResetPassword(true);
    setIsSignUp(false);
    setError('');
    setMessage('');
  };

  const switchToSignIn = () => {
    setIsResetPassword(false);
    setIsSignUp(false);
    setError('');
    setMessage('');
  };

  const switchToSignUp = () => {
    setIsResetPassword(false);
    setIsSignUp(true);
    setError('');
    setMessage('');
  };

  return {
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
  };
};
