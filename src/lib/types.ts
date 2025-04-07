import type { AssetTransfersWithMetadataResult } from "alchemy-sdk";

export type Fundraiser = {
  id: string;
  fundraiserAddress: {
    address: string;
    ensName?: string;
    farcaster?: string;
    fid: number;
  };
  title: string;
  description: string;
  goal: number;
  status: "active" | "completed" | "cancelled";
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  endDate: Date;
  creator: string;
};

export type FundRaisers = Fundraiser[];

export type Token = {
  symbol: string;
  name: string;
  image: string;
  address: string;
  decimals: number;
};

export interface Balance {
  balance: string;
}

export interface TransactionsResponse {
  transfers: {
    transfers: AssetTransfersWithMetadataResult[];
    pageKey?: string;
  };
}
