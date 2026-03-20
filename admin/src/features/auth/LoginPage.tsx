import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
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
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    },
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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--color-brand-cyan)_18%,transparent),transparent_40%),radial-gradient(circle_at_bottom_right,color-mix(in_oklab,var(--color-brand-purple)_14%,transparent),transparent_36%)]" />

      <Card className="relative w-full max-w-4xl border-border/80 bg-card/95 shadow-xl backdrop-blur">
        <div className="grid items-stretch lg:grid-cols-[1.05fr_1fr]">
          <div className="hidden border-r border-border/80 bg-muted/25 p-10 lg:block">
            <div className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-xl brand-gradient text-white shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Liyana Admin Console
            </h1>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
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
