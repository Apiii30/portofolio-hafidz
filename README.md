# Hafidz's Room — portfolio

A night-time 3D bedroom you scroll through. The camera drifts from the room, out the window over Bandung, then back to the desk, the bookshelf, the poster, the corkboard and the door.

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # hasil ada di folder dist/
```

## Mengubah isi

Semua teks ada di **`src/data/profile.js`**. Cari tanda `TODO`:

| Yang mau diubah | Caranya |
|---|---|
| Proyek | Edit array `projects`. Screenshot bisa ditaruh di `public/projects/` |
| Pengalaman | Isi `period` dan `points` di `experience` |
| Karya desain | Taruh gambar di `public/works/`, lalu isi array `works`. Section Design dan menunya di nav otomatis muncul begitu array ini terisi |
| Sertifikat | Taruh gambar di `public/certificates/`, lalu tambahkan `certificate` di item `experience` yang sesuai. Otomatis muncul sebagai kartu di Experience dan sebagai bingkai di dinding kamar 3D |
| CV | Timpa `public/Hafidz-Asmar-Meisanda-CV.pdf` dengan versi baru (nama file sama) |
| Skill baru | Tambahkan ke `skillGroups`. Untuk rak 3D: buku ke `bookshelfRows`, bahasa lain ke `shelfLanguages` (jadi pajangan), tools ke `toolbox` (jadi stiker di kotak perkakas) |

## Struktur

```
src/
  data/profile.js       ← semua konten
  three/                ← kamar 3D (React Three Fiber)
    Room.jsx            ← semua objek di kamar
    CameraRig.jsx       ← posisi kamera per section (SHOTS)
    textures.js         ← gambar yang dilukis lewat kode (layar monitor, jendela, poster)
  sections/             ← section HTML di atas kamar
    BandungSkyline.jsx  ← lapisan parallax Bandung (SVG)
  components/           ← nav, loader, doodle
```

## Mode siang / malam

Default-nya malam. Pengunjung bisa ganti lewat saklar di nav atau dengan mengklik gorden di kamar 3D. Pilihannya disimpan di `localStorage`.

- **Warna UI** ada di [src/index.css](src/index.css). Pakai token semantik (`page`, `fg`, `surface`, `accent`, `accent-2`, `accent-3`, `on-accent`, `shadow`) supaya ikut berganti otomatis. Palet tetap (`lamp`, `rose`, `cream`, `paper`, `sky`) hanya untuk benda fisik, seperti kertas polaroid, yang warnanya sama siang dan malam.
- **Parallax Bandung** memakai variabel `--bdg-*` di file yang sama. Elemen dengan class `night-only` (bintang, lampu kota) otomatis hilang di siang hari.
- **Kamar 3D** membaca `themeMix.value` (0 = malam, 1 = siang) dari [src/three/themeMix.js](src/three/themeMix.js). Pencahayaan ada di `LIGHTING` di [src/three/Scene.jsx](src/three/Scene.jsx).

Setiap section punya atribut `data-cam="..."`. Saat section itu berada di tengah layar, kamera bergerak ke shot dengan nama yang sama di `SHOTS` (`CameraRig.jsx`).

## Deploy

Push ke GitHub → import di [vercel.com](https://vercel.com) → Framework: **Vite** → Deploy.
