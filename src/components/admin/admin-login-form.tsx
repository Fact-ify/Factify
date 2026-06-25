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
import { DEMO_ADMIN } from '@/data/mock/cms-content';

interface LoginForm {
  email: string;
  password: string;
}

export default function AdminLoginForm() {
  const router = useRouter();
  const login = useAdminStore((s) => s.login);
  const isAuthenticated = useAdminStore((s) => s.isAuthenticated);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (isAuthenticated) router.replace('/admin');
  }, [isAuthenticated, router]);

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError('');
    const result = await login(data.email, data.password);
    setIsLoading(false);
    if (result.success) {
      router.push('/admin');
    } else {
      setError(result.error ?? 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 gradient-navy items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md text-white"
        >
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
            Access analytics, manage page content, edit articles and testimonials, and configure
            site settings — all from one dashboard.
          </p>
          <ul className="space-y-3 text-sm text-white/60">
            {['Verification analytics', 'Page content CMS', 'Article management', 'Site settings'].map(
              (item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-factify-gold" />
                  {item}
                </li>
              )
            )}
          </ul>
        </motion.div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6 bg-factify-gray/20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-factify-navy">
              <ShieldCheck className="h-5 w-5 text-factify-gold" />
            </div>
            <span className="text-lg font-bold text-factify-navy">FACTIFY Admin</span>
          </div>

          <div className="rounded-xl border border-factify-gray bg-white p-8 shadow-factify-md">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-factify-navy">Sign in to Admin</h2>
              <p className="text-sm text-factify-gray-dark mt-1">
                Enter your credentials to access the dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@factify.com"
                  disabled={isLoading}
                  {...register('email', { required: 'Email is required' })}
                />
                {errors.email && (
                  <p className="text-sm text-factify-error mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    disabled={isLoading}
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
                {errors.password && (
                  <p className="text-sm text-factify-error mt-1">{errors.password.message}</p>
                )}
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? (
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

            <div className="mt-6 rounded-lg bg-factify-gold/10 border border-factify-gold/30 p-4">
              <p className="text-xs font-semibold text-factify-navy mb-2">Demo Credentials</p>
              <p className="text-xs text-factify-gray-dark font-mono">
                {DEMO_ADMIN.email}
              </p>
              <p className="text-xs text-factify-gray-dark font-mono">
                {DEMO_ADMIN.password}
              </p>
            </div>
          </div>

          <p className="text-center text-sm text-factify-gray-dark mt-6">
            <Link href="/" className="text-factify-gold hover:underline">
              Back to Factify
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
