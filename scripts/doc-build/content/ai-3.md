# Dokumentasi Arsitektur Model AI, Kesesuaian Tujuan Penggunaan, dan Keterbatasan

Dokumen ini digunakan untuk melengkapi Form C dossier AI/ML, pada bagian yang menjelaskan desain teknis model serta argumentasi mengapa arsitektur yang dipilih sesuai dengan tujuan penggunaan klinis sistem. Dokumen ini biasanya disusun setelah tahap eksperimen arsitektur selesai dan model final telah ditetapkan.

## 1. Dokumentasi Arsitektur Model dan Base Model/Pretrained Architecture

Arsitektur model perlu dijelaskan secara konkret: tipe model (misalnya CNN berbasis ResNet, U-Net untuk segmentasi, transformer, atau model berbasis gradient boosting seperti XGBoost untuk data tabular), struktur layer, dimensi input/output, dan jumlah parameter. Jika model dibangun di atas arsitektur dasar/pretrained (base model), sumber bobot pretrained, versi, dan lisensinya perlu dicantumkan, beserta strategi fine-tuning yang dipakai (full fine-tuning, frozen backbone dengan head baru, atau teknik parameter-efficient seperti LoRA). Versi framework (misalnya PyTorch atau TensorFlow) dan dependency utama juga dicatat agar lingkungan pelatihan dapat direproduksi — praktik ini sejalan dengan konsep "model card" yang umum dipakai di komunitas ML.

[Placeholder: Diagram arsitektur model dan tabel model card (jumlah parameter, versi framework, sumber base model/pretrained weights).]

## 2. Justifikasi Kesesuaian Arsitektur dengan Tujuan Penggunaan (Intended Use)

Pemilihan arsitektur perlu dikaitkan secara eksplisit dengan karakteristik tugas klinis — misalnya arsitektur U-Net atau turunan SAM dipilih untuk tugas segmentasi karena kemampuannya melokalisasi batas spasial, sementara CNN klasifikasi dipilih ketika output berupa kategori diagnosis diskret. Pertimbangan lain yang relevan mencakup kesesuaian dengan resolusi/modalitas input, kebutuhan latensi (misalnya untuk penggunaan point-of-care), dan kapasitas komputasi perangkat target deployment. Ablation study yang membandingkan beberapa kandidat arsitektur pada dataset pengujian yang sama dapat digunakan sebagai bukti kuantitatif bahwa arsitektur terpilih memang paling sesuai dibanding alternatif.

[Placeholder: Tabel hasil ablation study perbandingan beberapa kandidat arsitektur pada dataset pengujian yang sama.]

## 3. Desain Evaluasi dengan Dataset Pengujian Independen

Evaluasi akhir performa model harus dilakukan pada dataset pengujian yang terpisah sepenuhnya dari dataset pelatihan (lihat verifikasi non-overlap pada dokumen pembagian dataset). Selama tahap pengembangan, k-fold cross-validation dapat digunakan untuk tuning hyperparameter, namun angka performa final yang dilaporkan sebaiknya hanya dihitung satu kali pada test set yang "dikunci" (locked test set) untuk menghindari overfitting terhadap test set akibat iterasi berulang. Setiap run evaluasi sebaiknya dicatat menggunakan tool experiment tracking seperti MLflow agar versi model, versi dataset, dan hasil metrik saling terhubung dan dapat ditelusuri.

[Placeholder: Dokumen protokol evaluasi (kapan dan bagaimana test set digunakan) beserta tangkapan layar log eksperimen MLflow.]

## 4. Identifikasi Keterbatasan Model dan Langkah Mitigasi

Keterbatasan model perlu diidentifikasi secara spesifik, misalnya potensi penurunan performa pada data out-of-distribution (perangkat/scanner berbeda dari yang digunakan saat pelatihan), performa lebih rendah pada kasus langka yang kurang terwakili dalam dataset, atau keterbatasan komputasi pada deployment. Langkah mitigasi yang dapat didokumentasikan meliputi teknik domain adaptation, monitoring performa pascapemasaran secara berkelanjutan, penetapan batas lingkup penggunaan (scope of use) yang jelas, dan penerapan estimasi ketidakpastian (misalnya Monte Carlo dropout atau conformal prediction) untuk menandai output dengan confidence rendah agar dapat ditinjau ulang oleh klinisi.

[Placeholder: Tabel keterbatasan model beserta langkah mitigasinya, dan contoh deskripsi hasil pengujian pada data out-of-distribution.]

## Referensi Teknis

- FDA — Artificial Intelligence and Machine Learning (AI/ML)-Enabled Medical Devices — https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-software-medical-device
- FDA, Health Canada, MHRA — Good Machine Learning Practice (GMLP) for Medical Device Development: Guiding Principles — https://www.fda.gov/medical-devices/software-medical-device-samd/good-machine-learning-practice-medical-device-development-guiding-principles
