import { VolcanoCoin__factory, VolcanoNFT__factory } from "@hardhat-starter/contract-types";
import { ConnectKitButton } from "connectkit";
import { parseEther } from "ethers/lib/utils";
import { useAccount, useContractRead, useDisconnect, useEnsName, useSigner } from "wagmi";
import styled from "@emotion/styled";
import { useState } from "react";

const Container = styled.main`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  & > h1 {
    margin: 12px;
    line-height: 1;
  }
  & > section {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Button = styled.button`
  border-radius: 8px;
  background-color: #222;
  color: #f0f0f0;
  border: none;
  padding: 8px;
  font-weight: bold;
  font-size: 1.2em;
  cursor: pointer;
  margin-bottom: 4px;

  &[disabled] {
    background-color: #aaa;
  }
`;

const AddressDisplay = styled.div`
  border-radius: 12px;
  border: 2px solid #aaa;
  color: #aaa;
  text-align: center;
  margin-bottom: 12px;
  padding: 0 12px;
  & > * {
    margin: 8px 0;
  }
  & > :first-child {
    font-size: 0.8em;
  }
  & > :nth-child(2) {
    font-size: 1.2em;
  }
`;

const MainUi = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const nftContractAddress = "0x610aC004B46e60c6f9D29DED3836c977F6b891cb";
const coinContractAddress = "0x35f3dE7dd7C9F8b0185fCBf7F1C4c2C145d494D9";

export const Mint = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect({});
  const { data: ensName } = useEnsName({
    address,
  });

  const {
    data: signer,
  } = useSigner();
  const NftContract = new VolcanoNFT__factory(signer || undefined);
  const nftContract = NftContract.attach(nftContractAddress);
  const CoinContract = new VolcanoCoin__factory(signer || undefined);
  const coinContract = CoinContract.attach(coinContractAddress);

  const [mintWithEthStatus, setMintWithEthStatus] = useState<"idle" | "loading" | "started">("idle");
  const doMintWithEth = async () => {
    setMintWithEthStatus("loading");
    const tx = await nftContract.mint({
      value: parseEther("0.001"),
    });
    setMintWithEthStatus("started");
    await tx.wait();
    setMintWithEthStatus("idle");
  };

  const [mintWithCoinStatus, setMintWithCoinStatus] = useState<"idle" | "loadingApprove" | "startedApprove" | "loadingMint" | "startedMint">("idle");
  const doMintWithLavaCoin = async () => {
    setMintWithCoinStatus("loadingApprove");
    const approveTx = await coinContract.approve(
      nftContract.address,
      parseEther("1"),
    );
    setMintWithCoinStatus("startedApprove");
    await approveTx.wait();
    setMintWithCoinStatus("loadingMint");
    const mintTx = await nftContract.mint();
    setMintWithCoinStatus("startedMint");
    await mintTx.wait();
    setMintWithCoinStatus("idle");
  };

  // Number of tokens owned request
  const { data: numberOfTokensOwned } = useContractRead({
    address: nftContractAddress,
    abi: VolcanoNFT__factory.abi,
    functionName: "balanceOf",
    args: address && [address],
    watch: true,
  });

  const renderUi = () => {
    if (!isConnected) {
      return (
        <ConnectKitButton.Custom>
          {({ show }) => {
            return (
              <Button onClick={show}>
                Connect Wallet!
              </Button>
            );
          }}
        </ConnectKitButton.Custom>
      );
    }

    return (
      <MainUi>
        <AddressDisplay>
          <p>You are logged in as</p>
          <p>{ensName ?? address}</p>
        </AddressDisplay>
        <p>
          You currently have {numberOfTokensOwned?.toString()} Volcano NFTs
        </p>
        <Button
          disabled={mintWithEthStatus !== "idle"}
          type="button"
          onClick={doMintWithEth}
        >
          {
            mintWithEthStatus === "idle" ? "Mint with ETH!" :
              mintWithEthStatus === "loading" ? "Waiting for approval" :
                "Minting..."
          }
        </Button>
        <Button
          disabled={mintWithCoinStatus !== "idle"}
          type="button"
          onClick={doMintWithLavaCoin}
        >
          {
            mintWithCoinStatus === "idle" ? "Mint with LAVACOIN!" :
              mintWithCoinStatus === "loadingApprove" ? "Waiting for approval" :
                mintWithCoinStatus === "startedApprove" ? "Approving coin..." :
                  mintWithCoinStatus === "loadingMint" ? "Waiting for approval" :
                    "Minting..."
          }
        </Button>
        <Button type="button" onClick={() => disconnect()}>Disconnect Wallet</Button>
      </MainUi>
    );
  };

  return (
    <Container>
      <h1>Volcano NFT Mint ❤️‍🔥</h1>
      <section>
        {renderUi()}
      </section>
    </Container>
  );
};