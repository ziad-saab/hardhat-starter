import { css, Global } from "@emotion/react";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import { configureChains, createClient, defaultChains, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { Mint } from "~/Mint";

const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  alchemyProvider({ apiKey: "wfpl73-RS5qOc_h4Eb5aLnUbg648jNJI" }),
]);

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