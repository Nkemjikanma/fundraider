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
import type { FundRaisers, Token } from "./types";

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

export const getAlchemyTransfers = async (address: string) => {
  try {
    const transfers = await alchemy.core
      .getAssetTransfers({
        fromBlock: "0x0",
        toAddress: address,
        excludeZeroValue: true,
        category: [
          AssetTransfersCategory.ERC20,
          AssetTransfersCategory.EXTERNAL,
        ],
        withMetadata: true,
        order: SortingOrder.DESCENDING,
      })
      .then((transfer) =>
        transfer.transfers.filter((transfer, index) => {
          if (transfer.asset) {
            return ["eth", "usdc", "degen"].includes(
              transfer.asset.toLowerCase(),
            );
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
