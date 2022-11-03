import { VolcanoCoin__factory, VolcanoNFT__factory } from "@hardhat-starter/contract-types";
import { ConnectKitButton } from "connectkit";
import { parseEther } from "ethers/lib/utils";
import { useAccount, useContractRead, useContractWrite, useDisconnect, useEnsName, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import styled from "@emotion/styled";

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

const nftContract = {
  address: "0x610aC004B46e60c6f9D29DED3836c977F6b891cb",
  abi: VolcanoNFT__factory.abi,
};

const coinContract = {
  address: "0x35f3dE7dd7C9F8b0185fCBf7F1C4c2C145d494D9",
  abi: VolcanoCoin__factory.abi,
};

export const Mint = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect({});
  const { data: ensName } = useEnsName({
    address: address?.toLowerCase() as `0x${string}` | undefined,
  });

  // Mint with LAVACOIN
  const { config: configApproveLavaCoin } = usePrepareContractWrite({
    ...coinContract,
    functionName: "approve",
    args: [nftContract.address, parseEther("1")],
  });
  const {
    write: approveLavaCoin,
    isLoading: isApproveLoading,
    isSuccess: isApproveStarted,
    data: approveData,
    error: approveError,
    reset: resetApprove,
    // @ts-expect-error Will be fixed when https://github.com/dethcrypto/TypeChain/pull/783 is released
  } = useContractWrite(configApproveLavaCoin);

  const {
    error: txApproveError,
  } = useWaitForTransaction({
    hash: approveData?.hash,
    onSuccess() {
      resetApprove();
      mintWithLavaCoin?.();
    },
  });

  // const { config: configMintWithLavaCoin } = usePrepareContractWrite({
  //   ...nftContract,
  //   functionName: "mint",
  //   enabled: approveSuccess,
  // });
  const {
    write: mintWithLavaCoin,
    isLoading: isMintWithLavaCoinLoading,
    isSuccess: isMintWithLavaCoinStarted,
    data: mintWithLavaCoinData,
    error: mintWithLavaCoinError,
    reset: resetMintWithLavaCoin,
  } = useContractWrite({
    ...nftContract,
    functionName: "mint",
    mode: "recklesslyUnprepared",
  });

  const doMintWithLavaCoin = () => {
    approveLavaCoin?.();
  };

  const {
    error: txMintWithLavaCoinError,
  } = useWaitForTransaction({
    hash: mintWithLavaCoinData?.hash,
    onSuccess() {
      resetMintWithLavaCoin();
    },
  });


  // Mint with ETH
  const { config: configMintWithEth } = usePrepareContractWrite({
    ...nftContract,
    functionName: "mint",
    overrides: {
      value: parseEther("0.001"),
    },
  });

  const {
    write: mintWithEth,
    isLoading: isMintWithEthLoading,
    isSuccess: isMintWithEthStarted,
    data: mintWithEthData,
    error: mintWithEthError,
    reset: resetMintWithEth,
    // @ts-expect-error Will be fixed when https://github.com/dethcrypto/TypeChain/pull/783 is released
  } = useContractWrite(configMintWithEth);

  const doMintWithEth = async () => {
    await mintWithEth?.();
  };

  const {
    error: txMintWithEthError,
  } = useWaitForTransaction({
    hash: mintWithEthData?.hash,
    onSuccess() {
      resetMintWithEth();
    },
  });

  // Number of tokens owned request
  const { data: numberOfTokensOwned } = useContractRead({
    ...nftContract,
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
          disabled={!mintWithEth || isMintWithEthLoading || isMintWithEthStarted}
          type="button"
          onClick={doMintWithEth}
        >
          {isMintWithEthLoading && "Waiting for approval"}
          {isMintWithEthStarted && "Minting..."}
          {!isMintWithEthLoading && !isMintWithEthStarted && "Mint with ETH!"}
        </Button>
        <Button
          disabled={
            !(approveLavaCoin || mintWithLavaCoin) ||
            isMintWithLavaCoinLoading ||
            isMintWithLavaCoinStarted ||
            isApproveLoading ||
            isApproveStarted
          }
          type="button"
          onClick={doMintWithLavaCoin}
        >
          {(isMintWithLavaCoinLoading || isApproveLoading) && "Waiting for approval"}
          {isApproveStarted && "Approving LAVACOIN..."}
          {isMintWithLavaCoinStarted && "Minting..."}
          {
            !isMintWithLavaCoinLoading &&
            !isMintWithLavaCoinStarted &&
            !isApproveLoading &&
            !isApproveStarted &&
            "Mint with LAVACOIN!"
          }
        </Button>
        <Button type="button" onClick={() => disconnect()}>Disconnect Wallet</Button>
        {
          [
            mintWithEthError,
            txMintWithEthError,
            approveError,
            txApproveError,
            mintWithLavaCoinError,
            txMintWithLavaCoinError,
          ]
            .filter((x): x is Error => x instanceof Error)
            .map(err => (
              <p key={err.name} style={{ marginTop: 24, color: "#FF6257" }}>
                Error: {err.message}
              </p>
            ))
        }
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