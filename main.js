document.addEventListener('DOMContentLoaded', async () => {
  if (typeof window.ethereum === 'undefined') {
    alert('Please install MetaMask or another Ethereum wallet provider to interact with this page.');
    return;
  }

  const web3 = new Web3(window.ethereum);
  const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"approveEmergencyWithdrawal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimJudgeFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_judge","type":"address"},{"internalType":"uint256","name":"_wagerAmount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"emergencyWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"emergencyWithdrawalApproved","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"finalOutcome","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"participant","type":"address"}],"name":"isDeposited","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"judge","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"outcome","type":"uint256"}],"name":"judgeDecision","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"judgeFeeClaimed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"outcomes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"participant1","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"participant1Deposited","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"participant2","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"participant2Deposited","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"resetContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"outcome","type":"uint256"}],"name":"submitOutcome","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"wagerAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]; // Replace <ABI_JSON> with the ABI you provided
  const contractAddress = '0x3e06f9518A446a127A5bB72011C4EDFF268F13b4'; // Replace with your contract address
  const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

  const userAddress = document.getElementById('userAddress');
  const depositBtn = document.getElementById('depositBtn');

  const connectBtn = document.getElementById('connectBtn');
  connectBtn.onclick = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      userAddress.textContent = `Connected: ${accounts[0]}`;
      userAddress.style.display = 'block';
      depositBtn.disabled = false;
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An error occurred. Please check the console for details.');
    }
  };

  depositBtn.onclick = async () => {
    const judgeAddress = document.getElementById('judgeAddress').value;
    const wagerAmount = document.getElementById('wagerAmount').value;
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const from = accounts[0];
      await contractInstance.methods.deposit(judgeAddress, web3.utils.toWei(wagerAmount, 'ether')).send({ from, value: web3.utils.toWei(wagerAmount, 'ether') });
      alert('Deposit successful!');
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An error occurred. Please check the console for details.');
    }
  };
});
