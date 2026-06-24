import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import {
  Shield,
  Users,
  BarChart3,
  ArrowLeft,
  Search,
  TrendingUp,
  UserPlus,
  Activity,
  LayoutDashboard,
  Home,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Logo } from '@/components/Landing/Logo';
import TradeList from '@/components/TradeApp/TradeList';
import {
  fetchAdminStats,
  fetchAllUsers,
  fetchUserAdminSummary,
  formatCurrency,
} from '@/lib/supabase';

const CARD = 'bg-white/90 backdrop-blur-sm border-teal-200/60 shadow-lg shadow-teal-900/5';

function StatCard({ label, value, icon: Icon, sub, valueClass }) {
  return (
    <Card className={CARD}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">{label}</CardTitle>
        <Icon className="w-5 h-5 text-[#2d8b8b]" />
      </CardHeader>
      <CardContent>
        <p className={`text-2xl sm:text-3xl font-bold ${valueClass || 'text-slate-800'}`}>{value}</p>
        {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
}

function AdminShell({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fffe] via-[#f0fdfa] to-[#ecfdf5] text-slate-800">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-teal-200/60 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#2d8b8b] flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold font-heading text-slate-800 leading-tight truncate">
                Admin Panel
              </p>
              <p className="text-xs text-slate-500 hidden sm:block">Nivesh Pustika · Platform overview</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button asChild variant="ghost" size="sm" className="text-slate-600 hover:text-teal-800 hover:bg-teal-50">
              <Link to="/dashboard">
                <LayoutDashboard className="w-4 h-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-slate-600 hover:text-teal-800 hover:bg-teal-50">
              <Link to="/">
                <Home className="w-4 h-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">{children}</main>
    </div>
  );
}

function UserDetailView({ user, onBack }) {
  const { data: summary, isLoading } = useQuery({
    queryKey: ['admin-user-summary', user.id],
    queryFn: () => fetchUserAdminSummary(user.id),
  });

  return (
    <AdminShell>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="w-fit border-teal-200 text-slate-600 hover:bg-teal-50 hover:!text-slate-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          All users
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">{user.name || 'Unnamed user'}</h1>
          <p className="text-sm text-slate-500">{user.email || 'Phone sign-in'}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="w-8 h-8 text-[#2d8b8b]" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard label="Trades" value={summary?.tradeCount ?? 0} icon={BarChart3} />
            <StatCard
              label="Net P&L"
              value={formatCurrency(summary?.totalPnl ?? 0)}
              icon={TrendingUp}
              valueClass={
                (summary?.totalPnl ?? 0) >= 0 ? 'text-[#2d8b8b]' : 'text-[#f0544f]'
              }
            />
            <StatCard
              label="Win rate"
              value={`${(summary?.winRate ?? 0).toFixed(1)}%`}
              icon={Activity}
            />
            <StatCard
              label="Member since"
              value={user.created_at ? format(new Date(user.created_at), 'dd MMM yyyy') : '—'}
              icon={Users}
            />
          </div>

          <Card className={`${CARD} mb-6`}>
            <CardHeader>
              <CardTitle className="text-slate-800">Account details</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Name</p>
                <p className="font-medium text-slate-800">{user.name || '—'}</p>
              </div>
              <div>
                <p className="text-slate-500">Email</p>
                <p className="font-medium text-slate-800">{user.email || '—'}</p>
              </div>
              <div>
                <p className="text-slate-500">Status</p>
                <p className="font-medium text-slate-800 capitalize">{user.status || 'active'}</p>
              </div>
              <div>
                <p className="text-slate-500">Last active</p>
                <p className="font-medium text-slate-800">
                  {user.last_active
                    ? format(new Date(user.last_active), 'dd MMM yyyy, HH:mm')
                    : '—'}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Wins / Losses</p>
                <p className="font-medium text-slate-800">
                  {summary?.wins ?? 0} / {summary?.losses ?? 0}
                </p>
              </div>
              <div>
                <p className="text-slate-500">User ID</p>
                <p className="font-mono text-xs text-slate-600 break-all">{user.id}</p>
              </div>
            </CardContent>
          </Card>

          <TradeList userId={user.id} />
        </>
      )}
    </AdminShell>
  );
}

