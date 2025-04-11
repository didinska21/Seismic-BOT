SEISMIC CLI

SEISMIC adalah tool berbasis CLI (Command Line Interface) untuk melakukan deploy token ERC20 burnable, burn token, dan burn massal di jaringan EVM (contoh: Seismic Network). Dibangun dengan Node.js dan menggunakan Ethers.js.


---

Fitur

Deploy token ERC20 dengan fitur burn

Deploy massal token dengan nama & simbol acak

Burn token dari kontrak yang sudah dideploy

Burn massal ke semua kontrak yang tersimpan

Tampilan CLI estetik dengan banner, warna, dan layout rapi



---

Instalasi

git clone https://github.com/username/seismic-cli.git
cd seismic-cli
npm install


---

Konfigurasi

Buat file .env di root folder:

PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE

Ganti 0xYOUR_PRIVATE_KEY_HERE dengan private key wallet kamu.


---

Penggunaan

node deploy.js

Menu:

1. Deploy ERC20
2. Deploy Massal
3. Burn Token
4. Burn Massal
0. Keluar


---

Output

Semua kontrak yang dideploy akan disimpan otomatis ke file deployed_contracts.json

Token burn akan dicatat lengkap dengan hash dan address



---

Struktur Folder

SEISMIC/
├── deploy.js
├── generateContractCode.js
├── deployed_contracts.json
├── .env
├── .gitignore
├── README.md
├── package.json
└── package-lock.json


---

License

MIT © 2025 - @didinska

