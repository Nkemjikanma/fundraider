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
import { formatUnits } from "viem";
import { base, degen, zora } from "wagmi/chains";
import { isValid } from "zod";
import { TOKENS, alchemy, rosaliesAddress } from "./constants";
import type { TransactionsResponse, WalletBalanceSummary } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getAlchemyTokenBalance = async (
  address: string,
  token: string,
) => {
  const ownerTokens = await alchemy.core.getTokensForOwner(address);

  console.log(ownerTokens);

  const ownerTokensTest = await alchemy.core.getTokenBalances(address, {
    type: TokenBalanceType.ERC20,
  });
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

export const getTotalWalletBalance = async (
  address: string,
): Promise<WalletBalanceSummary> => {
  try {
    // get all erc20 tokens
    const tokenBalances = await alchemy.core.getTokenBalances(address, {
      type: TokenBalanceType.ERC20,
    });

    const tokenAddresses = tokenBalances.tokenBalances.map((token) => ({
      network: Network.BASE_MAINNET,
      address: token.contractAddress,
      balance: token.tokenBalance,
    }));

    const tokenPriceData: Record<string, any> = {};

    if (tokenAddresses.length > 0) {
      const tokenPrices =
        await alchemy.prices.getTokenPriceByAddress(tokenAddresses);

      for (const priceData of tokenPrices.data) {
        if (!priceData.error || !priceData.error.message) {
          tokenPriceData[priceData.address.toLowerCase()] = priceData;
        }
      }
    }

    const tokensWithData = await Promise.all(
      tokenBalances.tokenBalances.map(async (tokenBalance) => {
        try {
          // get the token meta data
          const metadata = await alchemy.core.getTokenMetadata(
            tokenBalance.contractAddress,
          );

          // get price data
          const priceData =
            tokenPriceData[tokenBalance.contractAddress.toLowerCase()];

          // calculate value
          const decimals = metadata.decimals || 18;
          const rawBalance = tokenBalance.tokenBalance || "0";
          const formattedBalance = formatUnits(BigInt(rawBalance), decimals);

          // price calculation
          const priceInUSD =
            Number(priceData?.prices[0].value).toFixed(6) || "0";
          const valueInUSD = (
            Number(formattedBalance) * Number(priceInUSD)
          ).toFixed(2);

          return {
            address: tokenBalance.contractAddress,
            symbol: metadata.symbol || "UNKNOWN",
            name: metadata.name || "Unknown Token",
            decimals,
            rawBalance,
            formattedBalance,
            priceInUSD,
            valueInUSD,
            logo: metadata.logo || null,
          };
        } catch (error) {
          console.error(
            `Error processing tokens ${tokenBalance.contractAddress}:`,
            error,
          );
          return null;
        }
      }),
    );

    const validTokens = tokensWithData.filter(
      (token) => !Number.isNaN(Number(token?.priceInUSD)),
    );

    const totalValueInUSD = validTokens
      .reduce((sum, token) => sum + Number(token?.valueInUSD), 0)
      .toFixed(2);

    const ethPriceData = await alchemy.prices.getTokenPriceByAddress([
      {
        network: Network.BASE_MAINNET,
        address: "0x4200000000000000000000000000000000000006", // WETH on Base
      },
    ]);

    const ethPrice = ethPriceData.data[0]?.prices[0].value || 0;

    console.log(ethPrice);

    const output = {
      totalValueInUSD,
      totalValueInETH: (Number(totalValueInUSD) / Number(ethPrice)).toFixed(6),
    };

    return {
      // tokens: validTokens,
      totalValueInUSD,
      totalValueInETH: (Number(totalValueInUSD) / Number(ethPrice)).toFixed(6),
    };
  } catch (e) {
    console.log(`We probably been rate limited, ${e}`);
    throw e;
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
