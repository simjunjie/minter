import { useEffect, useState } from "react";
import {
	connectWallet,
	getCurrentWalletConnected,
	publicMint,
} from "./interact.js";

require("dotenv").config();
const contractAddress = process.env.CONTRACT_ADDRESS;

const Minter = (props) => {
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");

  const [mintAmount, setMintAmount] = useState("");

  useEffect(async () => {
    const { address, status } = await getCurrentWalletConnected();

    setWallet(address);
    setStatus(status);

    addWalletListener();
  }, []);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onMintPressed = async () => {
    const { success, status } = await publicMint(mintAmount);
    setStatus(status);
    if (success) {
      setMintAmount("");
    }
  };

  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <br></br>
      <div className="app">
        {"Contract address: "}  + <p>{process.env.CONTRACT_ADDRESS}</p>
      </div>
      {"Contract address: "} <p>{contractAddress}</p>

      <h1 id="title">The Leading Crew NFT Minter</h1>
      <p>Enter the amount of NFTs you wish to mint and press "Mint"</p>
      <form>
        <input
          type="text"
          placeholder="Quantity: (1 to 6 max)"
          onChange={(event) => setMintAmount(event.target.value)}
        />
      </form>
      <button id="mintButton" onClick={onMintPressed}>
        Mint
      </button>
      <p id="status" style={{ color: "red" }}>
        {status}
      </p>
    </div>
  );
};

export default Minter;
