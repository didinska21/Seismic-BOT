function generateContractCode(name, symbol, supply) {
  const formattedSupply = BigInt(supply) * 10n ** 18n;

  const source = `
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;

  contract ERC20Token {
      string public name = "${name}";
      string public symbol = "${symbol}";
      uint8 public decimals = 18;
      uint256 public totalSupply;

      mapping(address => uint256) public balanceOf;
      mapping(address => mapping(address => uint256)) public allowance;

      event Transfer(address indexed from, address indexed to, uint256 value);
      event Approval(address indexed owner, address indexed spender, uint256 value);

      constructor() {
          totalSupply = ${formattedSupply.toString()};
          balanceOf[msg.sender] = totalSupply;
          emit Transfer(address(0), msg.sender, totalSupply);
      }

      function transfer(address to, uint256 value) public returns (bool) {
          require(balanceOf[msg.sender] >= value, "Insufficient balance");
          balanceOf[msg.sender] -= value;
          balanceOf[to] += value;
          emit Transfer(msg.sender, to, value);
          return true;
      }

      function approve(address spender, uint256 value) public returns (bool) {
          allowance[msg.sender][spender] = value;
          emit Approval(msg.sender, spender, value);
          return true;
      }

      function transferFrom(address from, address to, uint256 value) public returns (bool) {
          require(balanceOf[from] >= value, "Insufficient balance");
          require(allowance[from][msg.sender] >= value, "Allowance exceeded");
          balanceOf[from] -= value;
          allowance[from][msg.sender] -= value;
          balanceOf[to] += value;
          emit Transfer(from, to, value);
          return true;
      }

      function burn(uint256 value) public {
          require(balanceOf[msg.sender] >= value, "Insufficient balance to burn");
          balanceOf[msg.sender] -= value;
          totalSupply -= value;
          emit Transfer(msg.sender, address(0), value);
      }
  }
  `;

  const solc = require("solc");
  const input = {
    language: "Solidity",
    sources: { "ERC20Token.sol": { content: source } },
    settings: { outputSelection: { "*": { "*": ["abi", "evm.bytecode"] } } },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  const contract = output.contracts["ERC20Token.sol"]["ERC20Token"];
  return { abi: contract.abi, bytecode: contract.evm.bytecode };
}

module.exports = { generateContractCode };
