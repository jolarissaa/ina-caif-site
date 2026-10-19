# Penandaan Identitas Produk: Nama, Versi, dan Pemilik Produk

Dokumen ini memandu tim menyiapkan skema penamaan dan penandaan identitas produk (nama produk, nomor versi perangkat lunak, dan identitas pemilik produk) agar konsisten di label maupun di antarmuka aplikasi — digunakan saat menyusun berkas Form D Regalkes dan setiap kali tim merilis versi baru.

## 1. Menyusun Skema Penamaan Produk dan Nomor Versi

Tetapkan satu nama produk final yang akan didaftarkan dan pastikan nama ini identik huruf-demi-huruf di semua tempat: label, splash screen, dokumen teknis, dan materi pemasaran — perbedaan kapitalisasi atau singkatan antar dokumen sering jadi temuan saat verifikasi berkas. Untuk nomor versi, gunakan skema semantic versioning (MAJOR.MINOR.PATCH, misalnya 2.4.1) dengan kriteria kenaikan yang jelas: MAJOR untuk perubahan yang mengubah intended use atau algoritma inti/model prediksi, MINOR untuk penambahan fitur yang tidak mengubah profil risiko, dan PATCH untuk perbaikan bug atau penyesuaian non-fungsional. Untuk produk berbasis machine learning, pisahkan penomoran versi aplikasi dari versi model (model version/build hash), karena model bisa di-retrain dan dirilis pada siklus yang berbeda dari aplikasi pembungkusnya.

- Buat satu "version registry" internal yang memetakan versi aplikasi ↔ versi model ↔ versi dataset pelatihan (untuk produk berbasis ML)
- Tetapkan kriteria tertulis kapan kenaikan versi memicu kewajiban pemberitahuan/pengajuan perubahan ke Kemenkes, dan kapan cukup dicatat sebagai perubahan internal minor
- Jadikan nomor versi di file konfigurasi build (package.json, pom.xml, build.gradle, dsb) sebagai satu sumber kebenaran (single source of truth), yang di-inject otomatis ke UI lewat pipeline CI/CD agar tidak pernah diketik ulang manual
- Hindari penomoran versi yang hanya berupa tanggal build tanpa struktur semantik, kecuali digabung dengan semantic version

[Placeholder: tangkapan layar version registry/dokumen pemetaan versi aplikasi-model-dataset, dan konfigurasi CI/CD yang menunjukkan nomor versi di-inject otomatis]

## 2. Menetapkan dan Menampilkan Identitas Pemilik Produk

Identifikasi badan hukum yang menjadi pemilik produk sesuai yang akan tercantum pada izin edar — gunakan nama badan hukum resmi, bukan sekadar nama brand/dagang. Jika pengembang teknis berbeda dari pemegang izin edar (misalnya ada pihak yang berperan sebagai legal manufacturer sementara pengembangan dilakukan pihak lain), dokumentasikan hubungan ini secara tertulis agar traceable: siapa yang bertanggung jawab atas desain, siapa yang bertanggung jawab atas rilis ke pasar. Pastikan nama badan hukum, alamat, dan kontak yang tercantum di label sama persis dengan yang ada di dokumen company profile dan NIB/akta perusahaan yang dilampirkan di berkas lain.

- Siapkan satu baris identitas pemilik produk yang baku (nama badan hukum + alamat terdaftar) untuk dipakai berulang di semua dokumen, bukan ditulis ulang manual tiap kali
- Jika ada white-labeling atau OEM, dokumentasikan secara eksplisit mana identitas yang tampil ke pengguna akhir dan mana yang tampil ke regulator

[Placeholder: dokumen/skema yang menunjukkan hubungan badan hukum pemilik produk, pengembang, dan (jika ada) pihak OEM/white-label, beserta sumber rujukannya seperti akta perusahaan]

## 3. Menempatkan Elemen Identitas pada Antarmuka (Splash Screen, About Screen, dsb)

Terapkan praktik umum penandaan software kesehatan: splash screen yang muncul saat aplikasi dibuka menampilkan nama produk dan nomor versi secara ringkas, sementara halaman "Tentang"/"About" menampilkan detail lengkap — nama produk, versi aplikasi, versi build/model (jika relevan), identitas pemilik produk, dan kontak dukungan teknis. Untuk aplikasi berbasis web, elemen ini biasanya ditaruh di footer atau halaman info terpisah yang dapat diakses dari menu utama. Penempatan dan keterbacaan elemen ini sejalan dengan prinsip identification of software items pada IEC 62304 dan prinsip usability pada IEC 62366-1 — pastikan teks identitas tidak terpotong, kontras cukup, dan tidak memerlukan lebih dari dua tap/klik untuk diakses pengguna.

[Placeholder: tangkapan layar splash screen dan halaman About/Tentang yang menampilkan nama produk, versi, dan identitas pemilik secara lengkap]

## 4. Menjaga Konsistensi antara Versi Terdaftar dan Versi Produksi

Terapkan proses change control (bagian dari QMS yang mengacu pada ISO 13485) yang memastikan versi yang berjalan di lingkungan produksi selalu cocok dengan versi yang terdaftar di Kemenkes. Jadwalkan pengecekan berkala (misalnya setiap rilis dan setiap kuartal) yang membandingkan versi live di production dengan versi pada dokumen NIE, dan catat hasil pengecekan ini sebagai bukti traceability. Terapkan juga mekanisme teknis seperti endpoint/API internal yang mengembalikan versi aplikasi yang sedang berjalan, sehingga verifikasi tidak bergantung pada laporan manual.

- Buat checklist rilis yang mewajibkan verifikasi nomor versi UI, versi di dokumen registrasi, dan versi di build artifact sebelum deployment disetujui
- Simpan log histori setiap rilis produksi (tanggal, nomor versi, ringkasan perubahan) sebagai bagian dari dokumentasi audit

[Placeholder: log rilis produksi dan hasil pengecekan berkala yang membandingkan versi live dengan versi terdaftar di NIE]

## Referensi Teknis

- IMDRF — Unique Device Identification (UDI) System: Application Guide — https://www.imdrf.org/sites/default/files/docs/imdrf/final/technical/imdrf-tech-131209-udi-guidance-140901.pdf
