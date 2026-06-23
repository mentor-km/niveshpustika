import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { User, Phone, Calendar, Shield, LogOut } from 'lucide-react';
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
import { fetchProfile, updateProfile, signOut, displayPhone } from '@/lib/supabase';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => fetchProfile(user.id),
    enabled: Boolean(user?.id),
  });

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    values: { name: profile?.name || user?.user_metadata?.name || '' },
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

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-500" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
              <p className="text-emerald-400 font-semibold">Standard Plan</p>
              <p className="text-gray-400 text-sm mt-1">
                Full access to log trades, dashboard, and analytics.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4" />
              Member since {format(new Date(profile.created_at), 'dd MMM yyyy')}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Personal Info</CardTitle>
            <CardDescription className="text-gray-400">Update your display name</CardDescription>
          </CardHeader>
          <CardContent>
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
                <div className="space-y-2">
                  <label htmlFor="profile-phone" className="text-sm font-medium text-gray-300">
                    Mobile
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="profile-phone"
                      value={displayPhone(user)}
                      disabled
                      className="pl-10 bg-gray-900/50 border-gray-600 text-gray-400"
                    />
                  </div>
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

        <Button
          variant="outline"
          className="w-full border-gray-600 text-red-400 hover:text-red-300"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </motion.div>
    </AppLayout>
  );
}
