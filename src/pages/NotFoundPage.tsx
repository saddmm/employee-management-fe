import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { FileQuestion, Home } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-6 shadow-inner">
        <FileQuestion className="h-8 w-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">404</h1>
      <h2 className="text-xl font-semibold text-slate-700 mt-2">Page Not Found</h2>
      <p className="text-sm text-slate-500 mt-1 max-w-sm">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div className="mt-6">
        <Button onClick={() => navigate('/dashboard')} className="gap-2">
          <Home className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
