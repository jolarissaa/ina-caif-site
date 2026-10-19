# Protokol dan Laporan Verifikasi, Validasi, Batas Penerimaan, dan Deteksi Anomali

Dokumen ini digunakan untuk melengkapi Form C dossier AI/ML, pada bagian yang memuat protokol pengujian sistem secara menyeluruh (bukan hanya performa model secara statistik, tetapi perilaku sistem dalam kondisi operasional). Dokumen ini disusun setelah model final ditetapkan, sebagai tahap pengujian sebelum sistem dinyatakan siap dipasarkan.

## 1. Perancangan Protokol Verifikasi dan Validasi

Verifikasi dan validasi perlu dibedakan secara teknis: verifikasi mengecek apakah sistem memenuhi spesifikasi desain yang ditetapkan (misalnya melalui unit test dan integration test pada kode, dijalankan dengan framework seperti pytest), sementara validasi mengecek apakah sistem memenuhi tujuan penggunaan klinis yang dimaksud (misalnya melalui studi validasi dengan skenario penggunaan nyata). Praktik yang membantu penelusuran adalah menyusun requirement traceability matrix (RTM) yang memetakan setiap requirement fungsional ke test case yang memverifikasinya, sehingga cakupan pengujian dapat diaudit.

[Placeholder: Dokumen protokol V&V beserta requirement traceability matrix (requirement — test case — hasil).]

## 2. Penetapan Kriteria/Batas Penerimaan (Acceptance Criteria)

Batas penerimaan untuk setiap metrik (misalnya nilai minimum sensitivitas atau spesifisitas) sebaiknya ditetapkan dan disepakati bersama stakeholder klinis sebelum pengujian dilakukan (pre-registered), untuk menghindari penyesuaian ambang setelah hasil diketahui (post-hoc cherry picking). Validasi terhadap batas ini sebaiknya memperhitungkan ketidakpastian statistik — misalnya batas bawah confidence interval metrik harus tetap di atas ambang yang disepakati, bukan hanya nilai titik estimasinya. Proses persetujuan (sign-off) oleh tim QA dan penanggung jawab klinis sebaiknya dicatat sebagai log formal.

[Placeholder: Tabel kriteria penerimaan (metrik, ambang, hasil aktual, status lolos/tidak) beserta log sign-off dari tim QA dan klinis.]

## 3. Deteksi Anomali dan Mekanisme Monitoring

Deteksi anomali mencakup dua sisi: anomali pada data input (data drift) dan anomali pada output model. Untuk data drift, pendekatan statistik seperti uji Kolmogorov-Smirnov atau Population Stability Index (PSI) dapat dipakai untuk membandingkan distribusi data produksi dengan distribusi data training. Untuk anomali output, sistem dapat memantau confidence score yang berada di luar rentang wajar atau pola prediksi yang tidak konsisten. Pipeline monitoring seperti Evidently AI atau WhyLogs dapat diimplementasikan untuk menjalankan pengecekan ini secara berkala dan memicu alert ketika ambang drift terlampaui.

[Placeholder: Tangkapan layar dashboard monitoring anomali/drift beserta log hasil pengujian drift pada periode tertentu.]

## 4. Pelaporan Hasil V&V dan Dokumentasi Keterbatasan

Laporan V&V sebaiknya distrukturkan per test case: ID test case, hasil yang diharapkan, hasil aktual, status pass/fail, dan tindak lanjut jika terjadi deviasi (dicatat sebagai log tindakan korektif, mirip pola corrective action namun ditulis sebagai proses teknis internal). Keterbatasan sistem yang teridentifikasi selama pengujian — termasuk kondisi di mana sistem tidak diuji atau performanya menurun — perlu dirangkum secara eksplisit sebagai bagian dari laporan ini, karena akan menjadi input bagi dokumentasi petunjuk penggunaan.

[Placeholder: Tabel ringkasan hasil V&V (test case, hasil, status) beserta log deviasi/tindakan korektif.]

## 5. Komunikasi Keterbatasan pada Labeling/Petunjuk Penggunaan

Temuan keterbatasan dari proses V&V perlu diterjemahkan menjadi pernyataan peringatan/catatan penggunaan yang spesifik pada penandaan produk atau Instruction for Use (IFU) — misalnya pernyataan yang menyebutkan kondisi spesifik yang belum divalidasi, bukan disclaimer generik. Setiap pernyataan pada IFU sebaiknya dapat ditelusuri balik ke ID temuan V&V yang mendasarinya, agar konsistensi antara hasil pengujian dan informasi yang disampaikan ke pengguna akhir terjaga.

[Placeholder: Tabel pemetaan temuan V&V ke pernyataan keterbatasan pada draf IFU/penandaan produk.]

## Referensi Teknis

- FDA, Health Canada, MHRA — Good Machine Learning Practice (GMLP) for Medical Device Development: Guiding Principles — https://www.fda.gov/medical-devices/software-medical-device-samd/good-machine-learning-practice-medical-device-development-guiding-principles
- IEC 62304:2006+AMD1:2015 — Siklus Hidup Perangkat Lunak Alat Kesehatan — https://webstore.iec.ch/publication/22794
