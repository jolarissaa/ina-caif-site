# INA-CAIF — Website

Checklist kepatuhan untuk dokter dan engineer yang membangun software kesehatan
berbasis AI di Indonesia, mencakup izin edar, manajemen risiko, validasi
klinis, dokumentasi teknis, dan perlindungan data.

Dibangun dengan Next.js 14 (App Router), TypeScript, dan Tailwind CSS, mengikuti
warna, tipografi, dan spasi dari INA-CAIF Design System.

## Menjalankan di komputer sendiri

```bash
npm install
npm run dev
```

Lalu buka `http://localhost:3000`.

## Struktur halaman

- `/` — beranda
- `/checklist` — checklist interaktif, status tersimpan di browser (localStorage)
- `/checklist/cetak` — tampilan cetak untuk ekspor PDF (gunakan Ctrl/Cmd+P → Save as PDF)
- `/regulasi` — pustaka sumber regulasi dan standar
- `/tentang` — tentang proyek

## Yang masih perlu dikerjakan sebelum live

1. **Isi konten checklist yang sesungguhnya.** `lib/checklistData.ts` berisi
   10 contoh butir sebagai ilustrasi struktur saja. Setiap `citationUrl` di
   file ini ditandai sebagai placeholder dan perlu diverifikasi atau diganti
   dengan tautan yang pasti, terutama untuk klausul ISO yang spesifik.
2. **Logo YLI dan ikon.** Belum ada file logo atau ikon kustom. Wordmark
   "INA-CAIF" saat ini berupa teks biasa. Tambahkan logo melalui
   `components/Header.tsx`.
3. **Deploy ke Vercel.** Push folder ini ke GitHub, lalu impor repo tersebut
   di vercel.com (gratis untuk subdomain `.vercel.app`). Vercel akan
   mendeteksi Next.js secara otomatis — tidak perlu konfigurasi tambahan.

## Catatan teknis

- Font (Lexend, IBM Plex Sans, IBM Plex Mono) dimuat lewat `next/font/google`
  saat proses build, sehingga memerlukan koneksi internet saat `npm run
  build` dijalankan (ini normal di Vercel).
- Semua warna, radius, dan spasi diatur lewat `tailwind.config.ts`. Mengubah
  nilai di sana akan memperbarui seluruh situs secara konsisten.
- Progres checklist dan isian "Konteks untuk Tim Etik" disimpan hanya di
  browser perangkat pengguna (localStorage), tidak ada server atau akun.
