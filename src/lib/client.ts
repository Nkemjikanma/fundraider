import { http, createPublicClient } from "viem";
import { base, mainnet } from "viem/chains";
import { networkURL } from "./constants";

export const publicClient = createPublicClient({
	chain: mainnet,
	transport: http(networkURL),
});
