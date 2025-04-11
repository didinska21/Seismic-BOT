# SEISMIC - ERC20 Token Deployment & Burn CLI

**SEISMIC** adalah sebuah project Node.js berbasis CLI (Command Line Interface) yang memungkinkan kamu untuk melakukan:
- Deploy kontrak token ERC20 secara manual atau massal.
- Burn token pada kontrak tertentu.
- Menyimpan riwayat kontrak yang dideploy.
- Tampilan CLI interaktif dan berwarna.

## Fitur
- [x] Deploy ERC20 satuan
- [x] Deploy ERC20 massal (nama dan simbol random)
- [x] Burn token (manual dan massal)
- [x] Auto simpan kontrak yang dideploy
- [x] Support custom RPC
- [x] CLI dengan tampilan banner

## Struktur Folder
SEISMIC/
├── deploy.js
├── generateContractCode.js
├── deployed_contracts.json
├── .env
├── .gitignore
├── README.md
├── package.json
└── package-lock.json

# SEISMIC INSTALLATION GUIDE

# 1. Clone Repository
git clone https://github.com/username/seismic.git
cd seismic

# 2. Install Dependencies
npm install

# 3. Setup .env File
echo "PRIVATE_KEY=0xPRIVATEKEYANDA" > .env

# 4. Run Script
node deploy.js

# 5. Menu Navigasi
# Pilih menu berikut saat script berjalan:

# 1. Deploy ERC20
# 2. Deploy Massal
# 3. Burn Token
# 4. Burn Massal
# 0. Keluar

# Setiap kontrak yang berhasil dideploy akan otomatis disimpan di:
# ./deployed_contracts.json
