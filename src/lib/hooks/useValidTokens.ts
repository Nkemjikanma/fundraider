import type { Token } from "@/lib/types";
import { getValidTokens } from "@/services";
import { useQuery } from "@tanstack/react-query";

export function useValidTokens(address: string | undefined) {
  return useQuery({
    queryKey: ["validTokens", address],
    queryFn: async () => {
      if (!address) return [];

      const data = await getValidTokens(address);
      return data.tokens;
    },
    enabled: !!address, // Only run query when address is available
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });
}
