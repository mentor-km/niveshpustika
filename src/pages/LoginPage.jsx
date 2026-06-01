import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, Mail, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'trader@nivesh.com' && password === 'password123') {
      toast({
        title: "Login Successful!",
        description: "Welcome back! Redirecting to your dashboard.",
        className: "bg-emerald-500 text-white",
      });
      localStorage.setItem('userLoggedIn', 'true');
      navigate('/dashboard');
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
      });
    }
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
            <CardTitle className="text-2xl text-white">Member Login</CardTitle>
            <CardDescription className="text-gray-400">
              Access your trading dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
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
              <p className="text-xs text-gray-500 text-center pt-2">
                Use <span className="font-mono text-emerald-400">trader@nivesh.com</span> & password <span className="font-mono text-emerald-400">password123</span> to login.
              </p>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3">
                Login
              </Button>
            </form>
             <div className="mt-4 text-center text-sm">
                <p className="text-gray-400">
                  Don't have an account?{' '}
                  <Link to="/signup" className="font-semibold text-emerald-400 hover:text-emerald-500">
                    Sign up
                  </Link>
                </p>
              </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}