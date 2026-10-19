# Alur Kerja Penggunaan, Interpretasi Keluaran, dan Mekanisme Intervensi Manusia

Dokumen ini digunakan untuk melengkapi Form B dossier, berfungsi sebagai dokumentasi yang lebih berorientasi pada pengguna akhir (klinisi/operator) dibandingkan dokumen teknis internal lainnya, sehingga perlu ditulis dengan tingkat kejelasan yang dapat dipahami langsung oleh tenaga kesehatan yang mengoperasikan sistem. Dokumen ini disiapkan menjelang tahap deployment, setelah workflow integrasi sistem dengan proses klinis ditetapkan.

## 1. Alur Kerja Penggunaan oleh Klinisi/Operator

Alur kerja perlu dijabarkan langkah demi langkah mulai dari akuisisi input (misalnya pengambilan citra, input data pasien ke sistem), proses komputasi oleh model, hingga titik keputusan di mana klinisi melihat dan menindaklanjuti output. Jika sistem terintegrasi dengan infrastruktur yang sudah ada (misalnya sebagai plugin pada viewer PACS atau modul tambahan pada EMR), titik integrasi ini perlu dijelaskan secara spesifik, termasuk estimasi waktu proses (latency) yang dialami pengguna dan pemeriksaan pra-penggunaan (misalnya kalibrasi perangkat) yang perlu dilakukan sebelum sistem digunakan pada pasien.

[Placeholder: Diagram alur kerja langkah-demi-langkah dari input hingga keputusan klinisi, beserta tangkapan layar antarmuka pada setiap langkah.]

## 2. Cara Interpretasi Keluaran Model

Format output model perlu dijelaskan secara konkret — apakah berupa skor probabilitas, overlay/heatmap segmentasi, atau label kelas dengan tingkat keyakinan (confidence score) — beserta makna praktis dari rentang nilai tersebut (misalnya rentang confidence yang masih memerlukan konfirmasi manual). Penjelasan ini perlu menegaskan bahwa output bersifat decision-support, bukan keputusan diagnostik final, untuk mencegah overinterpretasi oleh pengguna. Jika sistem menampilkan elemen explainability (misalnya saliency map atau Grad-CAM untuk menunjukkan area citra yang paling berkontribusi pada prediksi), cara membaca visualisasi tersebut juga perlu dijelaskan dengan contoh konkret.

[Placeholder: Panduan interpretasi output per jenis keluaran (skor, heatmap, label) beserta contoh tangkapan layar tampilan output dengan legenda penjelasan.]

## 3. Mekanisme Intervensi dan Override oleh Manusia (Human-in-the-loop)

Sistem perlu menyediakan mekanisme eksplisit bagi klinisi untuk menolak atau mengoreksi output AI, dan setiap tindakan override ini sebaiknya tercatat dalam audit log (siapa yang melakukan override, kapan, dan alasan singkatnya). Data override ini dapat menjadi sumber umpan balik untuk perbaikan model di masa depan, dengan catatan tata kelola yang jelas mengenai bagaimana data tersebut boleh digunakan kembali untuk retraining. Jalur eskalasi juga perlu didefinisikan — misalnya langkah yang diambil ketika output sistem berulang kali bertentangan dengan penilaian klinis pengguna.

[Placeholder: Skema/struktur log audit override (field yang direkam) beserta diagram jalur eskalasi ketika terjadi perbedaan penilaian.]

## 4. Identifikasi Versi Perangkat dan Pengelolaan Versi untuk Ketertelusuran Pascapemasaran

Strategi penomoran versi perlu membedakan antara versi model, versi software/aplikasi, dan versi dataset yang digunakan untuk melatih model tersebut (semantic versioning umum dipakai untuk ini). Nomor versi yang aktif sebaiknya ditampilkan pada antarmuka pengguna, dan setiap perubahan versi dicatat dalam changelog yang menautkan versi model ke versi dataset pelatihan serta laporan validasinya — praktik ini didukung oleh model registry seperti yang tersedia pada MLflow, yang memungkinkan penautan antara versi model yang dideploy dan riwayat eksperimen/validasinya. Prosedur notifikasi kepada pengguna saat terjadi update versi juga perlu didokumentasikan untuk mendukung ketertelusuran pascapemasaran.

[Placeholder: Tabel changelog versi (model, software, dataset) beserta tangkapan layar model registry yang menunjukkan pemetaan versi ke laporan validasi.]

## Referensi Teknis

- FDA — Applying Human Factors and Usability Engineering to Medical Devices — https://www.fda.gov/regulatory-information/search-fda-guidance-documents/applying-human-factors-and-usability-engineering-medical-devices
- WHO — Ethics and Governance of AI for Health: Large Multi-Modal Models — https://www.who.int/publications-detail-redirect/9789240084759