export default function AdminPage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState('');

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

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.id?.toLowerCase().includes(q)
    );
  }, [users, search]);

  const isLoading = statsLoading || usersLoading;
  const error = statsError || usersError;

  if (selectedUser) {
    return <UserDetailView user={selectedUser} onBack={() => setSelectedUser(null)} />;
  }

  if (isLoading) {
    return (
      <AdminShell>
        <div className="flex justify-center py-24">
          <Spinner className="w-8 h-8 text-[#2d8b8b]" />
        </div>
      </AdminShell>
    );
  }

  if (error) {
    return (
      <AdminShell>
        <Card className={CARD}>
          <CardContent className="py-12 text-center text-[#f0544f]">
            Admin access error: {error.message}
          </CardContent>
        </Card>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Logo className="h-9 w-9" showText={false} variant="light" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-800">Overview</h1>
            <p className="text-sm text-slate-500">Monitor users, activity, and platform usage</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total users" value={stats?.totalUsers ?? 0} icon={Users} />
          <StatCard label="Total trades" value={stats?.totalTrades ?? 0} icon={BarChart3} />
          <StatCard
            label="Active (7 days)"
            value={stats?.activeUsers ?? 0}
            icon={Activity}
            sub="Logged in recently"
          />
          <StatCard
            label="New (7 days)"
            value={stats?.newUsers ?? 0}
            icon={UserPlus}
            sub="Recent sign-ups"
          />
        </div>

        <Card className={CARD}>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-slate-800">All users</CardTitle>
              <CardDescription className="text-slate-500">
                {filteredUsers.length} of {users.length} users · tap a row for full details
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-white border-teal-200 text-slate-800"
              />
            </div>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <p className="text-slate-500 text-center py-10">
                {users.length === 0 ? 'No users registered yet.' : 'No users match your search.'}
              </p>
            ) : (
              <>
                <div className="hidden lg:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-teal-100 hover:bg-transparent">
                        <TableHead className="text-slate-500">Name</TableHead>
                        <TableHead className="text-slate-500">Email</TableHead>
                        <TableHead className="text-slate-500">Trades</TableHead>
                        <TableHead className="text-slate-500">Net P&L</TableHead>
                        <TableHead className="text-slate-500">Win rate</TableHead>
                        <TableHead className="text-slate-500">Joined</TableHead>
                        <TableHead className="text-slate-500">Last active</TableHead>
                        <TableHead className="text-slate-500">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((u) => (
                        <TableRow
                          key={u.id}
                          className="border-teal-100 cursor-pointer hover:bg-teal-50/50"
                          onClick={() => setSelectedUser(u)}
                        >
                          <TableCell className="text-slate-800 font-medium">{u.name || '—'}</TableCell>
                          <TableCell className="text-slate-600">{u.email || 'Phone'}</TableCell>
                          <TableCell className="text-slate-600">{u.tradeCount ?? 0}</TableCell>
                          <TableCell
                            className={
                              (u.totalPnl ?? 0) >= 0 ? 'text-[#2d8b8b]' : 'text-[#f0544f]'
                            }
                          >
                            {formatCurrency(u.totalPnl ?? 0)}
                          </TableCell>
                          <TableCell className="text-slate-600">
                            {u.tradeCount > 0 ? `${u.winRate.toFixed(0)}%` : '—'}
                          </TableCell>
                          <TableCell className="text-slate-600">
                            {u.created_at ? format(new Date(u.created_at), 'dd MMM yyyy') : '—'}
                          </TableCell>
                          <TableCell className="text-slate-600">
                            {u.last_active
                              ? format(new Date(u.last_active), 'dd MMM, HH:mm')
                              : '—'}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`text-xs px-2 py-1 rounded-full capitalize ${
                                u.status === 'active'
                                  ? 'bg-teal-100 text-[#2d8b8b]'
                                  : 'bg-slate-100 text-slate-500'
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

                <div className="lg:hidden space-y-3">
                  {filteredUsers.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setSelectedUser(u)}
                      className="w-full text-left bg-teal-50/50 rounded-xl p-4 border border-teal-200/60 hover:border-teal-300 transition-colors"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <p className="text-slate-800 font-semibold truncate">{u.name || '—'}</p>
                          <p className="text-sm text-slate-500 truncate">{u.email || 'Phone sign-in'}</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-teal-100 text-[#2d8b8b] capitalize shrink-0">
                          {u.status || 'active'}
                        </span>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <p className="text-slate-400">Trades</p>
                          <p className="font-medium text-slate-700">{u.tradeCount ?? 0}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">P&L</p>
                          <p
                            className={`font-medium ${
                              (u.totalPnl ?? 0) >= 0 ? 'text-[#2d8b8b]' : 'text-[#f0544f]'
                            }`}
                          >
                            {formatCurrency(u.totalPnl ?? 0)}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400">Active</p>
                          <p className="font-medium text-slate-700">
                            {u.last_active ? format(new Date(u.last_active), 'dd MMM') : '—'}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AdminShell>
  );
}
