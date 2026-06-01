import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, Mail, KeyRound, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from "@/components/ui/use-toast";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match",
        description: "Please check your passwords and try again.",
      });
      return;
    }
    
    // This is a mock sign-up. In a real app, this would call a Supabase function.
    toast({
      title: "Sign Up Successful!",
      description: "You can now log in with your new account. (Mock)",
      className: "bg-emerald-500 text-white",
    });
    // For now, we'll just redirect to the login page.
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-sm bg-gray-900 border-gray-700">
          <CardHeader className="text-center">
             <div className="flex justify-center items-center space-x-3 mb-4">
               <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold font-heading text-white">Nivesh पुस्तिका</span>
            </div>
            <CardTitle className="text-2xl text-white">Create an Account</CardTitle>
            <CardDescription className="text-gray-400">
              Get started with your trading journal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Email"
                  className="pl-10 bg-gray-800 border-gray-600 text-white focus:ring-emerald-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Password"
                  className="pl-10 bg-gray-800 border-gray-600 text-white focus:ring-emerald-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  className="pl-10 bg-gray-800 border-gray-600 text-white focus:ring-emerald-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3">
                Sign Up
              </Button>
            </form>
             <div className="mt-4 text-center text-sm">
                <p className="text-gray-400">
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold text-emerald-400 hover:text-emerald-500">
                    Login
                  </Link>
                </p>
              </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}