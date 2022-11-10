import { VolcanoCoin, VolcanoCoin__factory, VolcanoNFT, VolcanoNFT__factory } from "@hardhat-starter/contract-types";
import { ConnectKitButton } from "connectkit";
import { parseEther } from "ethers/lib/utils";
import { useAccount, useDisconnect, useEnsName, useSigner, useNetwork, useContractRead } from "wagmi";
import styled from "@emotion/styled";
import { useState } from "react";
import deployments from "~/deployments.json";

function isValidChainId(chainId?: string | number | symbol): chainId is keyof typeof deployments {
  return !!chainId && chainId in deployments;
}

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
  & > :first-of-type {
    font-size: 0.8em;
  }
  & > :nth-of-type(2) {
    font-size: 1.2em;
  }
`;

const MainUi = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Mint = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect({});
  const network = useNetwork();
  const chainId = network.chain?.id.toString();
  const chainName = network.chain?.name;
  const { data: ensName } = useEnsName({
    address,
    enabled: !!network.chain?.ens,
  });

  const {
    data: signer,
  } = useSigner();


  let coinAddress: string | undefined;
  let nftAddress: string | undefined;
  let nftContract: VolcanoNFT | undefined;
  let coinContract: VolcanoCoin | undefined;
  const isValidNetwork = isValidChainId(chainId);
  if (isValidNetwork) {
    coinAddress = deployments[chainId][0].contracts.VolcanoCoin.address;
    nftAddress = deployments[chainId][0].contracts.VolcanoNFT.address;

    const NftContract = new VolcanoNFT__factory(signer || undefined);
    const CoinContract = new VolcanoCoin__factory(signer || undefined);
    nftContract = NftContract.attach(nftAddress || "");
    coinContract = CoinContract.attach(coinAddress || "");    
  }


  const [mintWithEthStatus, setMintWithEthStatus] = useState<"idle" | "loading" | "started">("idle");
  const doMintWithEth = async () => {
    try {
      if (nftContract) {
        setMintWithEthStatus("loading");
        const tx = await nftContract.mint({
          value: parseEther("0.001"),
        });
        setMintWithEthStatus("started");
        await tx.wait();
        setMintWithEthStatus("idle");
      }
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert(JSON.stringify(err));
      }
    } finally {
      setMintWithEthStatus("idle");
    }
  };

  const [mintWithCoinStatus, setMintWithCoinStatus] = useState<"idle" | "loadingApprove" | "startedApprove" | "loadingMint" | "startedMint">("idle");
  const doMintWithLavaCoin = async () => {
    try {
      if (nftContract && coinContract && address) {
        setMintWithCoinStatus("loadingApprove");
        const coinBalance = await coinContract.balanceOf(address);
        if (coinBalance.lt(parseEther("1"))) {
          throw new Error("You need at least 1 LAVACOIN");
        }
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
      }
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert(JSON.stringify(err));
      }
    } finally {
      setMintWithCoinStatus("idle");
    }
  };

  const { data: numberOfTokensOwned } = useContractRead({
    address: nftAddress,
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

    if (!isValidNetwork) {
      return (
        <p>Please switch to a valid network to mint!</p>
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
      <h1>Volcano NFT Mint ❤️‍🔥 ({chainName})</h1>
      <section>
        {renderUi()}
      </section>
    </Container>
  );
};