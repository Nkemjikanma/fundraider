import type { TransactionsResponse } from "@/lib/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { AssetTransfersWithMetadataResult } from "alchemy-sdk";
import { useState } from "react";
import { getTransfers } from "../services";

export function useTransactions(address: string, donationFeedPageKey?: string) {
  return useQuery({
    queryKey: ["transactions", address, donationFeedPageKey],
    queryFn: () => getTransfers(address, donationFeedPageKey),
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchInterval: 60000, // Refetch every minute
    retry: 3,
  });
}
