
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useAuthForm = () => {
  const { signIn, resetPassword, loading } = useAuth();
  const [isResetPassword, setIsResetPassword] = useState(false);
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

    try {
      if (isResetPassword) {
        const { error } = await resetPassword(formData.email);
        if (error) {
          setError(error.message);
        } else {
          setMessage('Password reset email sent! Check your inbox.');
          setFormData({ email: '', password: '' });
        }
      } else {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          setError(error.message);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const resetForm = () => {
    setFormData({ email: '', password: '' });
    setError('');
    setMessage('');
  };

  const switchToReset = () => {
    resetForm();
    setIsResetPassword(true);
  };

  const switchToSignIn = () => {
    resetForm();
    setIsResetPassword(false);
  };

  return {
    isResetPassword,
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
  };
};
