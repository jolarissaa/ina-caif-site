# Hasil Evaluasi Kinerja Model: Akurasi, Confusion Matrix, Kurva Pembelajaran, dan AUC

Dokumen ini digunakan untuk melengkapi Form C dossier AI/ML, pada bagian yang memuat hasil kuantitatif evaluasi performa model. Dokumen ini disusun setelah model final diuji pada dataset pengujian independen, dan menjadi bukti utama bahwa performa model telah diukur secara objektif dan terstandar.

## 1. Perhitungan Metrik Klasifikasi Dasar

Metrik akurasi, precision, recall, dan F1-score dihitung menggunakan fungsi standar seperti sklearn.metrics.classification_report, yang secara otomatis menghasilkan breakdown per kelas untuk kasus multi-kelas. Untuk dataset dengan kelas tidak seimbang, macro average (rata-rata tidak berbobot antar kelas) biasanya lebih informatif dibanding accuracy saja, sementara weighted average memperhitungkan proporsi tiap kelas. Untuk memperkuat keandalan hasil, confidence interval dari setiap metrik dapat dihitung melalui teknik bootstrapping pada test set.

[Placeholder: Tabel output classification_report (precision, recall, F1 per kelas) beserta confidence interval hasil bootstrapping.]

## 2. Confusion Matrix dan Analisis Kesalahan

Confusion matrix dihasilkan menggunakan sklearn.metrics.confusion_matrix atau ConfusionMatrixDisplay, baik dalam bentuk raw count maupun normalized (persentase per baris/kolom) agar pola kesalahan lebih mudah dibaca pada kelas dengan jumlah sampel tidak seimbang. Analisis kesalahan sebaiknya tidak berhenti pada angka, melainkan diikuti dengan pengambilan sampel kasus yang salah klasifikasi (false positive/false negative yang signifikan secara klinis) untuk ditinjau secara kualitatif oleh klinisi, guna mengidentifikasi pola kegagalan sistematis.

[Placeholder: Visualisasi confusion matrix (raw dan normalized) beserta catatan hasil tinjauan kualitatif kasus yang salah klasifikasi.]

## 3. Kurva Pembelajaran (Learning Curve)

Learning curve menggambarkan performa model (loss atau metrik lain) pada training set dan validation set sepanjang epoch pelatihan, atau sebagai fungsi dari ukuran data pelatihan (dapat dihasilkan dengan sklearn.model_selection.learning_curve, atau dilog secara real-time melalui TensorBoard/MLflow). Kurva ini digunakan untuk mendiagnosis overfitting (gap antara training dan validation loss yang melebar) atau underfitting (keduanya plateau pada performa rendah), dan menjadi dasar keputusan teknis seperti early stopping, regularisasi, atau penambahan data.

[Placeholder: Plot learning curve (training vs validation) beserta interpretasi pola overfitting/underfitting yang teramati.]

## 4. Kurva ROC dan AUC

Kurva ROC dan nilai AUC-ROC dihitung menggunakan sklearn.metrics.roc_curve dan roc_auc_score; untuk kasus multi-kelas, pendekatan one-vs-rest umum digunakan untuk menghasilkan kurva per kelas. Pada dataset dengan kelas minoritas yang kecil, PR-AUC (precision-recall AUC) sering dilaporkan sebagai pelengkap karena lebih sensitif terhadap imbalance dibanding ROC-AUC. Pemilihan ambang keputusan (decision threshold) sebaiknya dijustifikasi secara teknis, misalnya menggunakan Youden's index atau ambang yang disesuaikan dengan konteks klinis (trade-off sensitivitas vs spesifisitas).

[Placeholder: Plot kurva ROC beserta nilai AUC, dan justifikasi pemilihan threshold keputusan yang digunakan.]

## 5. Analisis Performa pada Subgroup

Selain metrik agregat, performa model perlu dipecah berdasarkan subgroup yang relevan — misalnya kelompok usia, jenis kelamin, situs/perangkat asal data — untuk mendeteksi disparitas performa antar kelompok (subgroup performance analysis). Hasil ini saling terkait dengan strategi mitigasi bias yang telah didokumentasikan sebelumnya; gap performa yang signifikan antar subgroup menjadi sinyal bahwa mitigasi bias tambahan mungkin diperlukan.

[Placeholder: Tabel performa model yang dipecah berdasarkan strata demografis/site/perangkat.]

## Referensi Teknis

- TRIPOD+AI Statement — pedoman pelaporan untuk studi prediksi berbasis AI/ML di bidang kesehatan — https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11025451/
- FDA, Health Canada, MHRA — Good Machine Learning Practice (GMLP) for Medical Device Development: Guiding Principles — https://www.fda.gov/medical-devices/software-medical-device-samd/good-machine-learning-practice-medical-device-development-guiding-principles
