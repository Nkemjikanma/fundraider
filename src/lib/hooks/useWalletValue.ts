import { useQuery } from "@tanstack/react-query";
import { apiRequest, buildUrl } from "../services/api";
import { API_ENDPOINTS } from "../services/constants";
import { getWalletValue } from "../services/wallet-value";

export function useWalletValue(address: string) {
  return useQuery({
    queryKey: ["walletValue", address],
    queryFn: async () => getWalletValue(address),
    staleTime: 60000,
  });
}
