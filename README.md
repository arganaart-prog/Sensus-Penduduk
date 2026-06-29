# Demo Edukasi Keamanan Siber

Project static untuk seminar berjudul **"Bahaya Klik Link Sembarangan dan Mengisi Data pada Link Tidak Dikenal"**.

Konsep halaman utama sudah dibuat seperti **form pendataan warga bergaya sensus**, tetapi tetap fiktif dan aman untuk edukasi. Website ini bukan situs resmi pemerintah, tidak memakai logo/identitas instansi, dan tidak meminta data sensitif seperti NIK, nomor KK, alamat lengkap, nomor HP, email, password, kamera, atau mikrofon.

Website hanya meminta izin lokasi setelah relawan mengisi form demo, mencentang persetujuan, lalu menekan tombol **Kirim Form & Mulai Verifikasi Lokasi**. Browser hanya memberikan lokasi jika pengguna memilih **Allow/Izinkan**.

## Isi Project

- `index.html` - halaman simulasi form pendataan warga dan demo izin lokasi.
- `dashboard.html` - halaman panitia untuk membuka Google Sheets.
- `style.css` - tampilan tema gelap dan layout form responsif.
- `script.js` - logika validasi form, consent, geolocation, dan pengiriman data.
- `README.md` - dokumentasi dan kode Google Apps Script.

## Cara Upload ke GitHub Pages

1. Buat repository baru di GitHub.
2. Upload semua file project ini ke repository.
3. Buka menu **Settings** repository.
4. Masuk ke **Pages**.
5. Pada bagian **Build and deployment**, pilih source dari branch utama, misalnya `main`.
6. Simpan, lalu tunggu GitHub membuat URL Pages.
7. Buka URL GitHub Pages yang muncul, misalnya `https://username.github.io/nama-repo/`.

Catatan: Geolocation pada browser modern membutuhkan HTTPS atau localhost. GitHub Pages sudah memakai HTTPS.

## Cara Membuat Google Sheets

1. Buka Google Sheets.
2. Buat spreadsheet baru, misalnya bernama `Data Demo Pendataan Warga`.
3. Biarkan sheet pertama tetap kosong.
4. Salin URL spreadsheet untuk dipakai di dashboard panitia.

## Cara Membuat Google Apps Script

