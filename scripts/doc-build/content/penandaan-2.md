# Informasi Keselamatan dan Penggunaan pada Label Produk

Dokumen ini memandu tim menyusun tujuan penggunaan, petunjuk penggunaan, informasi kinerja, dan peringatan keselamatan yang jelas dan mudah dipahami — digunakan saat menyiapkan konten label/IFU untuk berkas Form D Regalkes.

## 1. Menyusun Intended Use Statement yang Presisi

Susun intended use statement dalam satu atau dua kalimat yang secara eksplisit menyebut tiga elemen: populasi target (usia, kondisi klinis, karakteristik demografis yang relevan), kondisi klinis atau jenis pemeriksaan yang dicakup, dan peran produk dalam keputusan klinis (apakah bersifat assistive/decision-support, screening, atau diagnostik definitif). Hindari kalimat generik seperti "membantu dokter dalam diagnosis" tanpa batasan — kalimat ini harus cukup spesifik agar bisa diuji: apakah output produk sesuai klaim ini saat divalidasi pada populasi yang disebutkan. Intended use statement ini juga harus selaras dengan ruang lingkup yang diuji pada data validasi klinis, karena ketidaksesuaian antara klaim dan bukti validasi adalah sumber temuan paling umum.

- Gunakan struktur: [nama produk] digunakan untuk [tugas/fungsi spesifik] pada [populasi/kondisi klinis target] untuk membantu [peran dalam keputusan klinis] oleh [profil pengguna, misalnya dokter spesialis radiologi]
- Cantumkan batasan eksplisit (exclusion criteria) — populasi atau kondisi yang TIDAK tercakup oleh intended use, misalnya rentang usia tertentu atau modalitas pencitraan tertentu

[Placeholder: draf intended use statement beserta bukti kesesuaiannya dengan ruang lingkup data validasi klinis/uji kinerja]

## 2. Menulis Instructions for Use (IFU) yang Actionable

Susun IFU sebagai langkah-langkah operasional yang bisa langsung diikuti pengguna, bukan deskripsi umum tentang cara kerja produk. Setiap langkah idealnya memuat: input yang dibutuhkan (format data, kualitas minimal), tindakan yang harus dilakukan pengguna, dan output yang akan muncul beserta cara menafsirkannya. Sertakan juga langkah troubleshooting untuk skenario kegagalan umum (misalnya kualitas input di bawah ambang, sistem tidak merespons) dan siapa yang harus dihubungi jika kendala tidak terselesaikan. IFU sebaiknya disusun dan divalidasi melalui proses usability engineering sesuai IEC 62366-1, termasuk uji keterbacaan pada pengguna representatif sebelum dirilis.

- Tulis IFU dalam format bernomor (step-by-step), bukan paragraf naratif panjang
- Sertakan tangkapan layar atau diagram alur untuk langkah yang melibatkan interaksi UI
- Pisahkan IFU untuk peran pengguna yang berbeda jika produk digunakan oleh lebih dari satu jenis pengguna (misalnya dokter vs admin IT)

[Placeholder: dokumen IFU final beserta catatan hasil uji keterbacaan/usability pada pengguna representatif]

## 3. Merumuskan Peringatan Keselamatan Berbasis Manajemen Risiko

Rumuskan setiap peringatan keselamatan langsung dari output proses manajemen risiko (risk management file sesuai ISO 14971), bukan dari template generik. Untuk setiap bahaya (hazard) yang teridentifikasi dan risikonya tidak dapat dieliminasi sepenuhnya melalui desain, tuliskan peringatan yang menjelaskan: situasi pemicu, konsekuensi klinis yang mungkin terjadi, dan tindakan mitigasi yang harus dilakukan pengguna. Lakukan traceability eksplisit — setiap baris peringatan pada label harus bisa ditelusuri balik ke baris risiko tertentu pada risk analysis, sehingga tidak ada peringatan yang "mengada-ada" maupun risiko signifikan yang terlewat tidak diberi peringatan.

- Buat tabel traceability dua kolom: ID risiko pada risk management file ↔ kalimat peringatan terkait pada label/IFU
- Tulis peringatan dalam bahasa yang menyebut konsekuensi konkret (misalnya "dapat menghasilkan false negative pada kondisi X"), bukan frasa umum seperti "gunakan dengan hati-hati"

[Placeholder: risk management file (ISO 14971) beserta tabel traceability yang menghubungkan setiap peringatan pada label dengan baris risiko terkait]

## 4. Menyajikan Informasi Kinerja Produk secara Terukur

Sajikan informasi kinerja menggunakan metrik yang terukur dan relevan dengan intended use — misalnya sensitivitas, spesifisitas, akurasi, atau metrik lain yang sesuai jenis algoritma, lengkap dengan ukuran sampel dan karakteristik dataset uji yang digunakan. Cantumkan juga interval kepercayaan atau rentang variasi jika tersedia, serta kondisi pengujian (apakah pada data internal/retrospektif atau uji klinis prospektif) agar pengguna dapat menilai konteks klaim kinerja tersebut. Hindari menyajikan satu angka kinerja tunggal tanpa konteks populasi uji, karena ini berisiko disalahartikan berlaku untuk seluruh populasi target.

[Placeholder: ringkasan hasil uji kinerja/validasi klinis (metrik, ukuran sampel, karakteristik dataset) yang akan dikutip pada label]

## Referensi Teknis

- FDA — Applying Human Factors and Usability Engineering to Medical Devices — https://www.fda.gov/regulatory-information/search-fda-guidance-documents/applying-human-factors-and-usability-engineering-medical-devices
- IEC 62366-1 — Medical Devices, Part 1: Application of Usability Engineering to Medical Devices — https://webstore.iec.ch/en/publication/21863
