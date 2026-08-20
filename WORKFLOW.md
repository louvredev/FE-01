# [WORKFLOW.md](http://WORKFLOW.md)

Perbandingan dua pendekatan membangun fitur yang sama — **form pengaturan threshold sensor cahaya** — menggunakan prompt vague vs prompt presisi dengan AI coding assistant (Cursor Agent).

## Setup Eksperimen

- **Round 1 (**`round-1-vague`**):** satu kalimat prompt tanpa detail: "Buatkan form pengaturan threshold sensor cahaya." Diterima apa adanya tanpa revisi.
- **Round 2 (**`round-2-precise`**):** prompt lengkap dengan referensi komponen, constraint validasi (react-hook-form + zod, rentang 0-100000 lux, ambang bawah < ambang atas), permintaan help text untuk pengguna awam, dan instruksi eksplisit untuk menulis serta menjalankan unit test sebagai verifikasi. Dikerjakan di sesi chat baru dan branch terpisah dari `main`, supaya tidak membawa konteks dari round 1.



## Correctness

Round 1 punya bug fungsional: input angka bisa dikosongkan dan tersimpan sebagai `null`, alih-alih tervalidasi atau default ke 0. Tidak ada pengecekan apakah ambang bawah lebih kecil dari ambang atas — form akan menerima kombinasi nilai yang secara logis tidak masuk akal (misal ambang bawah 800, ambang atas 50).

Round 2 menangani kedua kasus ini secara eksplisit: input kosong memunculkan pesan error "Nilai threshold wajib diisi," dan saat ambang bawah diisi lebih besar dari ambang atas, form menampilkan pesan error alih-alih menyimpan nilai yang salah. Ini langsung terlihat dari validasi yang dijalankan AI saat testing manual.

## Accessibility & Kejelasan untuk Pengguna

Round 1 hanya punya label singkat ("Ambang bawah (lux)", "Ambang atas (lux)") tanpa penjelasan apa artinya untuk pengguna awam. Round 2 menambahkan help text di bawah tiap input yang menjelaskan konteks nyata (misal ambang bawah terkait kondisi ruangan gelap/malam hari), plus indikator visual gradient (Gelap → Zona aman → Terang) yang membuat hubungan antara dua angka jadi lebih intuitif dibanding sekadar dua kotak angka terpisah.

## Edge Cases

Round 1 tidak menangani: input kosong, ambang bawah > ambang atas, dan nilai di luar rentang wajar. Round 2 menangani ketiganya lewat validasi zod dan diverifikasi lewat unit test yang ditulis dan dijalankan AI sendiri sebagai bagian dari prompt.

**Kesalahan AI yang tertangkap:** Saat pertama kali menjalankan test, kasus ambang bawah > ambang atas awalnya gagal karena AI menaruh validasi silang di field yang salah (hanya divalidasi di ambang atas, bukan dua arah). AI memperbaikinya setelah saya minta jalankan ulang test.

## Review Effort

Round 1 terasa cepat di awal (prompt satu kalimat, output langsung jadi), tapi meninggalkan tiga masalah yang baru ketahuan setelah dicoba manual: null pada input kosong, tidak ada validasi silang, dan UI yang membosankan tanpa instruksi jelas — ini butuh waktu tambahan untuk diidentifikasi dan akan butuh sesi perbaikan terpisah kalau mau dipakai produksi.

Round 2 terasa lebih lambat di awal karena menyusun prompt yang detail dan menunggu AI menulis + menjalankan test, tapi hasilnya nyaris tidak butuh revisi manual — validasi, help text, dan UI sudah benar sejak commit pertama. Total waktu round 2 (termasuk menyusun prompt) terasa lebih lama, tapi total waktu-ke-fitur-yang-benar-benar-siap justru lebih singkat dibanding round 1 ditambah waktu perbaikan yang pasti diperlukan.

## Kesimpulan

Prompt vague menghasilkan sesuatu yang terlihat selesai tapi menyembunyikan bug dan celah UX yang baru muncul saat dicoba manual. Prompt presisi dengan constraint eksplisit dan verification step (test) menghasilkan fitur yang lebih lengkap sejak awal, dengan trade-off waktu penyusunan prompt yang lebih lama di depan.