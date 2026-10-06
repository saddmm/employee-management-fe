# 🖥️ Employee Management System - Frontend

Web application untuk Employee Management System menggunakan **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, dan **React Query**.

---

## ✨ Fitur Utama

- **Authentication & Role Guard**: Login berbasis JWT, auto-attach token pada setiap HTTP request via Axios interceptors, proteksi navigasi berdasarkan role (`admin` vs `viewer`).
- **Dashboard Overview**: Ringkasan jumlah karyawan, statistik departemen, rasio karyawan aktif/inaktif, dan tabel karyawan terbaru.
- **Employee Management**:
  - Tabel data karyawan dengan sorting kolom langsung di database.
  - Pencarian dengan debounce otomatis.
  - Filter berdasarkan departemen dan status kepegawaian.
  - Pagination dinamis.
  - CRUD Karyawan (halaman detail, form tambah, form edit).
  - Ekspor data karyawan langsung ke file `.csv`.
- **Department Management**:
  - Modal manajemen departemen (tambah, edit, hapus).
  - Hak akses create/update/delete dibatasi untuk `admin`.
- **API Documentation & Mini Postman (`/api-documentation`)**:
  - UI interaktif untuk menguji semua endpoint REST API backend langsung di browser.
  - Dilengkapi input Bearer token otomatis, query param editor, JSON body editor, dan penampil response status serta payload formatting.
- **Responsive UI/UX**: Tampilan responsif (mobile, tablet, desktop) dengan collapsible sidebar, loading indicators, konfirmasi dialog, dan empty state.

---

## 🛠️ Cara Menjalankan

### 1. Salin Environment Variables
```bash
cp .env.example .env
```
Default API URL diarahkan ke backend: `VITE_API_BASE_URL=http://localhost:8080`.

### 2. Install Dependensi
```bash
npm install
```

### 3. Jalankan Development Server
```bash
npm run dev
```
Aplikasi akan aktif di `http://localhost:5173`.

### 4. Build untuk Production
```bash
npm run build
```

---

## 👤 Akun Uji Coba

Di halaman login telah disediakan tombol shortcut cepat:
- **Admin**: `admin@example.com` / `admin123` (Hak akses penuh: CRUD karyawan, departemen, dan audit log).
- **Viewer**: `viewer@example.com` / `viewer123` (Hak akses baca / read-only).
