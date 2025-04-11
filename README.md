# SEISMIC - ERC20 Deployer & Burner CLI

SEISMIC adalah CLI sederhana berbasis Node.js yang memungkinkan kamu untuk **deploy**, **burn**, dan **kelola** kontrak token ERC20 secara cepat di jaringan EVM seperti Seismic, dengan dukungan fitur massal dan penyimpanan otomatis ke file.

## Fitur Utama

- [x] Deploy token ERC20 dengan input manual
- [x] Deploy massal token dengan nama/simbol acak
- [x] Burn token dari kontrak tertentu
- [x] Burn massal semua kontrak tersimpan
- [x] Penyimpanan otomatis ke `deployed_contracts.json`
- [x] UI CLI dengan warna dan banner

## Instalasi

```bash
# 1. Clone repositori
git clone https://github.com/username/seismic.git
cd seismic

# 2. Install dependencies
npm install
```

## Konfigurasi .env

Buat file `.env` di root project:

```bash
PRIVATE_KEY=0xPRIVATEKEY_ANDA
```

Gantilah `0xPRIVATEKEY_ANDA` dengan private key dompet yang ingin kamu gunakan (harus memiliki cukup gas fee).

## Menjalankan Script

```bash
node deploy.js
```

## Menu Utama

```
Pilih menu:
1. Deploy ERC20
2. Deploy Massal
3. Burn Token
4. Burn Massal
0. Keluar
```

### Penjelasan Menu:

- **Deploy ERC20**  
  Input nama, simbol token. Jumlah supply default 1.000.000 token.

- **Deploy Massal**  
  Masukkan jumlah kontrak yang ingin dibuat (maks 1000). Nama dan simbol diacak otomatis, supply tetap 1.000.000.

- **Burn Token**  
  Pilih kontrak dari daftar dan bakar 9.999 token. Token tersisa ditampilkan setelah proses.

- **Burn Massal**  
  Semua kontrak dalam `deployed_contracts.json` akan dibakar sebanyak 9.999 token per kontrak.

## Output Tersimpan

Setiap kontrak yang berhasil dideploy disimpan dalam file:

```
deployed_contracts.json
```

Formatnya:
```json
[
  {
    "address": "0x...",
    "tx": "0x..."
  }
]
```

## Catatan

- Pastikan jaringan RPC yang digunakan (`https://node-2.seismicdev.net/rpc`) aktif.
- Tool ini cocok untuk pengujian smart contract di testnet EVM.
- Jangan gunakan private key utama Anda untuk produksi.

---

**Owner**: [@didinska](https://t.me/didinska)  
Lisensi: MIT
