import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractAbi, contractAddress } from './Constant/constant';
import Login from './Components/Login';
import Finished from './Components/Finished';
import Connected from './Components/Connected';
import './App.css';

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [votingStatus, setVotingStatus] = useState(true);
  const [remainingTime, setRemainingTime] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [number, setNumber] = useState('');
  const [canVote, setCanVote] = useState(true);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    }
  }, []);

  async function createProvider() {
    if (!provider) {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);
    }
  }

  async function getSigner() {
    await createProvider();
    return provider.getSigner();
  }

  async function getContractInstance() {
    const signer = await getSigner();
    return new ethers.Contract(contractAddress, contractAbi, signer);
  }

  async function vote() {
    const contractInstance = await getContractInstance();
    const tx = await contractInstance.vote(number);
    await tx.wait();
    await canVoteFunction();
  }

  async function canVoteFunction() {
    const contractInstance = await getContractInstance();
    const voteStatus = await contractInstance.voters(await getSigner().getAddress());
    setCanVote(voteStatus);
  }

  async function getCandidatesList() {
    const contractInstance = await getContractInstance();
    const candidatesList = await contractInstance.getAllVotesOfCandiates();
    const formattedCandidates = candidatesList.map((candidate, index) => {
      return {
        index: index,
        name: candidate.name,
        voteCount: candidate.voteCount.toNumber()
      }
    });
    setCandidates(formattedCandidates);
  }

  async function getCurrentStatus() {
    const contractInstance = await getContractInstance();
    const status = await contractInstance.getVotingStatus();
    console.log(status);
    setVotingStatus(status);
  }

  async function getRemainingTimeFunction() {
    const contractInstance = await getContractInstance();
    const time = await contractInstance.getRemainingTime();
    setRemainingTime(parseInt(time, 16));
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length > 0 && account!== accounts[0]) {
      setAccount(accounts[0]);
      canVoteFunction();
    } else {
      setIsConnected(false);
      setAccount(null);
    }
  }

  async function connectToMetamask() {
    if (window.ethereum) {
      try {
        await createProvider();
        await provider.send("eth_requestAccounts", []);
        const signer = await getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        console.log("Metamask Connected : " + address);
        setIsConnected(true);
        await canVoteFunction();
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("Metamask is not detected in the browser")
    }
  }

  async function handleNumberChange(e) {
    setNumber(e.target.value);
  }

  return (
    <div className="App">
      {votingStatus? (isConnected? (
        <Connected 
          account={account}
          candidates={candidates}
          remainingTime={remainingTime}
          number={number}
          handleNumberChange={handleNumberChange}
          voteFunction={vote}
          showButton={canVote}
        />
      ) : (
        <Login connectWallet={connectToMetamask} />
      )) : (
        <Finished />
      )}
    </div>
  );
}

export default App;