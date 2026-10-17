# Skyvee Tech — landing page

Satu halaman statis untuk profil bisnis Skyvee Tech (servis laptop & komputer, Kajen).
Tanpa build tools, tanpa database. Cukup buka `index.html` di browser.

## Isi folder

```
index.html            halaman utama
artikel/              tiga artikel panduan (halaman terpisah)
assets/css/style.css  tampilan
assets/js/main.js     menu HP, cek gejala, mode gelap, animasi
assets/img/           logo, foto, QR WhatsApp, gambar preview (og.jpg)
assets/skyvee-tech.vcf  kartu kontak untuk tombol "Simpan kontak"
assets/favicon.svg    ikon tab browser
```

## Cara melihat

Klik dua kali `index.html`. Peta Google dan font butuh koneksi internet.
Untuk hasil paling mirip aslinya, jalankan server lokal:

```powershell
python -m http.server 5500
# buka http://127.0.0.1:5500
```

## Cara online-kan (gratis)

**Netlify (paling mudah):** buka app.netlify.com → "Add new site" → "Deploy manually" →
seret seluruh folder ini ke halaman itu. Selesai, dapat alamat `xxx.netlify.app`.

**Domain sendiri:** beli domain (mis. `skyveetech.id`), lalu di Netlify pilih
Domain settings → Add custom domain. Arahkan DNS sesuai petunjuk Netlify.

**Hosting cPanel:** upload semua isi folder ke `public_html`.

## Setelah online

1. **Ganti og:image** di `index.html`: cari `content="assets/img/og.jpg"` dan ganti
   dengan `https://domain-anda/assets/img/og.jpg`. Ini yang membuat link tampil
   bergambar saat dibagikan di WhatsApp.
2. Buka halaman di HP dan klik semua tombol WhatsApp untuk memastikan nomornya benar.
3. Daftarkan alamat situs di Google Business Profile (tombol "Situs web").

## Cara mengubah isi

Semua teks ada di `index.html`, ditulis biasa — tidak perlu alat khusus.

| Mau ubah | Cari di `index.html` |
|---|---|
| Nomor WhatsApp | `6285641388709` (muncul di banyak tombol — ganti semua) |
| Nomor telepon | `+6285641388709` dan `0856-4138-8709` |
| Email | `greshyafharel@gmail.com` |
| Instagram | `instagram.com/skyvee_tech` |
| Alamat | `Griya Kajen Indah` |
| Ulasan | `review-card` (nama, bintang, teks) |
| Rating & jumlah ulasan | cari `4,9` dan `11 ulasan` (ubah juga di blok `application/ld+json`) |
| Foto | ganti file di `assets/img/`, jaga nama file agar tidak perlu ubah kode |
| Artikel | `artikel/*.html` — judul, isi, dan tanggal ada di masing-masing file |
| Kartu kontak (.vcf) | `assets/skyvee-tech.vcf` |
| QR WhatsApp | `assets/img/qr-whatsapp.svg` — buat ulang jika nomor WhatsApp berubah |

Setelah mengubah rating atau jumlah ulasan, samakan di tiga tempat: hero, bagian
ulasan, dan JSON-LD di `<head>`.

## Catatan

- **Ulasan adalah salinan** dari profil Google per Oktober 2026 (Google hanya
  menampilkan 5 dari 11 ulasan di panel listing). Perbarui beberapa bulan sekali.
  Kalau ulasan sudah puluhan, pertimbangkan Google Places API (maksimal 5 ulasan,
  butuh API key dan proxy).
- **Peta** memakai embed gratis tanpa API key.
- **Foto** berasal dari profil Google bisnis. Ganti dengan foto sendiri bila ada.
- **Tanpa form kontak** — semua diarahkan ke WhatsApp supaya balasan lebih cepat.
- **Cek gejala** hanya menyusun pesan WhatsApp di browser pengunjung; tidak ada data
  yang dikirim ke server atau disimpan.
- **QR WhatsApp** mengarah ke `wa.me/6285641388709`. Kalau nomor berubah, buat ulang
  file QR-nya (bisa lewat generator QR apa pun) agar tetap berfungsi.
- **Tiga artikel** ada di folder `artikel/`. Perbarui jika ada perubahan layanan,
  harga, atau jam buka yang disebut di dalamnya.
- **GitHub** ditautkan di footer dan blok kontak: `github.com/Skyvee-Tech`.
- **Mode gelap** mengikuti pengaturan HP/komputer saat pertama dibuka. Tombol bulan/matahari
  di header menyimpan pilihan pengunjung di perangkatnya. Logo header otomatis memakai
  `assets/img/logo-mark-dark.webp` (latar transparan) saat mode gelap.
- Ukuran halaman ±270 KB (di luar font). Semua gambar sudah WebP.
