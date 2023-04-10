// main.js

const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"approveEmergencyWithdrawal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimJudgeFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_judge","type":"address"},{"internalType":"uint256","name":"_wagerAmount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"emergencyWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"emergencyWithdrawalApproved","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"finalOutcome","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"participant","type":"address"}],"name":"isDeposited","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"judge","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"outcome","type":"uint256"}],"name":"judgeDecision","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"judgeFeeClaimed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"outcomes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"participant1","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"participant1Deposited","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"participant2","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"participant2Deposited","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"resetContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"outcome","type":"uint256"}],"name":"submitOutcome","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"wagerAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]; // Replace <ABI_JSON> with the ABI you provided
const contractAddress = '0x3e06f9518A446a127A5bB72011C4EDFF268F13b4'; // Replace with your contract address
const providerUrl = 'https://nova.arbitrum.io/rpc';

const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
let contract;
let userAddress;

async function connectWallet() {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      userAddress = accounts[0];
      document.getElementById("userAddress").innerText = "Connected: " + userAddress;
      document.getElementById("userAddress").style.display = "block";
      document.getElementById("connectBtn").style.display = "none";

      // Contract initialization
      const contractAddress = "0xCONTRACT_ADDRESS";
      const contractABI = [...]; // Your contract ABI
      contract = new web3.eth.Contract(contractABI, contractAddress);

      // Enable deposit button
      document.getElementById("depositBtn").disabled = false;

      updateContractInfo();

    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Error connecting wallet. Check the console for more details.");
    }
  } else {
    alert("No Ethereum browser extension detected. Please install MetaMask.");
  }
}

async function deposit() {
  const judgeAddress = document.getElementById("judgeAddress").value;
  const wagerAmount = document.getElementById("wagerAmount").value;
  const wagerAmountInWei = web3.utils.toWei(wagerAmount, "ether");

  try {
    await contract.methods.deposit(judgeAddress, wagerAmountInWei).send({ from: userAddress, value: wagerAmountInWei });
    alert("Deposit successful!");
    updateContractInfo();
  } catch (error) {
    console.error("An error occurred while depositing:", error);
    alert("An error occurred while depositing. Check the console for more details.");
  }
}

async function updateContractInfo() {
  const owner = await contract.methods.owner().call();
  const judge = await contract.methods.judge().call();
  const participant1 = await contract.methods.participant1().call();
  const participant2 = await contract.methods.participant2().call();
  const wagerAmount = await contract.methods.wagerAmount().call();
  const wagerAmountInEther = web3.utils.fromWei(wagerAmount, "ether");

  const participant1Text = participant1 === "0x0000000000000000000000000000000000000000" ? "No participant yet, you can deposit!" : participant1;
  const participant2Text = participant2 === "0x0000000000000000000000000000000000000000" ? "No participant yet, you can deposit!" : participant2;

  document.getElementById("contract-info").innerHTML = `
    <p>Owner: ${owner}</p>
    <p>Judge: ${judge}</p>
    <p>Participant 1: ${participant1Text}</p>
    <p>Participant 2: ${participant2Text}</p>
    <p>Wager Amount: ${wagerAmountInEther} ETH</p>
  `;
}

document.getElementById("connectBtn").addEventListener("click", connectWallet);
document.getElementById("depositBtn").addEventListener("click", deposit);
document.getElementById("claimBtn").addEventListener("click", claim);

document.getElementById("participant1WinBtn").addEventListener("click", () => submitOutcome(1));
document.getElementById("participant1LoseBtn").addEventListener("click", () => submitOutcome(2));

document.getElementById("participant2WinBtn").addEventListener("click", () => submitOutcome(2));

async function claim() {
  try {
    await contract.methods.claim().send({ from: userAddress });
    alert("Claim successful!");
    updateContractInfo();
  } catch (error) {
    console.error("An error occurred while claiming:", error);
    alert("An error occurred while claiming. Check the console for more details.");
  }
}

async function submitOutcome(outcome) {
  try {
    await contract.methods.submitOutcome(outcome).send({ from: userAddress });
    alert("Outcome submitted successfully!");
    updateContractInfo();
  } catch (error) {
    console.error("An error occurred while submitting outcome:", error);
    alert("An error occurred while submitting outcome. Check the console for more details.");
  }
}

