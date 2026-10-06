import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEmployeeDetail, useEmployees } from '../../hooks/useEmployees';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { ConfirmDialog } from '../../components/shared/ConfirmDialog';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Calendar,
  Briefcase,
  Edit2,
  Trash2,
} from 'lucide-react';

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { data: employee, isLoading, error } = useEmployeeDetail(id ? Number(id) : null);
  const { deleteEmployee, isDeleting } = useEmployees();

  const [confirmOpen, setConfirmOpen] = useState(false);

  if (isLoading) {
    return <LoadingSpinner label="Loading employee details..." />;
  }

  if (error || !employee) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800">Employee Not Found</h3>
        <p className="mt-1 text-sm text-slate-500">The employee you requested does not exist or has been removed.</p>
        <Button onClick={() => navigate('/employees')} className="mt-4">
          Back to Employees
        </Button>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      await deleteEmployee(employee.id);
      navigate('/employees');
    } catch {
      alert('Failed to delete employee');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/employees')} className="gap-2 w-fit">
          <ArrowLeft className="h-4 w-4" />
          Back to List
        </Button>

        {isAdmin && (
          <div className="flex items-center gap-2">
            <Link to={`/employees/${employee.id}/edit`}>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit2 className="h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setConfirmOpen(true)}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Main Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <div>
              <CardTitle className="text-2xl">{employee.name}</CardTitle>
              <p className="text-slate-500 text-sm mt-0.5">{employee.position}</p>
            </div>
            <Badge
              variant={employee.status === 'active' ? 'success' : 'default'}
              className="text-sm px-3 py-1 w-fit"
            >
              {employee.status.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-50">
              <Mail className="h-5 w-5 text-indigo-600 mt-0.5" />
              <div>
                <span className="text-xs font-semibold uppercase text-slate-400">Email Address</span>
                <p className="text-sm font-medium text-slate-800">{employee.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-50">
              <Phone className="h-5 w-5 text-indigo-600 mt-0.5" />
              <div>
                <span className="text-xs font-semibold uppercase text-slate-400">Phone Number</span>
                <p className="text-sm font-medium text-slate-800">{employee.phone || '-'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-50">
              <Building2 className="h-5 w-5 text-indigo-600 mt-0.5" />
              <div>
                <span className="text-xs font-semibold uppercase text-slate-400">Department</span>
                <p className="text-sm font-medium text-slate-800">
                  {employee.department?.name || 'Unassigned'}
                </p>
                {employee.department?.description && (
                  <p className="text-xs text-slate-500 mt-0.5">{employee.department.description}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-50">
              <Briefcase className="h-5 w-5 text-indigo-600 mt-0.5" />
              <div>
                <span className="text-xs font-semibold uppercase text-slate-400">Designation / Role</span>
                <p className="text-sm font-medium text-slate-800">{employee.position}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-50">
              <Calendar className="h-5 w-5 text-indigo-600 mt-0.5" />
              <div>
                <span className="text-xs font-semibold uppercase text-slate-400">Joining Date</span>
                <p className="text-sm font-medium text-slate-800">
                  {employee.joined_at ? new Date(employee.joined_at).toLocaleDateString() : '-'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-50">
              <Calendar className="h-5 w-5 text-indigo-600 mt-0.5" />
              <div>
                <span className="text-xs font-semibold uppercase text-slate-400">System Record Created</span>
                <p className="text-sm font-medium text-slate-800">
                  {new Date(employee.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete ${employee.name}?`}
        isLoading={isDeleting}
      />
    </div>
  );
}
