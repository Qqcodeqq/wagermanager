const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"approveEmergencyWithdrawal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimJudgeFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_judge","type":"address"},{"internalType":"uint256","name":"_wagerAmount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"emergencyWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"emergencyWithdrawalApproved","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"finalOutcome","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"participant","type":"address"}],"name":"isDeposited","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"judge","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"outcome","type":"uint256"}],"name":"judgeDecision","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"judgeFeeClaimed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"outcomes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"participant1","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"participant1Deposited","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"participant2","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"participant2Deposited","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"resetContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"outcome","type":"uint256"}],"name":"submitOutcome","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"wagerAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]; // Replace <ABI_JSON> with the ABI you provided
const contractAddress = '0x3e06f9518A446a127A5bB72011C4EDFF268F13b4'; // Replace with your contract address
const providerUrl = 'https://nova.arbitrum.io/rpc';

let web3 = new Web3(providerUrl);
let contractInstance = new web3.eth.Contract(contractABI, contractAddress);

document.getElementById('connectBtn').addEventListener('click', connectWallet);

async function connectWallet() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const userAddress = accounts[0];
      document.getElementById('userAddress').innerText = `Connected: ${userAddress}`;
      document.getElementById('userAddress').style.display = 'block';

      web3 = new Web3(window.ethereum);
      contractInstance = new web3.eth.Contract(contractABI, contractAddress);

      document.getElementById('depositBtn').addEventListener('click', deposit);
      document.getElementById('depositBtn').disabled = false;

      updateInfo();
    } catch (error) {
      console.error('User rejected connection:', error);
    }
  } else {
    alert('Metamask not found. Please install Metamask extension.');
  }
}

async function deposit() {
  const judgeAddress = document.getElementById('judgeAddress').value;
  const wagerAmount = document.getElementById('wagerAmount').value;
  const userAddress = document.getElementById('userAddress').innerText.replace('Connected: ', '');

  if (web3.utils.isAddress(judgeAddress)) {
    try {
      await contractInstance.methods.deposit(judgeAddress, web3.utils.toWei(wagerAmount, 'ether')).send({ from: userAddress, value: web3.utils.toWei(wagerAmount, 'ether') });
      updateInfo();
    } catch (error) {
      console.error('Transaction error:', error);
    }
  } else {
    alert('Please enter a valid judge address.');
  }
}

async function updateInfo() {
  const participant1Address = await contractInstance.methods.participant1().call();
  const participant2Address = await contractInstance.methods.participant2().call();
  const judgeAddress = await contractInstance.methods.judge().call();
  const wagerAmountInWei = await contractInstance.methods.wagerAmount().call();
  
  const participant1Elem = document.getElementById('participant1');
  const participant2Elem = document.getElementById('participant2');
  const judgeElem = document.getElementById('judge');
  const wagerAmountDisplay = document.getElementById('wagerAmountDisplay');

  const emptyAddress = '0x0000000000000000000000000000000000000000';

  participant1Elem.innerText = participant1Address === emptyAddress ? 'No participant yet, you can deposit!' : participant1Address;
  participant2Elem.innerText = participant2Address === emptyAddress ? 'No participant yet, you can deposit!' : participant2Address;
  judgeElem.innerText = judgeAddress;

  const wagerAmountInEther = web3.utils.fromWei(wagerAmountInWei, 'ether');
  wagerAmountDisplay.innerText = wagerAmountInEther;
}



