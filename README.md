# 🖥️ Employee Management System - Frontend

Aplikasi antarmuka web modern, responsif, dan kaya fitur untuk Employee Management System. Dibangun menggunakan **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, dan **TanStack Query (React Query v5)**.

Aplikasi ini terhubung langsung ke RESTful API backend [Employee Management Backend](../employee-management-be).

---

## 🔗 Live Demo

| Layanan | Tautan | Keterangan |
| :--- | :--- | :--- |
| 🌐 **Live Demo Frontend** | [https://employee-management-fe-production.up.railway.app/](https://employee-management-fe-production.up.railway.app/) | Aplikasi web yang telah di-deploy |
| 🚀 **Live Demo Backend API** | [http://employee-management-be-production-a8fc.up.railway.app/](http://employee-management-be-production-a8fc.up.railway.app/) | Base URL backend API |
| 📖 **Dokumentasi Swagger API** | [http://employee-management-be-production-a8fc.up.railway.app/api-documentation/](http://employee-management-be-production-a8fc.up.railway.app/swagger/) | Swagger OpenAPI UI Backend |
| 📂 **Repositori Backend** | [../employee-management-be](../employee-management-be) | Repositori Go Fiber + MySQL |

---

## ✨ Fitur Utama

- **Authentication & RBAC (Role-Based Access Control)**:
  - Autentikasi berbasis JWT token.
  - Role guard otomatis (`admin` dan `viewer`).
  - Fitur Login, Register, dan Logout dengan sesi tersimpan aman.
  - Shortcut tombol *"Quick Fill"* di layar login untuk memudahkan pergantian peran saat pengujian.
- **Dashboard Overview**:
  - Kartu metrik total karyawan, total departemen, jumlah karyawan aktif, dan inaktif.
  - Visualisasi progress rasio status karyawan.
  - Tabel pratinjau karyawan terbaru (Recent Employees).
- **Employee Management (Karyawan)**:
  - **Pencarian Dinamis**: Input pencarian nama, email, dan jabatan dengan debouncing otomatis.
  - **Filter & Sorting Database**: Penyaringan data berdasarkan departemen dan status (`active` / `inactive`), serta sorting kolom tabel langsung dieksekusi di database backend.
  - **Pagination Server-Side**: Navigasi halaman cepat dan terstruktur.
  - **CRUD Lengkap**: Halaman detail karyawan, formulir pendaftaran karyawan baru, dan formulir pengeditan data karyawan.
  - **Export CSV**: Mengunduh seluruh atau potongan data karyawan ke format file `.csv` langsung dari server.
- **Department Management (Departemen)**:
  - Melihat daftar departemen beserta deskripsi singkat.
  - Operasi Tambah, Edit, dan Hapus departemen (dibatasi khusus untuk akun `admin`).
- **Responsive UI/UX**:
  - Desain antarmuka mobile-first yang bersih dan adaptif (Mobile, Tablet, Desktop).
  - Sidebar navigasi collapsible dengan status rute aktif.
  - Notifikasi Toast informatif untuk setiap aksi sukses maupun gagal.
  - Dialog modal konfirmasi untuk mencegah ketidaksengajaan saat menghapus data.

---

## 🛠️ Panduan Menjalankan di Lokal (Local Setup)

Ikuti langkah-langkah mudah di bawah ini untuk menjalankan frontend di komputer lokal Anda:

### Prasyarat:
- **Node.js**: Versi 18+ atau 20+ (LTS direkomendasikan)
- **NPM** atau Package Manager pilihan Anda (Yarn / PNPM / Bun)
- **Backend API**: Backend lokal yang berjalan di port `8080` (lihat panduan [Backend Setup](../employee-management-be#️-panduan-menjalankan-di-lokal-local-setup)) **ATAU** gunakan Live Backend di Railway.

---

### Langkah 1: Masuk ke Direktori Frontend

```bash
cd employee-management-fe
```

### Langkah 2: Salin File Environment (`.env`)

Buat file `.env` dari template `.env.example`:

```bash
cp .env.example .env
```

Pilih salah satu target API backend pada file `.env`:

#### Opsi A: Menghubungkan ke Backend Lokal (Disarankan untuk Dev Lokal)
Jika Anda menjalankan backend Go di komputer lokal (port `8080`):
```env
VITE_API_BASE_URL=http://localhost:8080
```
*(Pastikan backend Go dan MySQL sudah berjalan sesuai panduan di [README Backend](../employee-management-be/README.md). Database MySQL lokal bisa berjalan via XAMPP/Native MySQL tanpa perlu Docker).*

#### Opsi B: Menghubungkan Langsung ke Live Demo Backend (Railway)
Jika Anda ingin langsung menguji frontend lokal tanpa perlu menyalakan backend Go atau MySQL lokal:
```env
VITE_API_BASE_URL=http://employee-management-be-production-a8fc.up.railway.app
```

---

### Langkah 3: Install Dependensi

```bash
npm install
```

### Langkah 4: Jalankan Development Server

```bash
npm run dev
```

Aplikasi frontend akan aktif dan dapat diakses di browser pada:
👉 **`http://localhost:5173`**

---

### Langkah 5: Build untuk Produksi (Opsional)

Untuk memeriksa build produksi dan menjalankan pratinjau (preview):

```bash
# Build aplikasi ke folder dist/
npm run build

# Menjalankan preview server
npm run preview
```

---

## 👤 Akun Uji Coba (Credentials)

Gunakan akun siap pakai berikut untuk login ke sistem:

| Peran (Role) | Email | Password | Kemampuan Akses |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `admin123` | Akses penuh: Tambah/Edit/Hapus karyawan & departemen, Export CSV |
| **Viewer** | `viewer@example.com` | `viewer123` | Akses read-only: Melihat dashboard, daftar karyawan, departemen, Export CSV |

> 💡 **Tips Pengujian:** Pada halaman login (`/login`), terdapat tombol klik cepat **"Login as Admin"** dan **"Login as Viewer"** yang akan otomatis mengisi form tanpa mengetik manual.

---

## 🏛️ Arsitektur Integrasi Frontend & Backend

```text
[ React 19 + TypeScript (Frontend) ]
                 │
                 │ HTTP / REST (Axios Client)
                 │ Header: Authorization: Bearer <JWT>
                 ▼
[ Go Fiber v2 REST API (Backend) ]
                 │
                 │ GORM ORM
                 ▼
[ Database MySQL (Tanpa Docker / Docker Compose) ]
```

1. **State Management & Caching**: TanStack Query (`@tanstack/react-query`) menangani fetch, caching di sisi klien, pagination state, serta invalidasi query otomatis saat data diubah (mutations).
2. **HTTP Interceptor**: Axios instance di `src/api/axios.ts` secara otomatis menyisipkan token JWT dari `localStorage` ke header `Authorization: Bearer <token>` pada setiap request.
3. **Penyaringan Server-side**: Seluruh parameter filter (search, department, status, sort order, halaman) diteruskan langsung ke backend untuk efisiensi beban kerja memori.

---

## 📁 Struktur Direktori Proyek

```text
employee-management-fe/
├── public/                      # Asset statis publik (favicon, svg)
├── src/
│   ├── api/                     # Axios instance & pemanggilan API endpoint
│   │   ├── auth.ts
│   │   ├── axios.ts
│   │   ├── departments.ts
│   │   └── employees.ts
│   ├── assets/                  # Gambar & ilustrasi
│   ├── components/              # Komponen modular reusable
│   │   ├── layout/              # AppLayout, Navbar, Sidebar, ProtectedRoute
│   │   ├── shared/              # DataTable, Pagination, Dialog, LoadingSpinner
│   │   └── ui/                  # Button, Input, Card, Badge
│   ├── context/                 # Context providers (AuthContext, ToastContext)
│   ├── hooks/                   # Custom hooks (useAuth, useEmployees, useDepartments)
│   ├── lib/                     # Utilitas helper (formatters, cn helper)
│   ├── pages/                   # Halaman-halaman rute
│   │   ├── departments/         # DepartmentListPage
│   │   ├── employees/           # EmployeeListPage, CreatePage, EditPage, DetailPage
│   │   ├── DashboardPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── types/                   # Definisi interface TypeScript (Employee, Dept, User)
│   ├── App.tsx                  # Definisi rute React Router
│   ├── index.css                # Konfigurasi Tailwind CSS
│   └── main.tsx                 # Entrypoint React DOM
├── .env.example                 # Contoh file environment
├── package.json                 # Daftar dependensi & scripts
├── tailwind.config.js           # Konfigurasi styling Tailwind CSS
├── tsconfig.json                # Konfigurasi TypeScript
├── vite.config.ts               # Konfigurasi build tool Vite
└── README.md                    # Dokumentasi frontend ini
```

---

## 🤝 Repositori Terkait

Aplikasi ini merupakan bagian frontend dari sistem Employee Management:
- **Backend API Repository**: [../employee-management-be](../employee-management-be)
- **Live Demo Frontend**: [https://employee-management-fe-production.up.railway.app/](https://employee-management-fe-production.up.railway.app/)
- **Live Demo Backend**: [http://employee-management-be-production-a8fc.up.railway.app/](http://employee-management-be-production-a8fc.up.railway.app/)
- **Swagger Documentation Backend**: [http://employee-management-be-production-a8fc.up.railway.app/swagger/](http://employee-management-be-production-a8fc.up.railway.app/swagger/)
