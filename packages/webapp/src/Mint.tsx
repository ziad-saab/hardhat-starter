import { VolcanoNFT__factory } from "@hardhat-starter/contract-types";
import { ConnectKitButton } from "connectkit";
import { parseEther } from "ethers/lib/utils";
import { useAccount, useContractRead, useContractWrite, useDisconnect, useEnsName, usePrepareContractWrite } from "wagmi";
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

export const Mint = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect({});
  const { data: ensName } = useEnsName({
    address: address?.toLowerCase() as `0x${string}` | undefined,
  });

  const { config } = usePrepareContractWrite({
    address: "0xFE7Db383A3c89e0d4BbD68Da9296425b42B23284",
    abi: VolcanoNFT__factory.abi,
    functionName: "mint",
    overrides: {
      value: parseEther("0.001"),
    },
  });

  const { data: numberOfTokensOwned } = useContractRead({
    address: "0xFE7Db383A3c89e0d4BbD68Da9296425b42B23284",
    abi: VolcanoNFT__factory.abi,
    functionName: "balanceOf",
    args: address && [address],
    watch: true,
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { write: contractMint, isLoading } = useContractWrite(config);

  const doMint = async () => {
    await contractMint?.();
  };

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
        <div>
          <Button disabled={isLoading} type="button" onClick={doMint}>Mint!</Button>
          {" "}
          <Button type="button" onClick={() => disconnect()}>Disconnect Wallet</Button>
        </div>
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