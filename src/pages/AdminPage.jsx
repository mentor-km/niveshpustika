import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Shield, Users, BarChart3, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Link } from 'react-router-dom';
import TradeList from '@/components/TradeApp/TradeList';
import { fetchAdminStats, fetchAllUsers } from '@/lib/supabase';

export default function AdminPage() {
  const [selectedUser, setSelectedUser] = useState(null);

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: fetchAdminStats,
  });

  const {
    data: users = [],
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ['admin-users'],
    queryFn: fetchAllUsers,
  });

  const isLoading = statsLoading || usersLoading;
  const error = statsError || usersError;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Spinner className="w-8 h-8 text-red-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <Card className="bg-gray-900 border-gray-700 max-w-md w-full">
          <CardContent className="py-8 text-center text-red-400">
            Admin access error: {error.message}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (selectedUser) {
    return (
      <div className="min-h-screen bg-gray-950">
        <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setSelectedUser(null)}
              className="text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">{selectedUser.name || 'User'}</h1>
              <p className="text-sm text-gray-400">{selectedUser.email}</p>
            </div>
          </div>
        </header>
        <main className="container mx-auto p-4 md:p-8">
          <TradeList userId={selectedUser.id} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold font-heading text-white">Admin Panel</span>
          </div>
          <Link to="/">
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              Homepage
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Users</CardTitle>
                <Users className="w-5 h-5 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">{stats?.totalUsers ?? 0}</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Trades</CardTitle>
                <BarChart3 className="w-5 h-5 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">{stats?.totalTrades ?? 0}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Users</CardTitle>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No users registered yet.</p>
              ) : (
                <>
                  <div className="hidden md:block overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-700 hover:bg-transparent">
                          <TableHead className="text-gray-400">Name</TableHead>
                          <TableHead className="text-gray-400">Email</TableHead>
                          <TableHead className="text-gray-400">Trade Count</TableHead>
                          <TableHead className="text-gray-400">Last Active</TableHead>
                          <TableHead className="text-gray-400">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((u) => (
                          <TableRow
                            key={u.id}
                            className="border-gray-700 cursor-pointer hover:bg-gray-700/50"
                            onClick={() => setSelectedUser(u)}
                          >
                            <TableCell className="text-white font-medium">
                              {u.name || '—'}
                            </TableCell>
                            <TableCell className="text-gray-300">{u.email}</TableCell>
                            <TableCell className="text-gray-300">
                              {u.trades?.[0]?.count ?? 0}
                            </TableCell>
                            <TableCell className="text-gray-300">
                              {u.last_active
                                ? format(new Date(u.last_active), 'dd MMM yyyy, HH:mm')
                                : '—'}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`text-xs px-2 py-1 rounded-full capitalize ${
                                  u.status === 'active'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-gray-500/20 text-gray-400'
                                }`}
                              >
                                {u.status || 'active'}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="md:hidden space-y-3">
                    {users.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => setSelectedUser(u)}
                        className="w-full text-left bg-gray-900 rounded-lg p-4 border border-gray-700 hover:border-emerald-500/50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-white font-semibold">{u.name || '—'}</p>
                            <p className="text-sm text-gray-400">{u.email}</p>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 capitalize">
                            {u.status || 'active'}
                          </span>
                        </div>
                        <div className="mt-2 flex gap-4 text-xs text-gray-500">
                          <span>{u.trades?.[0]?.count ?? 0} trades</span>
                          <span>
                            {u.last_active
                              ? format(new Date(u.last_active), 'dd MMM yyyy')
                              : 'Never active'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
