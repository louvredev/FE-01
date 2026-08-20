# [CLAUDE.md](http://CLAUDE.md)

Dokumen ini memberi konteks kepada AI assistant (Claude Code) tentang proyek ini, stack yang dipakai, dan konvensi yang harus diikuti.

## Tentang Proyek

Webapp monitoring sensor cahaya. Menampilkan data intensitas cahaya secara real-time dari sensor (hardware atau simulasi), dengan grafik histori dan alert sederhana.

## Stack

- **Frontend:** (contoh: React + Vite + Tailwind CSS)
- **Backend:** (contoh: Node.js + Express, atau serverless function)
- **Database:** (contoh: SQLite untuk lokal, atau Firebase Realtime Database)
- **Sensor/Hardware:** (contoh: ESP32 dengan sensor BH1750, kirim data via HTTP POST atau MQTT)
- **Bahasa:** JavaScript/TypeScript



## Konvensi Kode

- Gunakan **camelCase** untuk nama variabel dan fungsi, **PascalCase** untuk nama komponen React.
- Setiap komponen frontend diletakkan di `src/components/`, satu file per komponen.
- Logika pengambilan/pengiriman data sensor diletakkan di `src/services/`, jangan dicampur langsung di komponen UI.
- Gunakan `async/await`, hindari `.then()` chaining kecuali diperlukan.
- Tambahkan komentar singkat untuk logika yang tidak trivial (misal kalkulasi threshold alert).



## Konvensi Commit

Proyek ini mengikuti [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

- `feat:` fitur baru
- `fix:` perbaikan bug
- `docs:` perubahan dokumentasi (README, [CLAUDE.md](http://CLAUDE.md), dll)
- `chore:` perubahan konfigurasi/tooling, tidak mengubah logika aplikasi
- `refactor:` perubahan struktur kode tanpa mengubah perilaku

Contoh: `feat: add real-time chart for light sensor data`

## Struktur Folder

```
├── src/
│   ├── components/     # komponen UI
│   ├── services/        # koneksi ke sensor/API
│   └── pages/            # halaman dashboard
├── server/               # backend/API (jika ada)

```



## Aturan Project (dipelajari dari perbandingan prompt vague vs presisi)

- **Input numerik pada form wajib pakai react-hook-form + zod, dan tidak boleh menyimpan value kosong/null.** Kalau user mengosongkan field, tampilkan pesan error wajib diisi (atau default eksplisit ke 0) — jangan biarkan state menerima `undefined`/`null` begitu saja.
- **Setiap pasangan input min/max (misal ambang bawah & ambang atas) wajib divalidasi silang secara eksplisit dan dites** (min tidak boleh lebih besar dari max). Jangan asumsikan AI otomatis menangani ini tanpa diminta — pada prompt vague, validasi silang ini hilang total.
- **Setiap field form yang berhubungan dengan pengaturan/threshold wajib punya help text yang menjelaskan konteks nyata untuk pengguna awam**, bukan cuma label singkat seperti "Ambang bawah (lux)". Label saja terbukti tidak cukup jelas bagi pengguna yang tidak familiar dengan istilah sensor cahaya.



## Hal yang Perlu Diperhatikan AI Assistant

- Prioritaskan kode yang sederhana dan mudah dibaca, karena proyek ini untuk pembelajaran.
- Saat menambahkan dependency baru, jelaskan alasannya secara singkat.
- Jangan hardcode API key atau kredensial sensor di source code — gunakan environment variable (`.env`), dan pastikan `.env` ada di `.gitignore`.
- Saat diminta mengkritik README atau dokumentasi lain, berikan feedback yang konkret dan terapkan satu perbaikan nyata, bukan sekadar saran umum.

