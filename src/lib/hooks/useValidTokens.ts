import type { Token } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export function useValidTokens(address: string | undefined) {
	return useQuery({
		queryKey: ["validTokens", address],
		queryFn: async () => {
			if (!address) return [];

			const response = await fetch(`/api/valid-tokens?address=${address}`);
			if (!response.ok) {
				throw new Error("Failed to fetch valid tokens");
			}

			const data = await response.json();
			return data.tokens as Token[];
		},
		enabled: !!address, // Only run query when address is available
		staleTime: 30000, // Consider data fresh for 30 seconds
		refetchOnWindowFocus: false, // Don't refetch when window regains focus
	});
}
