# Panduan Teknis Validasi Klinis Lokal untuk Populasi Indonesia

Dokumen ini digunakan untuk melengkapi Form C dossier bukti klinis, khusus untuk produk impor atau produk yang bukti klinis awalnya dikembangkan/divalidasi pada populasi luar Indonesia. Dokumen ini menjelaskan bagaimana validasi klinis lokal dirancang dan dijalankan untuk membuktikan bahwa performa produk tetap valid pada populasi, praktik klinis, dan karakteristik perangkat yang digunakan di Indonesia.

## 1. Memilih Mitra Uji Lokal

Pilih fasilitas kesehatan mitra berdasarkan kriteria yang relevan dengan kebutuhan validasi, bukan sekadar ketersediaan atau kemudahan akses. Kriteria yang perlu dipertimbangkan meliputi status akreditasi fasilitas, kapasitas kasus (jumlah pasien dengan kondisi target yang cukup untuk mencapai besar sampel yang dibutuhkan dalam jangka waktu studi yang wajar), infrastruktur data yang memadai (sistem rekam medis elektronik atau kemampuan mendigitalkan data yang dibutuhkan), serta keberadaan komite etik penelitian yang aktif di fasilitas tersebut untuk mendukung proses persetujuan etik.

Jika validasi membutuhkan lebih dari satu situs untuk menangkap variasi populasi/perangkat yang lebih representatif, dokumentasikan alasan pemilihan kombinasi situs tersebut — misalnya mewakili variasi geografis, tipe fasilitas (rumah sakit pendidikan vs fasilitas layanan primer), atau variasi merek/model perangkat akuisisi data yang umum dipakai di Indonesia.

[Placeholder: Daftar kandidat mitra uji lokal beserta kriteria seleksi (akreditasi, kapasitas kasus, infrastruktur data, komite etik) dan justifikasi mitra yang akhirnya dipilih]

## 2. Mendesain Protokol Validasi

Rancang protokol validasi yang secara eksplisit memeriksa representasi demografi populasi lokal (usia, jenis kelamin, karakteristik etnis/geografis jika relevan secara klinis) dibanding populasi pada data pelatihan/validasi awal produk, karena perbedaan demografi adalah salah satu sumber utama penurunan performa model saat dipindahkan ke populasi baru. Pertimbangkan juga perbedaan prevalensi penyakit — prevalensi yang berbeda antara populasi asal pengembangan produk dan populasi lokal dapat memengaruhi nilai prediktif (positive/negative predictive value) meski sensitivitas-spesifisitas model secara teoretis tidak berubah.

Dokumentasikan variasi perangkat akuisisi data yang dipakai di situs lokal (merek, model, versi firmware/software perangkat pencitraan atau sensor) dibanding perangkat yang dipakai saat pengembangan produk, karena perbedaan karakteristik sinyal/citra antar perangkat dapat memengaruhi performa model (domain shift). Lakukan performance gap analysis yang membandingkan metrik performa pada data lokal terhadap metrik yang dilaporkan pada data validasi awal, dan jika ditemukan gap yang signifikan, dokumentasikan rencana mitigasi (misalnya fine-tuning tambahan pada data lokal, atau penyesuaian ambang keputusan khusus untuk konteks lokal).

[Placeholder: Protokol validasi lokal (kriteria representasi demografi, dokumentasi variasi perangkat akuisisi data) dan hasil performance gap analysis dibanding data validasi awal produk]

## 3. Pelaporan Progres Validasi Selama 1 Tahun

Susun Gantt chart yang memetakan tahapan validasi sepanjang periode satu tahun — mulai dari persetujuan etik, rekrutmen kasus, pengumpulan data, analisis, hingga pelaporan akhir — dengan milestone yang jelas pada setiap kuartal agar progres dapat dipantau secara berkala, bukan hanya dilaporkan di akhir periode. Laporan kemajuan berkala (misalnya triwulanan) sebaiknya mencakup jumlah kasus yang sudah terkumpul dibanding target, kendala operasional yang dihadapi di lapangan, dan penyesuaian rencana jika diperlukan.

Laporan akhir periode validasi menyajikan hasil performance gap analysis yang telah dilakukan, kesimpulan mengenai kesesuaian produk untuk populasi lokal, dan rekomendasi tindak lanjut — baik berupa konfirmasi bahwa produk dapat digunakan tanpa penyesuaian, atau rekomendasi penyesuaian teknis (fine-tuning, perubahan ambang, pembatasan ruang lingkup penggunaan) yang perlu dilakukan sebelum penggunaan lebih luas di Indonesia dilanjutkan.

[Placeholder: Gantt chart rencana validasi 1 tahun, laporan kemajuan triwulanan, dan laporan akhir beserta rekomendasi tindak lanjut]

## Referensi Teknis

- WHO — Generating Evidence for AI-Based Medical Devices (2021) — https://www.who.int/publications/i/item/9789240038462
- IMDRF N41 — Software as a Medical Device (SaMD): Clinical Evaluation — https://www.imdrf.org/docs/imdrf/final/technical/imdrf-tech-170921-samd-n41-clinical-evaluation_1.pdf
