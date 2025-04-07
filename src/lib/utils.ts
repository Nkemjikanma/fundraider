import {
  Alchemy,
  AssetTransfersCategory,
  Network,
  SortingOrder,
  type TokenAddressRequest,
  TokenBalanceType,
} from "alchemy-sdk";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { base, degen, zora } from "wagmi/chains";
import { TOKENS, alchemy, rosaliesAddress } from "./constants";
import type { TransactionsResponse } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getAlchemyTokenBalance = async (
  address: string,
  token: string,
) => {
  const ownerTokens = await alchemy.core.getTokensForOwner(address);

  const ownerTokensTest = await alchemy.core.getTokenBalances(address, {
    type: TokenBalanceType.ERC20,
  });
  console.log("ownerTokensTest", ownerTokensTest);
  const filteredToken = ownerTokens.tokens.find((ownerToken) => {
    console.log(ownerToken.symbol);

    return (
      ownerToken.symbol?.toLowerCase() === token.toLowerCase() ||
      ownerToken.symbol === "WETH"
    );
  });

  if (!filteredToken) {
    return undefined;
  }

  console.log("filteredToken", filteredToken);

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

export const getAlchemyTransfers = async (
  address: string,
  pageKey?: string,
) => {
  try {
    const params: any = {
      fromBlock: "0x0",
      toAddress: address,
      excludeZeroValue: true,
      category: [AssetTransfersCategory.ERC20, AssetTransfersCategory.EXTERNAL],
      withMetadata: true,
      order: SortingOrder.DESCENDING,
      maxCount: 10,
    };

    if (pageKey) {
      params.pageKey = pageKey;
    }
    const transfers = await alchemy.core
      .getAssetTransfers(params)
      .then((transfer) => {
        const filteredTransfers = transfer.transfers.filter(
          (transfer, index) => {
            if (transfer.asset) {
              return ["eth", "usdc", "degen"].includes(
                transfer.asset.toLowerCase(),
              );
            }
            return false;
          },
        );
        return {
          transfers: filteredTransfers,
          pageKey: transfer.pageKey,
        };
      });

    return transfers;
  } catch (error) {
    console.log("Error fetching asset transfers:", error);
    throw error;
  }
};

export const generateSignInNonce = (length = 32) => {
  const randomBytes = new Uint8Array(length);

  crypto.getRandomValues(randomBytes);

  return Array.from(randomBytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};
