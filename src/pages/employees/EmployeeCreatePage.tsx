import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../../hooks/useEmployees';
import { useDepartments } from '../../hooks/useDepartments';
import { useToast } from '../../hooks/useToast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { ArrowLeft, UserPlus } from 'lucide-react';
import type { EmployeeStatus } from '../../types';

export default function EmployeeCreatePage() {
  const navigate = useNavigate();
  const { createEmployee, isCreating } = useEmployees();
  const { departments } = useDepartments();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department_id: '',
    status: 'active' as EmployeeStatus,
    joined_at: new Date().toISOString().split('T')[0],
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Nama lengkap wajib diisi';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Nama lengkap minimal 2 karakter';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email wajib diisi';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = 'Format email tidak valid (contoh: user@company.com)';
      }
    }

    if (!formData.position.trim()) {
      errors.position = 'Jabatan / Posisi wajib diisi';
    }

    if (formData.phone && formData.phone.trim().length > 20) {
      errors.phone = 'Nomor telepon maksimal 20 karakter';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateForm()) {
      return;
    }

    try {
      await createEmployee({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        position: formData.position.trim(),
        department_id: formData.department_id ? Number(formData.department_id) : null,
        status: formData.status,
        joined_at: formData.joined_at || undefined,
      });

      toast.success('Karyawan baru berhasil ditambahkan!');
      navigate('/employees');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Gagal menambahkan karyawan';
      const serverErrors = err.response?.data?.errors;
      if (Array.isArray(serverErrors) && serverErrors.length > 0) {
        setGeneralError(serverErrors.join(', '));
      } else {
        setGeneralError(msg);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => navigate('/employees')} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-xl font-bold text-slate-800">Add New Employee</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Employee Information</CardTitle>
              <p className="text-xs text-slate-500">Provide staff member details to create their profile</p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {generalError && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                id="name"
                value={formData.name}
                error={fieldErrors.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' });
                }}
                placeholder="Jane Doe"
                required
              />

              <Input
                label="Email Address *"
                id="email"
                type="email"
                value={formData.email}
                error={fieldErrors.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                }}
                placeholder="jane.doe@company.com"
                required
              />

              <Input
                label="Phone Number"
                id="phone"
                value={formData.phone}
                error={fieldErrors.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: '' });
                }}
                placeholder="+1 555-0199"
              />

              <Input
                label="Job Position / Role *"
                id="position"
                value={formData.position}
                error={fieldErrors.position}
                onChange={(e) => {
                  setFormData({ ...formData, position: e.target.value });
                  if (fieldErrors.position) setFieldErrors({ ...fieldErrors, position: '' });
                }}
                placeholder="Senior Backend Engineer"
                required
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Department
                </label>
                <select
                  value={formData.department_id}
                  onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">Select Department (Optional)</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Employment Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as EmployeeStatus })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <Input
                  label="Joining Date"
                  type="date"
                  id="joined_at"
                  value={formData.joined_at}
                  onChange={(e) => setFormData({ ...formData, joined_at: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => navigate('/employees')}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isCreating}>
                Save Employee
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
