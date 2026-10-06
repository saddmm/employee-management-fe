import { Link } from 'react-router-dom';
import { useEmployees } from '../hooks/useEmployees';
import { useDepartments } from '../hooks/useDepartments';
import { useAuth } from '../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Users,
  Building2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Plus,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const { employees, meta } = useEmployees({ limit: 5 });
  const { departments } = useDepartments();

  const totalEmployees = meta?.total ?? employees.length;
  const activeCount = employees.filter((e) => e.status === 'active').length;
  const inactiveCount = employees.filter((e) => e.status === 'inactive').length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 sm:p-8 text-white shadow-lg shadow-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="mt-1 text-indigo-100 text-sm max-w-xl">
            You are logged in with{' '}
            <span className="font-semibold uppercase tracking-wider underline">
              {user?.role}
            </span>{' '}
            privileges. Manage human resources and team allocations here.
          </p>
        </div>
        {isAdmin && (
          <Link to="/employees/new">
            <Button variant="secondary" className="gap-2 shrink-0">
              <Plus className="h-4 w-4 text-indigo-700" />
              Add Employee
            </Button>
          </Link>
        )}
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Staff</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{totalEmployees}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Departments</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{departments.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Building2 className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Active Staff</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">{activeCount}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Inactive Staff</p>
                <p className="text-3xl font-bold text-slate-600 mt-1">{inactiveCount}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <XCircle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Employees & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recently Added Staff</CardTitle>
              <Link
                to="/employees"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {employees.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-500">
                  No employee records found.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {employees.slice(0, 5).map((emp) => (
                    <div
                      key={emp.id}
                      className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 font-semibold text-xs">
                          {emp.name
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                        <div>
                          <Link
                            to={`/employees/${emp.id}`}
                            className="font-medium text-sm text-slate-800 hover:text-indigo-600"
                          >
                            {emp.name}
                          </Link>
                          <p className="text-xs text-slate-500">{emp.position}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={emp.status === 'active' ? 'success' : 'default'}>
                          {emp.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Departments Overview</CardTitle>
              <Link
                to="/departments"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                Manage <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {departments.slice(0, 5).map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 text-sm"
                >
                  <span className="font-medium text-slate-700">{d.name}</span>
                  <span className="text-xs text-slate-400">Department</span>
                </div>
              ))}
              {departments.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-2">No departments yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
