import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/TradeApp/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import {
  fetchProfile,
  updateProfile,
  updatePassword,
  signOut,
} from '@/lib/supabase';
import { getTrialInfo } from '@/lib/tradeStats';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

const passwordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => fetchProfile(user.id),
    enabled: Boolean(user?.id),
  });

  const trial = profile ? getTrialInfo(profile) : null;

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    values: { name: profile?.name || '' },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const profileMutation = useMutation({
    mutationFn: (values) => updateProfile(user.id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: 'Profile Updated',
        description: 'Your name has been saved.',
        className: 'bg-emerald-500 text-white',
      });
    },
    onError: (err) => {
      toast({ variant: 'destructive', title: 'Update Failed', description: err.message });
    },
  });

  const passwordMutation = useMutation({
    mutationFn: (values) => updatePassword(values.password),
    onSuccess: () => {
      passwordForm.reset();
      setShowPasswordForm(false);
      toast({
        title: 'Password Updated',
        description: 'Your password has been changed.',
        className: 'bg-emerald-500 text-white',
      });
    },
    onError: (err) => {
      toast({ variant: 'destructive', title: 'Password Change Failed', description: err.message });
    },
  });

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/app');
    } catch (err) {
      toast({ variant: 'destructive', title: 'Logout Failed', description: err.message });
    }
  };

  if (isLoading) {
    return (
      <AppLayout showFab={false}>
        <div className="flex justify-center py-24">
          <Spinner className="w-8 h-8 text-emerald-500" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout showFab={false}>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="py-12 text-center text-red-400">
            Failed to load profile: {error.message}
          </CardContent>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout showFab={false}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <User className="w-8 h-8 text-emerald-500" />
          <h1 className="text-3xl font-bold font-heading text-white">Profile</h1>
        </div>

        {/* Account status */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-500" />
              Account Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {trial?.isActive ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                <p className="text-emerald-400 font-semibold">Free Trial Active</p>
                <p className="text-gray-400 text-sm mt-1">
                  {trial.daysLeft} day{trial.daysLeft !== 1 ? 's' : ''} remaining — full access until{' '}
                  {format(trial.endDate, 'dd MMM yyyy')}
                </p>
              </div>
            ) : (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <p className="text-amber-400 font-semibold">Trial Ended</p>
                <p className="text-gray-400 text-sm mt-1">
                  Subscribe to unlock the full detailed dashboard. (Coming in next update)
                </p>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4" />
              Member since {format(new Date(profile.created_at), 'dd MMM yyyy')}
            </div>
          </CardContent>
        </Card>

        {/* Edit profile */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Personal Info</CardTitle>
            <CardDescription className="text-gray-400">
              Update your display name
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...profileForm}>
              <form
                onSubmit={profileForm.handleSubmit((v) => profileMutation.mutate(v))}
                className="space-y-4"
              >
                <FormField
                  control={profileForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            className="pl-10 bg-gray-900 border-gray-600 text-white"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <FormLabel className="text-gray-300">Email</FormLabel>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      value={user?.email || profile.email || ''}
                      disabled
                      className="pl-10 bg-gray-900/50 border-gray-600 text-gray-400"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed here</p>
                </div>
                <Button
                  type="submit"
                  disabled={profileMutation.isPending}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {profileMutation.isPending ? <Spinner className="mr-2" /> : null}
                  Save Changes
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Change password */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Security</CardTitle>
            <CardDescription className="text-gray-400">
              Change your account password
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showPasswordForm ? (
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300"
                onClick={() => setShowPasswordForm(true)}
              >
                Change Password
              </Button>
            ) : (
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit((v) => passwordMutation.mutate(v))}
                  className="space-y-4"
                >
                  <FormField
                    control={passwordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">New Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            className="bg-gray-900 border-gray-600 text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            className="bg-gray-900 border-gray-600 text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-gray-400"
                      onClick={() => {
                        setShowPasswordForm(false);
                        passwordForm.reset();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={passwordMutation.isPending}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {passwordMutation.isPending ? <Spinner className="mr-2" /> : null}
                      Update Password
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        {/* Logout - visible on mobile since removed from bottom nav */}
        <Button
          variant="outline"
          className="w-full md:hidden border-gray-600 text-red-400 hover:text-red-300"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </motion.div>
    </AppLayout>
  );
}
