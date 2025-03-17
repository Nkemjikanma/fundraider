import { useQuery } from "@tanstack/react-query";

export function useBalance(address: string) {
  return useQuery({
    queryKey: ["balance", address],
    queryFn: async () => {
      const response = await fetch(`/api/balance?address=${address}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    staleTime: 30000,
  });
}
