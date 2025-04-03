import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTransfers } from "../services";

export function useTransactions(address: string) {
	return useQuery({
		queryKey: ["transactions", address],
		queryFn: () => getTransfers(address),
		staleTime: 30000, // Consider data fresh for 30 seconds
		refetchInterval: 60000, // Refetch every minute
		retry: 3,
	});
}
