# Light Sensor Monitor

Webapp untuk memantau data sensor cahaya (light sensor) secara real-time. Proyek ini dibuat sebagai capstone track "AI-Assisted Development", dengan Claude Code / Cursor sebagai AI coding assistant sepanjang proses development.

## Fitur

- Menampilkan pembacaan intensitas cahaya (lux) secara real-time
- Grafik histori data sensor dari waktu ke waktu
- Notifikasi/alert ketika nilai cahaya melewati ambang batas tertentu
- Dashboard sederhana yang bisa diakses lewat browser

## Tech Stack

- **Frontend:** (isi sesuai pilihanmu, contoh: React + Vite)
- **Backend:** (contoh: Node.js + Express)
- **Database:** (contoh: SQLite / Firebase / InfluxDB)
- **Hardware:** (contoh: ESP32 / Arduino + sensor LDR atau BH1750)
- **Komunikasi data:** (contoh: MQTT / HTTP REST / WebSocket)

## Cara Menjalankan

```bash
# Clone repo
git clone https://github.com/username/nama-repo.git
cd nama-repo

# Install dependencies
npm install

# Jalankan aplikasi
npm run dev
```

## Struktur Proyek

```
├── src/
│   ├── components/     # komponen UI
│   ├── services/        # koneksi ke sensor/API
│   └── pages/            # halaman dashboard
├── server/               # backend/API (jika ada)
├── CLAUDE.md            # konteks proyek untuk AI assistant
└── README.md
```

## Status Proyek

🚧 Dalam pengembangan sebagai bagian dari capstone project.

## Lisensi

Proyek ini menggunakan [MIT License](./LICENSE).
