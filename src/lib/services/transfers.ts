import type { TransactionsResponse } from "@/lib/types";
import { apiRequest, buildUrl } from "./api";
import { API_ENDPOINTS } from "./constants";

/**
 * Get transfers for an address
 */
export async function getTransfers(
  address: string,
  page?: string,
): Promise<TransactionsResponse> {
  return await apiRequest<TransactionsResponse>(
    buildUrl(API_ENDPOINTS.TRANSFERS, { address, page: page }),
  );
}
