import { useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Play, Copy, Check } from 'lucide-react';

interface EndpointSpec {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  authRequired: boolean;
  adminOnly?: boolean;
  defaultBody?: string;
  queryParams?: { key: string; placeholder: string; defaultVal?: string }[];
}

const ENDPOINTS: EndpointSpec[] = [
  {
    id: 'health',
    name: 'Health Check',
    method: 'GET',
    path: '/health',
    description: 'Check backend server health and uptime status',
    authRequired: false,
  },
  {
    id: 'login',
    name: 'User Login',
    method: 'POST',
    path: '/api/auth/login',
    description: 'Authenticate with email & password, returns JWT token',
    authRequired: false,
    defaultBody: JSON.stringify({ email: 'admin@example.com', password: 'admin123' }, null, 2),
  },
  {
    id: 'me',
    name: 'Get Current Profile',
    method: 'GET',
    path: '/api/auth/me',
    description: 'Get authenticated user claims & profile info',
    authRequired: true,
  },
  {
    id: 'get-depts',
    name: 'List Departments',
    method: 'GET',
    path: '/api/departments',
    description: 'Fetch all registered departments in the system',
    authRequired: true,
  },
  {
    id: 'create-dept',
    name: 'Create Department',
    method: 'POST',
    path: '/api/departments',
    description: 'Create a new department (Admin Only)',
    authRequired: true,
    adminOnly: true,
    defaultBody: JSON.stringify({ name: 'Quality Assurance', description: 'Testing & QA Team' }, null, 2),
  },
  {
    id: 'get-employees',
    name: 'List Employees',
    method: 'GET',
    path: '/api/employees',
    description: 'Search, filter, sort and paginate employees database query',
    authRequired: true,
    queryParams: [
      { key: 'search', placeholder: 'e.g. John' },
      { key: 'status', placeholder: 'active / inactive' },
      { key: 'sort_by', placeholder: 'name / email / created_at', defaultVal: 'created_at' },
      { key: 'sort_order', placeholder: 'asc / desc', defaultVal: 'desc' },
      { key: 'page', placeholder: '1', defaultVal: '1' },
      { key: 'limit', placeholder: '10', defaultVal: '10' },
    ],
  },
  {
    id: 'create-employee',
    name: 'Create Employee',
    method: 'POST',
    path: '/api/employees',
    description: 'Add a new employee into the system (Admin Only)',
    authRequired: true,
    adminOnly: true,
    defaultBody: JSON.stringify(
      {
        name: 'Alexander Graham',
        email: 'alexander@example.com',
        phone: '+1 555-0123',
        position: 'Backend Developer',
        department_id: 1,
        status: 'active',
        joined_at: '2025-01-15',
      },
      null,
      2
    ),
  },
  {
    id: 'export-csv',
    name: 'Export Employees CSV',
    method: 'GET',
    path: '/api/employees/export/csv',
    description: 'Directly download employees data table as CSV spreadsheet',
    authRequired: true,
  },
  {
    id: 'audit-logs',
    name: 'List Audit Logs',
    method: 'GET',
    path: '/api/audit-logs',
    description: 'Inspect create, update, and delete audit trail history (Admin Only)',
    authRequired: true,
    adminOnly: true,
    queryParams: [
      { key: 'entity', placeholder: 'employee / department' },
      { key: 'action', placeholder: 'create / update / delete' },
      { key: 'page', placeholder: '1', defaultVal: '1' },
      { key: 'limit', placeholder: '10', defaultVal: '10' },
    ],
  },
];

