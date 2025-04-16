import type { WalletBalanceSummary } from "../types";
import { apiRequest, buildUrl } from "./api";
import { API_ENDPOINTS } from "./constants";

export async function getWalletValue(
  address: string,
): Promise<WalletBalanceSummary> {
  return await apiRequest(buildUrl(API_ENDPOINTS.WALLET_VALUE, { address }));
}
