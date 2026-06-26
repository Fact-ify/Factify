'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ShieldCheck, Eye, EyeOff, Loader2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminStore } from '@/store/admin-store';

interface SetupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function AdminSetupForm() {
  const router = useRouter();
  const setupAdmin = useAdminStore((s) => s.setupAdmin);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SetupForm>({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSetup = async (data: SetupForm) => {
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    setError('');
    const result = await setupAdmin(data.name, data.email, data.password);
    setSubmitting(false);

    if (result.success) {
      router.push('/admin');
      router.refresh();
    } else {
      setError(result.error ?? 'Setup failed');
    }
  };

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
          <h1 className="text-3xl font-bold mb-4">Set Up Your Admin Account</h1>
          <p className="text-white/70 leading-relaxed">
            Create the one admin account for this site. After that, only sign in will be available.
          </p>
        </motion.div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6 bg-factify-gray/20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="rounded-xl border border-factify-gray bg-white p-8 shadow-factify-md">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-factify-navy">Create admin account</h2>
              <p className="text-sm text-factify-gray-dark mt-1">
                This can only be done once. Choose your credentials carefully.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSetup)} className="space-y-5">
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  placeholder="Admin User"
                  disabled={submitting}
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && <p className="text-sm text-factify-error mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <Label htmlFor="setup-email">Email address</Label>
                <Input
                  id="setup-email"
                  type="email"
                  placeholder="you@example.com"
                  disabled={submitting}
                  {...register('email', { required: 'Email is required' })}
                />
                {errors.email && <p className="text-sm text-factify-error mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <Label htmlFor="setup-password">Password</Label>
                <div className="relative">
                  <Input
                    id="setup-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 8 characters"
                    disabled={submitting}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 8, message: 'Password must be at least 8 characters' },
                    })}
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

              <div>
                <Label htmlFor="confirm-password">Confirm password</Label>
                <Input
                  id="confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  disabled={submitting}
                  {...register('confirmPassword', { required: 'Please confirm your password' })}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-factify-error mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Create Admin Account
                  </>
                )}
              </Button>
            </form>
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
