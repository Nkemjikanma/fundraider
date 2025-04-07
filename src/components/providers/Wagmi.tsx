import { alchemyApiKey, networkURL } from "@/lib/constants";
import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { http, WagmiProvider, createConfig, injected } from "wagmi";
import { base, degen, zora } from "wagmi/chains";

if (!alchemyApiKey) {
  throw new Error("ALCHEMY_API_KEY is not defined");
}

export const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(networkURL),
  },
  connectors: [farcasterFrame(), injected()],
});

export default function Provider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
