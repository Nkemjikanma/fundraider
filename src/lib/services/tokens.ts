import type { Token } from "@/lib/types";
import { apiRequest, buildUrl } from "./api";
import { API_ENDPOINTS } from "./constants";

/**
 * Get valid tokesn for an address
 */
export async function getValidTokens(
  address: string,
): Promise<{ tokens: Token[] }> {
  return apiRequest<{ tokens: Token[] }>(
    buildUrl(API_ENDPOINTS.VALID_TOKENS, { address }),
  );
}
