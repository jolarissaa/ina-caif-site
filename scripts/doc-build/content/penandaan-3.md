# Dokumentasi Antarmuka untuk Produk Non-Fisik: Tangkapan Layar, URL, dan Prosedur Instalasi

Dokumen ini memandu tim menyiapkan dokumentasi antarmuka untuk produk yang diunduh atau berbasis web (tangkapan layar, URL akses, dan prosedur unduh/instalasi/penggunaan) — digunakan saat produk tidak memiliki bentuk fisik dan tetap harus didokumentasikan untuk Form D Regalkes.

## 1. Menyiapkan Dokumentasi Tangkapan Layar yang Memenuhi Syarat

Ambil tangkapan layar pada resolusi native perangkat (hindari resize/crop berlebihan yang membuat teks tidak terbaca) dan pastikan setiap tangkapan layar yang relevan menampilkan nomor versi produk secara terbaca — biasanya diambil dari halaman About/Tentang atau elemen UI yang menampilkan versi. Susun rangkaian tangkapan layar yang mencakup alur utama penggunaan produk (bukan hanya halaman landing), sehingga reviewer dapat memahami bagaimana intended use diterjemahkan ke dalam interaksi nyata. Beri label/caption pada setiap tangkapan layar yang menjelaskan konteks langkah tersebut.

- Gunakan format gambar yang tidak terkompresi berlebihan (PNG lebih disarankan daripada JPEG untuk teks UI)
- Simpan tangkapan layar dengan nama file yang mencantumkan nomor versi dan tanggal pengambilan, agar mudah dicocokkan dengan rilis tertentu
- Sertakan minimal satu tangkapan layar yang menunjukkan elemen identitas produk (nama, versi, pemilik) berdampingan dalam satu frame

[Placeholder: kumpulan tangkapan layar resolusi tinggi dari alur utama penggunaan produk, masing-masing menampilkan nomor versi yang terbaca]

## 2. Mendokumentasikan URL Akses dan Environment Produk

Catat URL yang digunakan pengguna akhir untuk mengakses produk secara eksplisit, dan bedakan dengan jelas dari URL environment internal (staging/development) yang mungkin terlihat mirip. Jika produk memiliki lebih dari satu titik akses (misalnya aplikasi web dan portal admin terpisah), dokumentasikan masing-masing beserta perannya. Untuk aplikasi yang diunduh dari platform distribusi (app store internal, web distribusi file instalasi), catat juga URL/halaman unduhan resminya.

[Placeholder: daftar URL produksi yang digunakan pengguna akhir, dibedakan dari environment staging/internal, beserta tangkapan layar halaman tersebut]

## 3. Menyusun Prosedur Unduh dan Instalasi Langkah demi Langkah

Tulis prosedur unduh dan instalasi sebagai langkah bernomor yang bisa diikuti pengguna baru tanpa bantuan tambahan: mulai dari mengakses URL/sumber unduhan, persyaratan sistem minimum (OS, browser, spesifikasi perangkat), proses instalasi atau setup akun, hingga langkah verifikasi bahwa instalasi berhasil (misalnya memeriksa versi yang muncul di halaman About setelah instalasi). Sertakan tangkapan layar pada setiap langkah yang melibatkan keputusan atau input dari pengguna, bukan hanya langkah yang bersifat otomatis.

- Pisahkan prosedur untuk setiap platform yang didukung (misalnya Android, iOS, web desktop) jika langkahnya berbeda
- Cantumkan estimasi waktu dan prasyarat (misalnya koneksi internet, hak akses admin) di awal prosedur

[Placeholder: dokumen prosedur unduh-instalasi-penggunaan bernomor, lengkap dengan tangkapan layar tiap langkah, untuk setiap platform yang didukung]

## 4. Menjaga Dokumentasi Tetap Sinkron saat UI Berubah antar Rilis

Terapkan proses version control untuk dokumentasi tangkapan layar dan prosedur, sejajar dengan siklus rilis produk — setiap rilis yang mengubah tampilan UI pada langkah yang terdokumentasi harus memicu pembaruan tangkapan layar terkait sebelum rilis tersebut digunakan untuk keperluan regulasi. Simpan dokumentasi ini dalam repositori terversi (bukan file lepas di satu komputer), dan tautkan setiap versi dokumentasi dengan nomor versi produk yang didokumentasikannya. Lakukan pengecekan sebagai bagian dari checklist rilis: apakah ada perubahan UI pada rilis ini yang membuat tangkapan layar/prosedur sebelumnya kedaluwarsa.

- Tambahkan item "update dokumentasi antarmuka" pada checklist definition-of-done setiap rilis yang mengubah UI
- Beri penomoran versi dokumen terpisah dari versi produk, tapi dengan pemetaan eksplisit ke versi produk yang didokumentasikan

[Placeholder: log perubahan dokumentasi antarmuka yang menunjukkan kapan tangkapan layar/prosedur diperbarui mengikuti rilis produk, beserta pemetaan versi dokumen-ke-versi produk]

## Referensi Teknis

- IMDRF N23 — Software as a Medical Device (SaMD): Application of Quality Management System — https://www.imdrf.org/docs/imdrf/final/technical/imdrf-tech-151002-samd-qms.pdf
- FDA — Content of Premarket Submissions for Device Software Functions — https://www.fda.gov/regulatory-information/search-fda-guidance-documents/content-premarket-submissions-device-software-functions
