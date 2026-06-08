# Panduan Mengembangkan Mindful Suite Menjadi Aplikasi Desktop (VS Code)

Aplikasi ini dibangun menggunakan **Vite** dan **React**. Untuk mengubahnya menjadi aplikasi desktop stand-alone (tanpa browser), langkah yang paling tepat adalah menggunakan **Electron**.

Berikut adalah panduan langkah demi langkah untuk melanjutkan pengembangan di komputer lokal Anda menggunakan **Visual Studio Code**.

## 1. Unduh Proyek ke PC Lokal
1. Buka menu pengaturan (ikon *Gear* di kanan atas AI Studio).
2. Pilih **Export to ZIP** (atau Export to GitHub jika lebih suka).
3. Ekstrak file ZIP tersebut dan buka foldernya menggunakan **VS Code**.

## 2. Instalasi Dependensi Desktop
Buka terminal terintegrasi di VS Code (`Ctrl` + `~`) lalu jalankan perintah instalasi dependensi utama dan tools Electron:

```bash
# Instal semua dependensi web bawaan
npm install

# Instal dependensi khusus untuk desktop/Electron
npm install --save-dev electron concurrently cross-env wait-on electron-builder
```

## 3. Konfigurasi `package.json`
Buka file `package.json` di proyek Anda dan tambahkan pengaturan berikut:

**A. Tambahkan Entry Point**
Tambahkan properti `"main"` di awal file (sejajar dengan `"name"` dan `"version"`). Ini akan memberitahu Electron file apa yang harus dijalankan pertama kali:
```json
"main": "electron-main.js",
```
*(Catatan: Saya sudah membuatkan file `electron-main.js` di dalam proyek ini untuk Anda).*

**B. Update Scripts**
Ganti bagian `"scripts"` menjadi:
```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "electron:dev": "concurrently -k \"cross-env BROWSER=none npm run dev\" \"wait-on http://127.0.0.1:5173 && electron .\"",
  "electron:build": "npm run build && electron .",
  "electron:dist": "npm run build && electron-builder"
}
```

**C. Konfigurasi Builder (Opsional, untuk membuat .exe / .dmg)**
Tambahkan konfigurasi `build` di bagian bawah `package.json` Anda:
```json
"build": {
  "appId": "com.mindfulsuite.app",
  "productName": "Mindful Suite",
  "directories": {
    "output": "dist-electron"
  },
  "files": [
    "dist/**/*",
    "electron-main.js"
  ],
  "mac": {
    "category": "public.app-category.lifestyle"
  },
  "win": {
    "target": "nsis"
  }
}
```

## 4. Jalankan Aplikasi Desktop

**Mode Development 🛠️**
Jalankan perintah ini di terminal VS Code:
```bash
npm run electron:dev
```
Perintah ini akan menjalankan Vite dev server dan membuka jendela Electron secara otomatis. Jika Anda mengedit file React, tampilan di aplikasi Desktop akan langsung *refresh* secara *real-time*.

**Mode Build Preview 📦**
Untuk menguji versi rilis (menggunakan file statis hasil build):
```bash
npm run electron:build
```

## 5. Build Menjadi Aplikasi Asli (.exe / .dmg / .AppImage)
Ketika Anda sudah selesai mengembangkan fitur dan siap untuk membagikan aplikasi Anda:

```bash
npm run electron:dist
```
Tunggu prosesnya selesai, dan Anda akan menemukan file `.exe` (jika Anda menggunakan Windows) atau `.dmg` (jika Anda menggunakan macOS) di dalam folder `dist-electron/` baru.
