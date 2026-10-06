import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useEmployees } from '../../hooks/useEmployees';
import { useDepartments } from '../../hooks/useDepartments';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { employeeApi } from '../../api/employees';
import type { Employee } from '../../types';
import { DataTable, type Column } from '../../components/shared/DataTable';
import { Pagination } from '../../components/shared/Pagination';
import { ConfirmDialog } from '../../components/shared/ConfirmDialog';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import {
  Plus,
  Search,
  Download,
  Eye,
  Edit2,
  Trash2,
  Filter,
} from 'lucide-react';

export default function EmployeeListPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { departments } = useDepartments();
  const toast = useToast();

  // Search, filter, sorting, pagination state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const limit = 10;

  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // reset to page 1 on search
    }, 350);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { employees, meta, isLoading, deleteEmployee, isDeleting } = useEmployees({
    search: debouncedSearch,
    department_id: departmentFilter ? Number(departmentFilter) : undefined,
    status: statusFilter || undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
    page,
    limit,
  });

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      const blob = await employeeApi.exportCsv({
        search: debouncedSearch,
        department_id: departmentFilter ? Number(departmentFilter) : undefined,
        status: statusFilter || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `employees_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('File CSV berhasil diunduh!');
    } catch {
      toast.error('Gagal mengunduh file CSV');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteEmployee(deleteTarget.id);
      toast.success(`Karyawan "${deleteTarget.name}" berhasil dihapus!`);
      setDeleteTarget(null);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Gagal menghapus karyawan';
      toast.error(msg);
    }
  };

  const columns: Column<Employee>[] = [
    {
      key: 'name',
      header: 'Employee Name',
      sortable: true,
      render: (emp) => (
        <div>
          <span className="font-semibold text-slate-900 block">{emp.name}</span>
          <span className="text-xs text-slate-500">{emp.email}</span>
        </div>
      ),
    },
    {
      key: 'position',
      header: 'Position',
      sortable: true,
      render: (emp) => <span className="text-slate-700 text-sm">{emp.position}</span>,
    },
    {
      key: 'department',
      header: 'Department',
      render: (emp) => (
        <span className="text-slate-600 text-sm font-medium">
          {emp.department?.name || <span className="text-slate-400 italic">Unassigned</span>}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (emp) => (
        <Badge variant={emp.status === 'active' ? 'success' : 'default'}>
          {emp.status}
        </Badge>
      ),
    },
    {
      key: 'joined_at',
      header: 'Joined Date',
      sortable: true,
      render: (emp) => (
        <span className="text-xs text-slate-500">
          {emp.joined_at ? new Date(emp.joined_at).toLocaleDateString() : '-'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (emp) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/employees/${emp.id}`)}
            title="View Details"
          >
            <Eye className="h-4 w-4 text-slate-500" />
          </Button>
          {isAdmin && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/employees/${emp.id}/edit`)}
                title="Edit Employee"
              >
                <Edit2 className="h-4 w-4 text-slate-500" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteTarget(emp)}
                title="Delete Employee"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Employees</h1>
          <p className="text-sm text-slate-500 mt-1">
            Directory and management of company personnel
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleExportCSV}
            isLoading={isExporting}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          {isAdmin && (
            <Link to="/employees/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Employee
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search employees by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400 hidden sm:block" />
          <select
            value={departmentFilter}
            onChange={(e) => {
              setDepartmentFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table & Pagination */}
      <DataTable
        columns={columns}
        data={employees}
        isLoading={isLoading}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        emptyTitle="No employees found"
        emptyDescription="Try adjusting your search criteria or add new employees."
      />

      {meta && (
        <Pagination
          currentPage={meta.page}
          totalPages={meta.total_pages}
          totalItems={meta.total}
          pageSize={meta.limit}
          onPageChange={(p) => setPage(p)}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Employee"
        message={`Are you sure you want to permanently delete "${deleteTarget?.name}"? This action cannot be reversed.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
