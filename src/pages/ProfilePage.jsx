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

const CARD = 'bg-white/90 backdrop-blur-sm border-teal-200/60 shadow-lg shadow-teal-900/5';

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
        className: 'bg-[#2d8b8b] text-white',
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
          <Spinner className="w-8 h-8 text-[#2d8b8b]" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout showFab={false}>
        <Card className={CARD}>
          <CardContent className="py-12 text-center text-[#f0544f]">
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
          <User className="w-8 h-8 text-[#2d8b8b]" />
          <h1 className="text-3xl font-bold font-heading text-slate-800">Profile</h1>
        </div>

        <Card className={CARD}>
          <CardHeader>
            <CardTitle className="text-slate-800 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#2d8b8b]" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-teal-50 border border-teal-200/60 rounded-lg p-4">
              <p className="text-[#2d8b8b] font-semibold">Standard Plan</p>
              <p className="text-slate-500 text-sm mt-1">
                Full access to log trades, dashboard, and analytics.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Calendar className="w-4 h-4" />
              Member since {format(new Date(profile.created_at), 'dd MMM yyyy')}
            </div>
          </CardContent>
        </Card>

        <Card className={CARD}>
          <CardHeader>
            <CardTitle className="text-slate-800">Personal Info</CardTitle>
            <CardDescription className="text-slate-500">Update your display name</CardDescription>
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
                      <FormLabel className="text-slate-600">Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                          <Input
                            className="pl-10 bg-white border-teal-200 text-slate-800"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <label htmlFor="profile-phone" className="text-sm font-medium text-slate-600">
                    Mobile
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="profile-phone"
                      value={displayPhone(user)}
                      disabled
                      className="pl-10 bg-teal-50/50 border-teal-200 text-slate-500"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={profileMutation.isPending}
                  className="bg-[#2d8b8b] hover:bg-[#267a7a] text-white"
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
          className="w-full border-red-200 text-[#f0544f] hover:bg-red-50 hover:!text-[#f0544f]"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </motion.div>
    </AppLayout>
  );
}