export default function ApiDocPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointSpec>(ENDPOINTS[0]);
  const [token, setToken] = useState<string>(() => localStorage.getItem('token') || '');
  const [bodyText, setBodyText] = useState<string>(ENDPOINTS[0].defaultBody || '');
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [pathParam, setPathParam] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseData, setResponseData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleSelectEndpoint = (ep: EndpointSpec) => {
    setSelectedEndpoint(ep);
    setBodyText(ep.defaultBody || '');
    const initialParams: Record<string, string> = {};
    ep.queryParams?.forEach((p) => {
      if (p.defaultVal) initialParams[p.key] = p.defaultVal;
    });
    setQueryParams(initialParams);
    setResponseStatus(null);
    setResponseData(null);
  };

  const handleSendRequest = async () => {
    setIsLoading(true);
    setResponseStatus(null);
    setResponseData(null);

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    let url = `${baseUrl}${selectedEndpoint.path}`;

    if (pathParam && url.includes(':id')) {
      url = url.replace(':id', pathParam);
    }

    const headers: Record<string, string> = {};
    if (selectedEndpoint.authRequired && token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (selectedEndpoint.method !== 'GET') {
      headers['Content-Type'] = 'application/json';
    }

    try {
      let parsedBody = undefined;
      if (selectedEndpoint.method !== 'GET' && bodyText.trim()) {
        try {
          parsedBody = JSON.parse(bodyText);
        } catch {
          alert('Invalid JSON in request body');
          setIsLoading(false);
          return;
        }
      }

      const res = await axios({
        method: selectedEndpoint.method,
        url,
        params: queryParams,
        data: parsedBody,
        headers,
        validateStatus: () => true, // accept all HTTP status codes
      });

      setResponseStatus(res.status);
      setResponseData(res.data);
    } catch (err: any) {
      setResponseStatus(0);
      setResponseData({ error: err.message || 'Request failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const copyResponse = () => {
    if (responseData) {
      navigator.clipboard.writeText(JSON.stringify(responseData, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">API Documentation & Mini Postman</h1>
        <p className="text-sm text-slate-500 mt-1">
          Interactive documentation to test, simulate, and inspect every backend endpoint directly in browser
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Endpoint Selector List */}
        <div className="lg:col-span-4 space-y-2">
          <Card>
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-sm font-semibold">Available Endpoints</CardTitle>
            </CardHeader>
            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {ENDPOINTS.map((ep) => {
                const isSelected = selectedEndpoint.id === ep.id;
                return (
                  <button
                    key={ep.id}
                    onClick={() => handleSelectEndpoint(ep)}
                    className={`w-full text-left p-3.5 transition-colors flex items-center justify-between text-xs ${
                      isSelected ? 'bg-indigo-50/80 border-l-4 border-indigo-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`font-mono font-bold px-1.5 py-0.5 rounded text-[10px] ${
                            ep.method === 'GET'
                              ? 'bg-sky-100 text-sky-700'
                              : ep.method === 'POST'
                              ? 'bg-emerald-100 text-emerald-700'
                              : ep.method === 'PUT'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {ep.method}
                        </span>
                        <span className="font-semibold text-slate-800">{ep.name}</span>
                      </div>
                      <span className="font-mono text-slate-500 text-[11px] block">{ep.path}</span>
                    </div>

                    {ep.adminOnly && (
                      <Badge variant="warning" className="text-[10px] scale-90">
                        Admin
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Request Tester Workspace */}
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <span
                  className={`font-mono font-bold px-2.5 py-1 rounded text-xs ${
                    selectedEndpoint.method === 'GET'
                      ? 'bg-sky-100 text-sky-700'
                      : selectedEndpoint.method === 'POST'
                      ? 'bg-emerald-100 text-emerald-700'
                      : selectedEndpoint.method === 'PUT'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {selectedEndpoint.method}
                </span>
                <div>
                  <CardTitle className="text-base">{selectedEndpoint.name}</CardTitle>
                  <p className="font-mono text-xs text-slate-500 mt-0.5">{selectedEndpoint.path}</p>
                </div>
              </div>

              <Button onClick={handleSendRequest} isLoading={isLoading} className="gap-2">
                <Play className="h-4 w-4" />
                Send Request
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {selectedEndpoint.description}
              </p>

              {/* Authorization Header Input */}
              {selectedEndpoint.authRequired && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Authorization Bearer Token
                  </label>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full font-mono text-xs rounded-lg border border-slate-300 p-2.5 text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Auto-loaded from active user session token.
                  </p>
                </div>
              )}

              {/* Path Param if applicable */}
              {selectedEndpoint.path.includes(':id') && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Path Parameter (:id)
                  </label>
                  <input
                    type="text"
                    value={pathParam}
                    onChange={(e) => setPathParam(e.target.value)}
                    placeholder="e.g. 1"
                    className="w-full font-mono text-xs rounded-lg border border-slate-300 p-2.5 text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              {/* Query Parameters */}
              {selectedEndpoint.queryParams && selectedEndpoint.queryParams.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                    Query Parameters
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedEndpoint.queryParams.map((param) => (
                      <div key={param.key}>
                        <label className="block text-[11px] font-mono text-slate-500 mb-0.5">
                          ?{param.key}
                        </label>
                        <input
                          type="text"
                          value={queryParams[param.key] || ''}
                          onChange={(e) =>
                            setQueryParams({ ...queryParams, [param.key]: e.target.value })
                          }
                          placeholder={param.placeholder}
                          className="w-full font-mono text-xs rounded-lg border border-slate-300 p-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Request Body Editor */}
              {selectedEndpoint.method !== 'GET' && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Request Body (JSON)
                  </label>
                  <textarea
                    rows={8}
                    value={bodyText}
                    onChange={(e) => setBodyText(e.target.value)}
                    className="w-full font-mono text-xs rounded-lg border border-slate-300 p-3 bg-slate-900 text-emerald-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="{}"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Response Inspector Box */}
          <Card>
            <CardHeader className="py-3 px-6">
              <div className="flex items-center gap-3">
                <CardTitle className="text-sm">Response Payload</CardTitle>
                {responseStatus !== null && (
                  <Badge
                    variant={
                      responseStatus >= 200 && responseStatus < 300
                        ? 'success'
                        : responseStatus >= 400 && responseStatus < 500
                        ? 'warning'
                        : 'danger'
                    }
                  >
                    Status: {responseStatus}
                  </Badge>
                )}
              </div>
              {responseData && (
                <Button variant="ghost" size="sm" onClick={copyResponse} className="gap-1.5 text-xs">
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy JSON'}
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-0">
              {responseData ? (
                <pre className="max-h-96 overflow-auto p-4 bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed select-all">
                  {typeof responseData === 'object'
                    ? JSON.stringify(responseData, null, 2)
                    : String(responseData)}
                </pre>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400 font-mono">
                  Send a request to see output response and status here...
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
