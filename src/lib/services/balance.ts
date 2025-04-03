import type { Balance } from "@/lib/types";
import { apiRequest, buildUrl } from "./api";
import { API_ENDPOINTS } from "./constants";

type TokenBalanceResponse = {
  balance?: string;
  error?: string;
};

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
  const response = await apiRequest<TokenBalanceResponse>(
    buildUrl(API_ENDPOINTS.TOKEN_BALANCE, { address, tokenAddress }),
  );

  if ("error" in response) {
    throw new Error(response.error);
  }

  return response.balance || "0";
}
