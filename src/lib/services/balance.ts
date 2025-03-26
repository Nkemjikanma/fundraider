import type { Balance } from "@/lib/types";
import { apiRequest, buildUrl } from "./api";
import { API_ENDPOINTS } from "./constants";

/**
 * Get the ETH balance for a wallet address
 */
export async function getWalletBalance(address: string): Promise<Balance> {
  return apiRequest<Balance>(buildUrl(API_ENDPOINTS.BALANCE, { address }));
}

/**
 * Get the token balance for an address and token
 */
export async function getTokenBalance(address: string, tokenAddress: string) {
  return apiRequest(
    buildUrl(API_ENDPOINTS.TOKEN_BALANCE, { address, tokenAddress }),
  );
}
