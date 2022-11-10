import { css, Global } from "@emotion/react";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import { configureChains, createClient, defaultChains, WagmiConfig, chain } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { Mint } from "~/Mint";

const { chains, provider, webSocketProvider } = configureChains(
  [...defaultChains, chain.hardhat],
  [
    alchemyProvider({ apiKey: "PNBlDMYwzLo3WHm7MwAr1hDW_9v3dNGa" }),
    jsonRpcProvider({
      rpc({ id: chainId }) {
        if (chainId === chain.hardhat.id || chainId === chain.localhost.id) {
          return {
            http: "http://localhost:8545",
          };
        }

        return null;
      },
    }),
  ],
);

const client = createClient({
  ...getDefaultClient({
    appName: "Volcano NFT Mint!",
    chains,
  }),
  provider,
  webSocketProvider,
});

export function App() {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>
        <Global
          styles={css`
            html, body {
              margin: 0;
              font-family: Helvetica, Arial, sans-serif;
            }
          `}
        />
        <Mint />
      </ConnectKitProvider>
    </WagmiConfig>
  );
}