1. Di Google Sheets, buka menu **Extensions** > **Apps Script**.
2. Hapus isi file contoh.
3. Tempel kode berikut.
4. Simpan project.

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var params = e.parameter || {};

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Kode Responden",
        "Rentang Usia",
        "Jumlah Anggota Rumah",
        "Status Tempat Tinggal",
        "Akses Internet",
        "Wilayah Simulasi",
        "Latitude",
        "Longitude",
        "Accuracy",
        "User Agent",
        "Google Maps"
      ]);
    }

    var timestamp = params.timestamp || new Date().toISOString();
    var respondentCode = params.respondentCode || "";
    var ageRange = params.ageRange || "";
    var householdSize = params.householdSize || "";
    var housingStatus = params.housingStatus || "";
    var internetAccess = params.internetAccess || "";
    var areaCode = params.areaCode || "";
    var latitude = params.latitude || "";
    var longitude = params.longitude || "";
    var accuracy = params.accuracy || "";
    var userAgent = params.userAgent || "";
    var googleMaps = "";

    if (latitude && longitude) {
      googleMaps = "https://www.google.com/maps?q=" + encodeURIComponent(latitude + "," + longitude);
    }

    sheet.appendRow([
      timestamp,
      respondentCode,
      ageRange,
      householdSize,
      housingStatus,
      internetAccess,
      areaCode,
      latitude,
      longitude,
      accuracy,
      userAgent,
      googleMaps
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({
        status: "ok",
        message: "Data tersimpan"
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Cara Deploy Apps Script sebagai Web App

1. Klik **Deploy** > **New deployment**.
2. Klik ikon gear, lalu pilih **Web app**.
3. Isi deskripsi, misalnya `Endpoint demo pendataan warga`.
4. Pada **Execute as**, pilih **Me**.
5. Pada **Who has access**, pilih **Anyone**.
6. Klik **Deploy**.
7. Beri izin akses jika diminta oleh Google.
8. Salin **Web app URL** yang diberikan.

## Mengganti SCRIPT_URL

1. Buka file `script.js`.
2. Cari baris berikut:

```javascript
const SCRIPT_URL = "ISI_URL_GOOGLE_APPS_SCRIPT_DI_SINI";
```

3. Ganti nilainya dengan URL Web App dari Google Apps Script.

Contoh:

```javascript
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxContohURL/exec";
```

4. Commit dan upload ulang file `script.js` ke GitHub.

## Data yang Dikirim

Data dikirim hanya setelah relawan menekan tombol, mencentang persetujuan, dan memberi izin lokasi dari browser:

- `respondentCode` - kode simulasi, bukan nama lengkap.
- `ageRange` - rentang usia.
- `householdSize` - rentang jumlah anggota rumah.
- `housingStatus` - status tempat tinggal pilihan umum.
- `internetAccess` - jenis akses internet umum.
- `areaCode` - wilayah simulasi, bukan alamat lengkap.
- `latitude`
- `longitude`
- `accuracy`
- `timestamp`
- `userAgent`
- `consent = true`

Jangan menambahkan field nama lengkap, NIK, nomor KK, nomor HP, email, password, alamat lengkap, atau data sensitif lain.

## Cara Melakukan Demo di Seminar

1. Siapkan Google Sheets dan Google Apps Script.
2. Pastikan `SCRIPT_URL` di `script.js` sudah diganti dengan URL Web App.
3. Buka halaman GitHub Pages di perangkat relawan yang sudah setuju.
4. Jelaskan bahwa form ini fiktif, bukan situs resmi pemerintah, dan hanya untuk demo keamanan siber.
5. Minta relawan mengisi pilihan form demo tanpa data pribadi asli.
6. Minta relawan mencentang persetujuan demo.
7. Tekan **Kirim Form & Mulai Verifikasi Lokasi**.
8. Minta relawan memilih **Izinkan** jika bersedia mengikuti simulasi lokasi.
9. Tampilkan ringkasan form, koordinat, akurasi, waktu akses, user agent, dan link Google Maps.
10. Buka `dashboard.html`, tempel link Google Sheets, lalu cek baris data terbaru.
11. Hapus data setelah seminar selesai.

## Narasi Demo Presenter

"Perhatikan, tampilan form seperti ini bisa membuat orang merasa sedang mengisi pendataan resmi. Website ini tetap tidak bisa mengambil lokasi sebelum saya menekan Izinkan. Tapi setelah saya mengisi form, menekan tombol, dan memilih Izinkan, isian form, koordinat lokasi, akurasi, waktu akses, dan user agent bisa terbaca dan dikirim ke penyimpanan. Inilah kenapa kita tidak boleh asal klik link, tidak boleh asal mengisi data pribadi, dan tidak boleh asal memberi izin lokasi, kamera, mikrofon, atau notifikasi."

## Catatan Etika

- Gunakan relawan yang sudah setuju.
- Jangan mengambil data peserta diam-diam.
- Jangan menyimpan data sensitif.
- Jangan meminta nama lengkap, nomor HP, email, password, NIK, nomor KK, alamat lengkap, atau data pribadi lain.
- Hapus data setelah demo selesai.
- Jangan meniru website resmi seperti bank, pemerintah, sekolah, media sosial, marketplace, atau layanan populer lain.
- Jelaskan bahwa browser hanya memberikan lokasi setelah pengguna menekan **Allow/Izinkan**.
- Sampaikan bahwa form ini sengaja dibuat fiktif agar peserta belajar mengenali risiko tanpa tertipu oleh tiruan brand resmi.

Project ini tidak memakai framework, build tools, PHP, Laravel, Express, backend server, atau database sendiri. Penyimpanan demo memakai Google Apps Script dan Google Sheets.
