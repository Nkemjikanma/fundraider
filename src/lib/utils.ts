import {
  Alchemy,
  AssetTransfersCategory,
  Network,
  SortingOrder,
  type TokenAddressRequest,
} from "alchemy-sdk";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { base, degen, zora } from "wagmi/chains";
import { TOKENS, alchemy, rosaliesAddress } from "./constants";
import type { FundRaisers, Token } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getFundRaiderValidTokens = async (address?: string) => {
  const defaultToken = [TOKENS[0]];

  if (!address) return defaultToken;

  try {
    const ownerTokens = await alchemy.core.getTokensForOwner(address);
    const validTokens = ownerTokens.tokens
      .filter(async (ownerToken) => {
        const price = await alchemy.prices.getTokenPriceByAddress([
          {
            network: Network.BASE_MAINNET,
            address: ownerToken.contractAddress,
          },
        ]);

        const hasBalance =
          Number(
            price.data.flatMap((p) => p.prices.map((price) => price.value))[0],
          ) > 0;

        const isSupported = TOKENS.every(
          (supportedToken) =>
            supportedToken.symbol.toLowerCase() ===
            ownerToken.symbol?.toLowerCase(),
        );

        return hasBalance && isSupported;
      })
      .map((token) => {
        // Get the matching supported token to use its image
        const supportedToken = TOKENS.find(
          (t) => t.symbol.toLowerCase() === token.symbol?.toLowerCase(),
        );

        return {
          symbol: token.symbol || "",
          address: token.contractAddress,
          image: supportedToken?.image, // Use image from our TOKENS constant
          balance: token.rawBalance || "0",
          decimals: token.decimals,
        };
      });

    // console.log("Filtered valid tokens:", validTokens);

    return [...defaultToken, ...validTokens];
  } catch (error) {
    console.log("Error fetching token balances: ", error);
    throw error;
  }
};

export const getAlchemyTokenBalance = async (
  address: string,
  token: string,
) => {
  const ownerTokens = await alchemy.core.getTokensForOwner(address);
  const filteredToken = ownerTokens.tokens.find((ownerToken) => {
    console.log(ownerToken.symbol);
    return ownerToken.symbol?.toLowerCase() === token.toLowerCase();
  });

  if (!filteredToken) {
    return undefined;
  }

  console.log(filteredToken);

  return filteredToken;
};
export const getAlchemyWalletBalance = async (address: string) => {
  try {
    const walletBalance = await alchemy.core.getBalance(address);

    return walletBalance;
  } catch (error) {
    console.log("Error fetching token balances: ", error);
    throw error;
  }
};

export const getAlchemyTransfers = async (address: string) => {
  try {
    const transfers = await alchemy.core
      .getAssetTransfers({
        fromBlock: "0x0",
        toAddress: address,
        excludeZeroValue: true,
        category: [
          AssetTransfersCategory.ERC20,
          // AssetTransfersCategory.INTERNAL,
          AssetTransfersCategory.EXTERNAL,
        ],
        withMetadata: true,
        order: SortingOrder.DESCENDING,
      })
      .then((transfer) =>
        transfer.transfers.filter((transfer) => {
          if (
            transfer.category === AssetTransfersCategory.ERC20 &&
            transfer.asset
          ) {
            return ["ETH", "USDC", "DEGEN"].includes(transfer.asset);
          }
          return false;
        }),
      );

    return transfers;
  } catch (error) {
    console.log("Error fetching asset transfers:", error);
    throw error;
  }
};

const currentDate = new Date();
export const fundraisers: FundRaisers = [
  {
    id: "rosalie",
    fundraiserAddress: {
      address: rosaliesAddress,
      ensName: "rosaliesrainbow.eth",
      farcaster: "rosaliesrainbow",
    },
    title: "2ETH for Rosalie",
    description: "Running to raise 2ETH for Rosalie's hiking cart",
    goal: 2,
    status: "active",
    currency: "ETH",
    createdAt: new Date(),
    updatedAt: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 2)),
    creator: "nkemjika",
  },
];
