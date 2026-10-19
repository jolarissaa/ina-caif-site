# Dokumentasi Sumber, Komposisi, Pembagian Dataset, dan Mitigasi Bias

Dokumen ini digunakan untuk melengkapi Form C dossier AI/ML, khususnya bagian yang menjelaskan asal-usul dan struktur dataset pelatihan/validasi/pengujian. Dokumen ini disiapkan setelah proses pengumpulan data selesai dan sebelum model mulai dilatih, karena pembagian dataset yang didokumentasikan di sini menjadi acuan untuk evaluasi pada dokumen performa model.

## 1. Dokumentasi Sumber dan Ukuran Dataset

Setiap sumber data perlu dicatat secara terstruktur: institusi/fasilitas asal, periode pengumpulan, referensi persetujuan etik, serta jumlah total sampel dan distribusinya per kelas/kategori. Praktik yang umum dipakai adalah menyusun "dataset card" (mengacu pada konsep datasheets for datasets) yang merangkum metodologi pengumpulan data, termasuk apakah data berasal dari satu situs/perangkat atau multi-situs, karena hal ini berimplikasi langsung pada generalisasi model.

[Placeholder: Dataset card berisi tabel sumber data, periode pengumpulan, dan jumlah sampel per kelas/site.]

## 2. Proses Pelabelan, Kurasi, dan Anotasi

Protokol anotasi perlu menjelaskan jumlah dan kualifikasi anotator (misalnya dokter spesialis bersertifikat untuk label diagnostik), tool anotasi yang digunakan (Label Studio, CVAT, atau software khusus citra medis seperti 3D Slicer), serta mekanisme adjudikasi ketika terjadi perbedaan label antar-anotator. Kesepakatan antar-anotator sebaiknya diukur secara kuantitatif menggunakan metrik seperti Cohen's kappa (untuk dua anotator) atau Fleiss' kappa (untuk lebih dari dua), dan nilai ini dilaporkan sebagai indikator kualitas label. Penanganan data hilang atau label ambigu (misalnya kasus borderline) juga perlu dijelaskan — apakah dikeluarkan dari dataset atau diberi label khusus "uncertain".

[Placeholder: SOP anotasi, skor inter-rater agreement (kappa), dan tangkapan layar tool anotasi yang dipakai.]

## 3. Pembagian Dataset dan Pencegahan Data Leakage

Pembagian train/validation/test sebaiknya dilakukan pada level subjek/pasien, bukan pada level sampel individual (misalnya per irisan citra atau per kunjungan), untuk menghindari kebocoran data (data leakage) ketika satu pasien memiliki beberapa sampel yang tersebar di lebih dari satu split. Jika diperlukan validasi berlapis, group-based k-fold cross-validation (misalnya GroupKFold di scikit-learn) dapat digunakan agar pengelompokan per subjek tetap konsisten di setiap fold. Pembagian sebaiknya dilakukan secara stratified untuk mempertahankan proporsi kelas pada setiap split, dengan random seed yang dicatat agar hasil pembagian dapat direproduksi.

Setelah pembagian dilakukan, perlu ada verifikasi eksplisit bahwa tidak ada overlap ID pasien antar-split — biasanya diimplementasikan sebagai pengecekan set intersection sederhana yang dijalankan sebagai bagian dari pipeline data, dan hasilnya (harus nol overlap) dicatat sebagai bukti.

[Placeholder: Output skrip verifikasi overlap ID pasien antar-split (train/val/test) beserta rasio pembagian yang digunakan.]

## 4. Analisis Komposisi dan Justifikasi Kecukupan Dataset

Komposisi dataset perlu dirangkum secara deskriptif: distribusi demografis (usia, jenis kelamin), distribusi kelas/label, serta variasi sumber data (perangkat, situs pengambilan data). Justifikasi kecukupan ukuran dataset dapat didukung dengan dua pendekatan: perhitungan ukuran sampel a priori berdasarkan target power statistik, atau pendekatan empiris menggunakan learning curve — memplot performa model terhadap ukuran subset data pelatihan untuk menunjukkan apakah performa sudah mendekati plateau pada ukuran dataset yang tersedia.

[Placeholder: Tabel/grafik komposisi demografis dan kelas dataset, serta hasil analisis kecukupan ukuran dataset (perhitungan sampel atau learning curve).]

## 5. Strategi Mitigasi Bias

Sumber bias yang umum perlu diidentifikasi secara spesifik, misalnya selection bias (data hanya dari satu situs/perangkat), label bias (anotator berasal dari demografi tertentu), atau class imbalance. Teknik mitigasi yang dapat diterapkan antara lain stratified sampling saat pengumpulan, teknik resampling seperti SMOTE (melalui library imbalanced-learn) untuk oversampling kelas minoritas, reweighting pada loss function saat training, atau memperluas pengumpulan data ke lebih dari satu situs. Audit bias lebih lanjut dapat dibantu dengan toolkit fairness seperti Fairlearn atau Aequitas, yang hasilnya akan digunakan juga pada analisis subgroup performance di dokumen evaluasi model.

[Placeholder: Deskripsi strategi mitigasi bias yang diterapkan beserta perbandingan distribusi kelas/demografi sebelum dan setelah mitigasi.]

## Referensi Teknis

- FDA, Health Canada, MHRA — Good Machine Learning Practice (GMLP) for Medical Device Development: Guiding Principles — https://www.fda.gov/medical-devices/software-medical-device-samd/good-machine-learning-practice-medical-device-development-guiding-principles
- Fairlearn — toolkit dan dokumentasi untuk pengukuran dan mitigasi bias algoritmik — https://fairlearn.org/
