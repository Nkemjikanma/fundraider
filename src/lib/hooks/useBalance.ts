import { useQuery } from "@tanstack/react-query";
import { getWalletBalance } from "../services";

export function useBalance(address: string) {
	return useQuery({
		queryKey: ["balance", address],
		queryFn: () => getWalletBalance(address),
		staleTime: 30000,
	});
}
