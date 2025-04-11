require("dotenv").config();
const { ethers } = require("ethers");
const readline = require("readline");
const chalk = require("chalk");
const boxen = require("boxen");
const figlet = require("figlet");
const gradient = require("gradient-string");
const fs = require("fs");
const { generateContractCode } = require("./generateContractCode");

const deployedPath = "./deployed_contracts.json";

function showBanner() {
  console.clear();
  const banner = figlet.textSync("S E I S M I C", { font: "ANSI Shadow" });
  console.log(gradient.pastel.multiline(banner));
  console.log(chalk.gray.bold("owner : t.me/didinska\n"));
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const rpcUrl = "https://node-2.seismicdev.net/rpc";
const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
const privateKey = process.env.PRIVATE_KEY;

if (!privateKey) {
  console.log(chalk.redBright("PRIVATE_KEY tidak ditemukan di file .env"));
  process.exit(1);
}

const wallet = new ethers.Wallet(privateKey, provider);

function simpanKeFile(contractAddress, txHash) {
  const data = fs.existsSync(deployedPath) ? JSON.parse(fs.readFileSync(deployedPath)) : [];
  data.push({ address: contractAddress, tx: txHash });
  fs.writeFileSync(deployedPath, JSON.stringify(data, null, 2));
}

function randomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}

async function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

const minimalERC20ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function burn(uint256 amount) public",
];

async function showMenu() {
  while (true) {
    showBanner();
    console.log(chalk.yellow("Pilih menu:"));
    console.log(chalk.green("1.") + " Deploy ERC20");
    console.log(chalk.green("2.") + " Deploy Massal");
    console.log(chalk.green("3.") + " Burn Token");
    console.log(chalk.green("4.") + " Burn Massal");
    console.log(chalk.red("0.") + " Keluar");

    const choice = await askQuestion(chalk.cyan("\nMasukkan pilihan (1 / 2 / 3 / 4 / 0): "));

    if (choice === "1") {
      const name = await askQuestion(chalk.cyan("Nama Token: "));
      const symbol = await askQuestion(chalk.cyan("Symbol Token: "));
      const supply = "1000000";
      console.log(chalk.gray("Supply default digunakan: 1000000"));
      const { abi, bytecode } = generateContractCode(name, symbol, supply);
      const factory = new ethers.ContractFactory(abi, bytecode.object, wallet);
      const contract = await factory.deploy();
      await contract.deployed();
      simpanKeFile(contract.address, contract.deployTransaction.hash);

      const msg = `
${chalk.greenBright.bold("✓ DEPLOY SUKSES")}
Nama Token      : ${name} (${symbol})
Supply Token    : ${supply}
Alamat Kontrak  : ${contract.address}
TX Hash         : ${contract.deployTransaction.hash}`;
      console.log(boxen(msg, { padding: 1, borderStyle: "round", borderColor: "green" }));

    } else if (choice === "2") {
      const jumlah = parseInt(await askQuestion(chalk.cyan("Jumlah kontrak (1-1000): ")));
      if (isNaN(jumlah) || jumlah < 1 || jumlah > 1000) {
        console.log(chalk.red("Jumlah tidak valid."));
        continue;
      }
      for (let i = 1; i <= jumlah; i++) {
        const name = "RND" + randomString(5);
        const symbol = "S" + randomString(3);
        const supply = "1000000";
        console.log(chalk.gray(`[${i}/${jumlah}] Deploy ${name} (${symbol})...`));

        const { abi, bytecode } = generateContractCode(name, symbol, supply);
        const factory = new ethers.ContractFactory(abi, bytecode.object, wallet);
        const contract = await factory.deploy();
        await contract.deployed();
        simpanKeFile(contract.address, contract.deployTransaction.hash);
        console.log(chalk.green(`[✓] ${name} (${symbol}) => ${contract.address} | TX: ${contract.deployTransaction.hash}`));
      }

    } else if (choice === "3") {
      if (!fs.existsSync(deployedPath)) {
        console.log(chalk.red("Belum ada kontrak yang dideploy."));
        continue;
      }
      const contracts = JSON.parse(fs.readFileSync(deployedPath));
      if (contracts.length === 0) {
        console.log(chalk.red("Data kosong di deployed_contracts.json."));
        continue;
      }

      console.log(chalk.cyan("\nDaftar Kontrak Tersimpan:"));
      contracts.forEach((c, i) => console.log(`${i + 1}. ${c.address}`));

      const idx = parseInt(await askQuestion(chalk.cyan("\nPilih nomor kontrak yang ingin di-burn: ")));
      if (isNaN(idx) || idx < 1 || idx > contracts.length) {
        console.log(chalk.red("Pilihan tidak valid."));
        continue;
      }

      const selected = contracts[idx - 1];
      const contract = new ethers.Contract(selected.address, minimalERC20ABI, wallet);
      const name = await contract.name();
      const symbol = await contract.symbol();

      const burnAmount = ethers.utils.parseUnits("9999", 18);
      const tx = await contract.burn(burnAmount);
      await tx.wait();

      const balance = await contract.balanceOf(wallet.address);
      const msg = `
${chalk.redBright.bold("✓ TOKEN BERHASIL DI-BURN")}
Token           : ${name} (${symbol})
Amount Burned   : ${ethers.utils.formatUnits(burnAmount, 18)} ${symbol}
Sisa Token Anda : ${ethers.utils.formatUnits(balance, 18)} ${symbol}
Contract Address: ${selected.address}
TX Hash         : ${tx.hash}`;
      console.log(boxen(msg, { padding: 1, borderStyle: "round", borderColor: "red" }));

    } else if (choice === "4") {
      if (!fs.existsSync(deployedPath)) {
        console.log(chalk.red("Belum ada kontrak yang dideploy."));
        continue;
      }
      const contracts = JSON.parse(fs.readFileSync(deployedPath));
      if (contracts.length === 0) {
        console.log(chalk.red("Data kosong di deployed_contracts.json."));
        continue;
      }

      const burnAmount = ethers.utils.parseUnits("9999", 18);

      for (const c of contracts) {
        try {
          const contract = new ethers.Contract(c.address, minimalERC20ABI, wallet);
          const name = await contract.name();
          const symbol = await contract.symbol();
          console.log(chalk.gray(`Burning ${name} (${symbol})...`));
          const tx = await contract.burn(burnAmount);
          await tx.wait();
          console.log(chalk.red(`[✓] Burn 9999 ${symbol} | TX: ${tx.hash}`));
        } catch (err) {
          console.log(chalk.red(`[GAGAL] ${c.address} - ${err.message}`));
        }
      }

    } else if (choice === "0") {
      console.log(chalk.greenBright("Keluar..."));
      rl.close();
      break;

    } else {
      console.log(chalk.red("Pilihan tidak tersedia."));
    }

    await askQuestion(chalk.gray("\nTekan ENTER untuk kembali ke menu..."));
  }
}

showMenu();
