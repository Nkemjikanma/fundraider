import { Alchemy, Network } from "alchemy-sdk";
import type { FundRaisers, Token } from "./types";

export const appURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
export const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
export const networkURL = process.env.ALCHEMY_NETWORK_URL;

export const rosaliesAddress = "0x4b9990370a346f15c8B554101590a1A75555275C";

export const rosaliesName = "Rosalie";

export const alchemySettings = {
  apiKey: alchemyApiKey,
  network: Network.BASE_MAINNET,
  connectionInfoOverrides: {
    skipFetchSetup: true,
  },
};
export const alchemy = new Alchemy(alchemySettings);

export const TOKENS: Token[] = [
  {
    symbol: "ETH",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
    address: "0x4200000000000000000000000000000000000006",
    decimals: 18,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    image: "https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png",
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    decimals: 6,
  },
  {
    symbol: "DEGEN",
    name: "Degen",
    image:
      "https://assets.coingecko.com/coins/images/34515/standard/android-chrome-512x512.png?1706198225",
    address: "0x4ed4e862860bed51a9570b96d89af5e1b0efefed",
    decimals: 18,
  },
];

export const fundraisers: FundRaisers = [
  {
    id: "rosalie",
    fundraiserAddress: {
      address: rosaliesAddress,
      ensName: "rosaliesrainbow.eth",
      farcaster: "rosaliesrainbow",
    },
    title: "2 ETH for Rosalie",
    description: "Running to raise 2 ETH for Rosalie's hiking cart",
    goal: 2,
    status: "active",
    currency: "ETH",
    createdAt: new Date(),
    updatedAt: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 2)),
    creator: "nkemjika",
  },
];
