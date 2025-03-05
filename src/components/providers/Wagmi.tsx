import { alchemyApiKey, thirdwebClientId } from "@/lib/constants";
import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { inAppWalletConnector } from "@thirdweb-dev/wagmi-adapter";
import { createThirdwebClient, defineChain as thirdwebChain } from "thirdweb";
import { http, WagmiProvider, createConfig, injected } from "wagmi";
import { base, degen, zora } from "wagmi/chains";

if (!alchemyApiKey) {
	throw new Error("ALCHEMY_API_KEY is not defined");
}

const client = createThirdwebClient({
	clientId: thirdwebClientId!,
});

export const config = createConfig({
	chains: [base],
	transports: {
		[base.id]: http(alchemyApiKey),
	},
	connectors: [farcasterFrame(), injected(), inAppWalletConnector({ client })],
});

const queryClient = new QueryClient();

export default function Provider({ children }: { children: React.ReactNode }) {
	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</WagmiProvider>
	);
}
