'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ShieldCheck, Eye, EyeOff, Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminStore } from '@/store/admin-store';

interface LoginForm {
  email: string;
  password: string;
}

export default function AdminLoginForm() {
  const router = useRouter();
  const login = useAdminStore((s) => s.login);
  const checkSession = useAdminStore((s) => s.checkSession);
  const isAuthenticated = useAdminStore((s) => s.isAuthenticated);
  const isLoading = useAdminStore((s) => s.isLoading);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (isAuthenticated) router.replace('/admin');
  }, [isAuthenticated, router]);

  const onSubmit = async (data: LoginForm) => {
    setSubmitting(true);
    setError('');
    const result = await login(data.email, data.password);
    setSubmitting(false);
    if (result.success) {
      router.push('/admin');
    } else {
      setError(result.error ?? 'Login failed');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-factify-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 gradient-navy items-center justify-center p-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="max-w-md text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-factify-gold">
              <ShieldCheck className="h-7 w-7 text-factify-navy" />
            </div>
            <div>
              <p className="text-2xl font-bold">FACTIFY</p>
              <p className="text-sm text-white/60">Admin Console</p>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4">Manage Your Platform</h1>
          <p className="text-white/70 leading-relaxed mb-8">
            Access analytics, manage page content, edit articles and testimonials, and configure site settings.
          </p>
        </motion.div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6 bg-factify-gray/20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="rounded-xl border border-factify-gray bg-white p-8 shadow-factify-md">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-factify-navy">Sign in to Admin</h2>
              <p className="text-sm text-factify-gray-dark mt-1">Use your admin credentials to access the dashboard</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@factify.com"
                  disabled={submitting}
                  {...register('email', { required: 'Email is required' })}
                />
                {errors.email && <p className="text-sm text-factify-error mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    disabled={submitting}
                    {...register('password', { required: 'Password is required' })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-factify-gray-dark hover:text-factify-navy"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-factify-error mt-1">{errors.password.message}</p>}
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-factify-gray-dark mt-6">
            <Link href="/" className="text-factify-gold hover:underline">Back to Factify</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
