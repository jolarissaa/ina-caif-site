# Dokumentasi Jenis Data Input, Kriteria Pemilihan, dan Pra-pemrosesan Dataset

Dokumen ini digunakan untuk melengkapi Form C dossier AI/ML saat mengajukan izin edar, pada bagian yang menjelaskan karakteristik data input serta bagaimana data tersebut disiapkan sebelum masuk ke pipeline pelatihan model. Isi dokumen ini disusun pada tahap awal pengembangan, sebelum proses pelabelan dan pembagian dataset dilakukan.

## 1. Identifikasi dan Klasifikasi Jenis Data Input

Langkah pertama adalah memetakan secara eksplisit modalitas data yang digunakan sistem — misalnya citra diagnostik (DICOM, JPEG, PNG), data rekam medis terstruktur (field EHR, idealnya dipetakan ke standar interoperabilitas seperti HL7 FHIR), sinyal fisiologis time-series (ECG, PPG, EEG dengan sampling rate tertentu), riwayat pengobatan dalam bentuk tabular, atau teks medis bebas (catatan klinis, laporan radiologi). Setiap modalitas perlu didokumentasikan bersama spesifikasi teknisnya agar dapat direproduksi oleh tim lain.

Hal-hal yang perlu dicatat per jenis data meliputi:
- Format file dan encoding (misalnya DICOM dengan metadata tag yang dipakai, atau CSV dengan skema kolom)
- Spesifikasi akuisisi: perangkat/sensor, resolusi citra, sampling rate sinyal, satuan ukuran
- Rentang nilai valid dan unit pengukuran untuk setiap variabel numerik
- Sumber data jika berasal dari literatur ilmiah tambahan (bukan data pasien langsung)

[Placeholder: Tabel rincian jenis data input beserta format, spesifikasi akuisisi, dan sumbernya; dapat disertai tangkapan layar skema data (data dictionary) yang digunakan tim pengembang.]

## 2. Kriteria Inklusi dan Eksklusi Data

Kriteria pemilihan data sebaiknya dituangkan sebagai aturan yang dapat dieksekusi secara terprogram, bukan hanya deskripsi naratif. Dalam praktiknya, kriteria ini diimplementasikan sebagai skrip filter (misalnya menggunakan pandas) yang menyaring data mentah berdasarkan ambang kualitas — misalnya deteksi blur/resolusi minimum untuk citra, kelengkapan field wajib untuk data tabular, rentang usia pasien, atau status konfirmasi diagnosis (ground truth sudah final atau masih provisional).

Setiap kriteria filter idealnya disertai log jumlah data yang masuk dan tereksklusi pada tiap tahap (funnel/flow count), sehingga proses seleksi dapat ditelusuri ulang. Skrip seleksi ini sebaiknya diversi dengan git dan, jika volume data besar, dataset hasil seleksi divangkan menggunakan DVC agar setiap versi kriteria pemilihan terhubung dengan versi dataset yang dihasilkan.

[Placeholder: Daftar kriteria inklusi/eksklusi beserta alasan teknisnya, dan diagram alur (flow diagram) jumlah data pada setiap tahap penyaringan.]

## 3. Metode Pra-pemrosesan dan Rasional Ilmiah

Pipeline pra-pemrosesan perlu didokumentasikan langkah demi langkah dengan rasional yang mengacu pada literatur atau praktik umum di domain terkait. Untuk citra, ini mencakup resizing/resampling ke dimensi tetap, normalisasi intensitas (z-score atau min-max scaling), dan augmentasi jika digunakan pada tahap training (menggunakan torchvision.transforms atau albumentations). Untuk sinyal fisiologis, mencakup filtering (misalnya bandpass filter untuk menghilangkan noise ECG), resampling frekuensi, dan segmentasi window. Untuk data tabular/EHR, mencakup imputasi nilai hilang, encoding variabel kategorikal, dan standardisasi fitur numerik — umumnya diimplementasikan sebagai scikit-learn Pipeline/ColumnTransformer agar transformasi konsisten antara data training dan data saat inferensi.

Setiap pilihan metode pra-pemrosesan sebaiknya disertai justifikasi singkat (misalnya mengapa memilih median imputation dibanding mean untuk variabel dengan distribusi skewed), dan parameter yang digunakan (ambang filter, ukuran window) dicatat secara eksplisit agar dapat diulang.

[Placeholder: Diagram atau kode pipeline pra-pemrosesan beserta parameter yang dipakai, dan grafik perbandingan distribusi data sebelum/setelah pra-pemrosesan.]

## 4. Reproducibility dan Version Control Pipeline Pra-pemrosesan

Agar pra-pemrosesan dapat diaudit dan direproduksi, pipeline sebaiknya dikelola sebagai kode yang diversi (git), dengan parameter run dicatat melalui tool experiment tracking seperti MLflow, dan artefak data perantara divangkan dengan DVC sehingga setiap kombinasi (kode pra-pemrosesan, parameter, dataset output) memiliki jejak yang jelas. Modul pra-pemrosesan yang sama (bukan implementasi terpisah) sebaiknya dipakai ulang pada tahap inferensi produksi, untuk menghindari skew antara training dan serving. Validasi skema data otomatis (misalnya dengan Great Expectations atau pandera) dapat ditambahkan untuk mendeteksi perubahan struktur data di kemudian hari.

[Placeholder: Tangkapan layar file konfigurasi pipeline (misalnya dvc.yaml) atau log run MLflow yang menunjukkan parameter pra-pemrosesan yang digunakan.]

## Referensi Teknis

- FDA, Health Canada, MHRA — Good Machine Learning Practice (GMLP) for Medical Device Development: Guiding Principles — https://www.fda.gov/medical-devices/software-medical-device-samd/good-machine-learning-practice-medical-device-development-guiding-principles
- Gebru et al. — Datasheets for Datasets — https://arxiv.org/abs/1803.09010
