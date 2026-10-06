import React, { useState } from 'react';
import { useDepartments } from '../../hooks/useDepartments';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import type { Department } from '../../types';
import { DataTable, type Column } from '../../components/shared/DataTable';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Dialog } from '../../components/ui/Dialog';
import { ConfirmDialog } from '../../components/shared/ConfirmDialog';
import { Plus, Edit2, Trash2, Building2 } from 'lucide-react';

export default function DepartmentListPage() {
  const { departments, isLoading, createDepartment, updateDepartment, deleteDepartment, isCreating, isUpdating, isDeleting } = useDepartments();
  const { isAdmin } = useAuth();
  const toast = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formError, setFormError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null);

  const handleOpenCreate = () => {
    setEditingDept(null);
    setFormData({ name: '', description: '' });
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (dept: Department) => {
    setEditingDept(dept);
    setFormData({ name: dept.name, description: dept.description || '' });
    setFormError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError('Department name is required');
      return;
    }

    try {
      if (editingDept) {
        await updateDepartment({ id: editingDept.id, payload: formData });
        toast.success('Departemen berhasil diperbarui!');
      } else {
        await createDepartment(formData);
        toast.success('Departemen baru berhasil dibuat!');
      }
      setModalOpen(false);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Gagal menyimpan departemen';
      setFormError(msg);
      toast.error(msg);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDepartment(deleteTarget.id);
      toast.success(`Departemen "${deleteTarget.name}" berhasil dihapus!`);
      setDeleteTarget(null);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Gagal menghapus departemen';
      toast.error(msg);
    }
  };

  const columns: Column<Department>[] = [
    {
      key: 'name',
      header: 'Department Name',
      render: (dept) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="font-semibold text-slate-800">{dept.name}</span>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (dept) => (
        <span className="text-slate-500 text-sm">{dept.description || '-'}</span>
      ),
    },
    {
      key: 'created_at',
      header: 'Created Date',
      render: (dept) => (
        <span className="text-slate-500 text-xs">
          {new Date(dept.created_at).toLocaleDateString()}
        </span>
      ),
    },
    ...(isAdmin
      ? [
          {
            key: 'actions',
            header: 'Actions',
            className: 'text-right',
            render: (dept: Department) => (
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenEdit(dept)}
                  title="Edit Department"
                >
                  <Edit2 className="h-4 w-4 text-slate-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteTarget(dept)}
                  title="Delete Department"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Departments</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage company departments and organizational units
          </p>
        </div>
        {isAdmin && (
          <Button onClick={handleOpenCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Department
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={departments}
        isLoading={isLoading}
        emptyTitle="No departments found"
        emptyDescription="Create your first department to start organizing company staff."
      />

      {/* Create / Edit Dialog */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingDept ? 'Edit Department' : 'Create Department'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {formError}
            </div>
          )}

          <Input
            label="Department Name"
            id="dept-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Engineering"
            required
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the department's responsibilities"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isCreating || isUpdating}>
              {editingDept ? 'Save Changes' : 'Create Department'}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Department"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? Employees in this department will be unassigned.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
