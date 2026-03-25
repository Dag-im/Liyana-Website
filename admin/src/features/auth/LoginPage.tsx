import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { login } from '@/api/auth.api';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/features/auth/useAuth';
import { showErrorToast } from '@/lib/error-utils';
import { ShieldCheck } from 'lucide-react';

const loginSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const authQuery = useAuth();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: (values: LoginSchema) => login(values.email, values.password),
    onSuccess: (user) => {
      queryClient.setQueryData(['auth', 'me'], user);
      navigate('/', { replace: true });
    },
    onError: (error) => showErrorToast(error, 'Login failed'),
  });

  useEffect(() => {
    if (authQuery.data) {
      navigate('/', { replace: true });
    }
  }, [authQuery.data, navigate]);

  if (authQuery.isLoading) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--color-brand-red)_8%,transparent),transparent_42%),radial-gradient(circle_at_bottom_right,color-mix(in_srgb,var(--color-brand-cyan)_7%,transparent),transparent_40%)]" />

      <Card className="relative w-full max-w-4xl border-border/80 bg-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur">
        <div className="grid items-stretch lg:grid-cols-[1.05fr_1fr]">
          <div className="hidden border-r border-border/80 bg-white/70 p-10 lg:block">
            <div className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Liyana Admin Console
            </h1>
            <p className="mt-3 max-w-sm text-sm text-slate-500">
              Secure operational workspace for content, bookings, and system
              administration.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <CardHeader className="px-0 pt-0">
              <CardTitle>Sign in</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <Form {...form}>
                <form
                  className="space-y-4"
                  onSubmit={form.handleSubmit((values) =>
                    loginMutation.mutate(values)
                  )}
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="email"
                            placeholder="you@example.com"
                            {...field}
                            type="email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="current-password"
                            placeholder="••••••••"
                            {...field}
                            type="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    className="w-full"
                    disabled={loginMutation.isPending}
                    size="lg"
                    type="submit"
                  >
                    {loginMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : null}
                    Sign in
                  </Button>
                </form>
              </Form>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
}
