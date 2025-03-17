import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useTransactions(address: string) {
  return useQuery({
    queryKey: ["transactions", address],
    queryFn: async () => {
      const response = await fetch(`/api/transfers?address=${address}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchInterval: 60000, // Refetch every minute
    retry: 3,
  });
}
