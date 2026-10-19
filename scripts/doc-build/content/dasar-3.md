# Dokumentasi Mekanisme Pertukaran Data dan Analisis Risiko Keamanan Siber

Dokumen ini adalah dokumen keamanan siber/pertukaran data teknis yang dilampirkan di Form C Regalkes, dibuat ketika perangkat terhubung ke sistem, jaringan, atau internet lain — menjelaskan bagaimana data dipertukarkan dan risiko apa yang sudah diidentifikasi serta dimitigasi.

## 1. Pemetaan Arsitektur Pertukaran Data

Mulai dengan membuat data flow diagram yang memetakan setiap titik pertukaran data: dari mana data berasal, ke sistem/jaringan apa data mengalir, lewat protokol dan format apa (misalnya REST API over HTTPS dengan payload JSON, atau koneksi database langsung), dan di mana data berhenti (disimpan permanen, diproses sementara, atau diteruskan lagi). Tandai juga batas kepercayaan (trust boundary) pada diagram — titik di mana data berpindah dari lingkungan yang dikontrol organisasi ke lingkungan pihak ketiga (cloud provider, EHR rumah sakit, API eksternal).

Diagram ini menjadi dasar untuk semua analisis risiko di bagian berikutnya — tanpa pemetaan yang jelas, identifikasi kerentanan cenderung melewatkan titik integrasi yang justru paling rentan.

[Placeholder: Diagram data flow yang menunjukkan seluruh titik pertukaran data, protokol yang dipakai, dan trust boundary antar sistem]

## 2. Analisis Kerahasiaan, Integritas, dan Ketersediaan (CIA Triad)

Untuk setiap aliran data pada diagram di atas, nilai tiga aspek secara terpisah: kerahasiaan (siapa saja yang berhak mengakses data ini, dan bagaimana akses dibatasi — misalnya role-based access control dan enkripsi end-to-end), integritas (bagaimana memastikan data tidak berubah tanpa sepengetahuan saat transit atau tersimpan — misalnya checksum, digital signature, atau mekanisme audit log yang mendeteksi modifikasi), dan ketersediaan (apa yang terjadi jika koneksi putus atau sistem lawan down — apakah ada mekanisme retry, antrian pesan, atau mode degradasi yang tetap aman secara klinis).

Dokumentasikan penilaian ini sebagai tabel per aliran data, bukan pernyataan umum "data kami aman" — setiap baris harus menunjukkan aliran data spesifik, aspek CIA yang dinilai, kontrol yang diterapkan, dan level risiko residual setelah kontrol tersebut.

[Placeholder: Tabel analisis CIA per aliran data, menunjukkan kontrol yang diterapkan untuk kerahasiaan, integritas, dan ketersediaan masing-masing]

## 3. Identifikasi Kerentanan dan Analisis Risiko Siber

Lakukan identifikasi kerentanan secara sistematis pada setiap titik integrasi yang sudah dipetakan — gunakan pendekatan threat modeling (misalnya STRIDE) untuk menelusuri skenario serangan yang mungkin terjadi pada tiap trust boundary, dikombinasikan dengan pemindaian teknis (vulnerability scanning pada endpoint API, dependency scanning pada library yang menangani komunikasi data). Pendekatan analisis risiko siber ini sejalan dengan prinsip manajemen risiko software pada IEC 62304 dan dapat diintegrasikan ke dalam proses manajemen risiko umum berbasis ISO 14971, di mana setiap skenario ancaman siber diperlakukan sebagai hazard dengan estimasi probability dan severity-nya sendiri.

Untuk tiap kerentanan yang teridentifikasi, catat skenario eksploitasinya (siapa penyerang, akses apa yang dibutuhkan, dampak apa yang mungkin terjadi pada data atau fungsi klinis) dan prioritaskan berdasarkan kombinasi kemungkinan eksploitasi dan dampaknya.

[Placeholder: Daftar hasil threat modeling dan vulnerability scanning per titik integrasi, beserta skenario eksploitasi dan prioritas risiko masing-masing]

## 4. Langkah Mitigasi dan Kontrol Keamanan

Tentukan kontrol mitigasi konkret untuk setiap risiko yang sudah diprioritaskan — misalnya enkripsi transport (TLS versi terbaru yang didukung), autentikasi mutual (mutual TLS atau token-based authentication dengan rotasi berkala), validasi dan sanitasi input pada setiap endpoint yang menerima data eksternal, serta segmentasi jaringan agar sistem yang terhubung ke internet terpisah dari sistem inti yang menyimpan data sensitif. Urutkan mitigasi berdasarkan risiko tertinggi terlebih dahulu, dan dokumentasikan keterkaitan antara satu kerentanan dan kontrol yang dipilih untuk menanganinya secara eksplisit (satu-ke-satu atau satu-ke-banyak).

[Placeholder: Daftar kontrol mitigasi yang diterapkan, dipetakan ke kerentanan spesifik yang ditangani masing-masing kontrol]

## 5. Verifikasi Efektivitas Kontrol

Bagian ini membedakan dokumen yang kuat dari dokumen yang sekadar deskriptif: setiap kontrol yang disebutkan di bagian sebelumnya harus dibuktikan benar-benar berfungsi di implementasi nyata, bukan hanya dirancang di atas kertas. Jalankan pengujian verifikasi spesifik per kontrol — misalnya penetration test untuk memastikan endpoint API benar-benar menolak request tanpa token valid, pengujian re-transmisi untuk memastikan mekanisme integritas data mendeteksi payload yang dimanipulasi, atau pengujian failover untuk memastikan mode degradasi saat koneksi putus benar-benar berjalan seperti didesain.

Catat hasil setiap pengujian verifikasi ini dengan jelas: metode pengujian, tanggal, hasil (lulus/gagal), dan jika ada temuan gagal, tindak lanjut perbaikannya serta pengujian ulang setelah perbaikan.

[Placeholder: Laporan hasil pengujian verifikasi (misalnya penetration test atau pengujian failover) untuk setiap kontrol keamanan yang diklaim diterapkan]

## Referensi Teknis

- FDA — Cybersecurity in Medical Devices: Quality System Considerations and Content of Premarket Submissions (2023) — https://fda.gov/media/173984/download
- IMDRF — Principles and Practices for Medical Device Cybersecurity (N60FINAL:2020) — https://www.imdrf.org/sites/default/files/docs/imdrf/final/technical/imdrf-tech-200318-pp-mdc-n60.docx
