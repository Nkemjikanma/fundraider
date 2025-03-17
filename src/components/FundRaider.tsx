"use client";
import { DonationFeed } from "@/components/DonationFeed";
import { Thermometer } from "@/components/Thermometer";
import { config } from "@/components/providers/Wagmi";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TOKENS } from "@/lib/constants";
import { useBalance } from "@/lib/hooks/useBalance";
import { useTransactions } from "@/lib/hooks/useTransactions";
import type { Token } from "@/lib/types";
// import { useValidTokens } from "@/lib/hooks/useValidTokens";
import { fundraisers } from "@/lib/utils";
import sdk from "@farcaster/frame-sdk";
import { fetchBalance, getBalance } from "@wagmi/core";
import { Clock, ExternalLink, EyeOff, Share2, WalletIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { formatEther, formatUnits } from "viem";
import { parseEther } from "viem";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import {
  UsePrepareTransactionRequestParameters,
  useSendTransaction,
} from "wagmi";
import { base } from "wagmi/chains";
import { Logo } from "./Logo";
import { TransactionFlow } from "./TransactionFlow";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const FIXED_AMOUNTS = [0.01, 0.05, 0.1, 0.5, 1];

export default function FundRaider({ param }: { param: string }) {
  //TODO: get current fundraiser data
  const fundraiser = fundraisers[0];

  const [isLoaded, setIsLoaded] = useState(false);
  const [showQuickDonateError, setShowQuickDonateError] = useState(false);
  const [showTransactionFlow, setShowTransactionFlow] = useState(false);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [selectedToken, setSelectedToken] = useState<Token>(TOKENS[0]);
  const [maxAmount, setMaxAmount] = useState<string>("");
  const { address: userAddress, isConnected } = useAccount();

  const {
    data: balanceData,
    isLoading: isBalanceLoading,
    error: balanceError,
  } = useBalance(fundraiser.fundraiserAddress.address);

  const {
    data: transactionsData,
    isLoading: isTransactionsLoading,
    error: transactionsError,
  } = useTransactions(fundraiser.fundraiserAddress.address);

  // const { data: validTokens, isLoading: isLoadingTokens } =
  //   useValidTokens(userAddress);

  // const displayedValiedTokens =
  //   validTokens?.length === 0 ? [TOKENS[0]] : validTokens;

  // console.log("token validest", displayedValiedTokens);

  const isLoading = !isLoaded || isBalanceLoading || isTransactionsLoading;

  const raised = balanceData ? formatEther(BigInt(balanceData.balance)) : "0";
  const transactions = transactionsData?.transfers;

  const {
    data: hash,
    isPending,
    error,
    sendTransaction,
  } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    const load = async () => {
      sdk.actions.ready();
    };

    if (sdk && !isLoaded) {
      load();
      setIsLoaded(true);
    }
  }, [isLoaded]);

  // update max amount when token changes
  useEffect(() => {
    if (isConnected && userAddress) {
      handleMaxClick();
    }
  }, [selectedToken, isConnected, userAddress]);

  const linkToBaseScan = useCallback((hash?: string) => {
    if (hash) {
      sdk.actions.openUrl(`https://basescan.org/tx/${hash}`);
    }
  }, []);

  const handleQuickDonateButtons = useCallback(
    async (amount: number) => {
      if (!userAddress) return;

      try {
        const ownerTokensWagmi = await getBalance(config, {
          address: userAddress,
          blockTag: "latest",
          chainId: base.id,
        });

        const formattedBalance = Number(
          formatUnits(ownerTokensWagmi.value, ownerTokensWagmi.decimals),
        );

        console.log("formattedBalance:", formattedBalance);

        if (Number(formattedBalance) > Number(customAmount)) {
          setCustomAmount(Number(amount).toFixed(4).toString());
          setSelectedToken(TOKENS[0]);
          setShowTransactionFlow(true);

          return;
        }
        setShowQuickDonateError(true);
      } catch (error) {
        console.error("Error fetching ETH balance:", error);
      }
    },
    [customAmount, userAddress],
  );

  const handleDonateClick = async () => {
    if (!customAmount || !isConnected) return;

    setShowTransactionFlow(true);
  };

  const handleMaxClick = async () => {
    if (!userAddress) return;
    try {
      let balance;

      if (selectedToken.symbol === "ETH") {
        // For ETH
        balance = await getBalance(config, {
          address: userAddress,
          chainId: base.id,
        });
      } else {
        // For ERC20 tokens
        balance = await getBalance(config, {
          address: userAddress,
          token: selectedToken.address as `0x${string}`,
          chainId: base.id,
        });
      }

      // const ownerTokensWagmi = await getBalance(config, {
      //   address: userAddress,
      //   blockTag: "latest",
      //   token: selectedToken.address,
      //   unit: "ether",
      // });

      const formattedBalance = formatUnits(balance.value, balance.decimals);
      console.log("formattedBalance", formattedBalance);

      // Leave some ETH for gas
      // const maxAmount =
      //   Number(formattedBalance) > 0
      //     ? (Number(formattedBalance) - 0.01).toString()
      //     : "0.0";

      setMaxAmount(formattedBalance);
      setCustomAmount(Number(formattedBalance).toFixed(4).toString());
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const DonationSection = () => (
    <Card className="w-full mt-4">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Connected Wallet Info */}
          <div className="flex items-center justify-between p-3 bg-gray-50">
            <div className="flex items-center gap-2">
              <WalletIcon className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium">Connected Wallet</span>
            </div>
            {isConnected ? (
              <code className="text-sm bg-white px-2 py-1">
                {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}
              </code>
            ) : (
              // onClick={() => connectWallet()
              <Button variant="outline" size="sm">
                Connect Wallet
              </Button>
            )}
          </div>

          {/* Fixed Amount Buttons */}
          <div className="space-y-2">
            <Label>Quick Donate</Label>
            <div className="grid grid-cols-3 gap-2">
              {FIXED_AMOUNTS.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  onClick={() => handleQuickDonateButtons(amount)}
                  className="w-full rounded-none"
                  disabled={!isConnected}
                >
                  {amount} ETH
                </Button>
              ))}
            </div>
            {showQuickDonateError && (
              <p className="text-red-500 text-xs">
                Not enough ETH in thy wallet <span className="ml-1">👎🏾</span>
              </p>
            )}
          </div>

          {/* Custom Amount Input */}
          <div className="space-y-2">
            <Label>Custom Amount</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <div className="relative flex items-center">
                  <Select
                    value={selectedToken.symbol}
                    onValueChange={(value) =>
                      setSelectedToken(
                        TOKENS.find((token) => token.symbol === value) ??
                          TOKENS[0],
                      )
                    }
                    defaultValue={TOKENS[0].symbol}
                  >
                    <SelectTrigger className="w-[100px] absolute left-0 z-10 rounded-none">
                      <SelectValue
                        placeholder="Token"
                        defaultValue={TOKENS[0].symbol}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {TOKENS.map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol}>
                          <div className="flex items-center gap-2">
                            <img
                              src={token.image}
                              alt={token.symbol}
                              className="w-4 h-4"
                            />
                            {token.symbol}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    inputMode="decimal"
                    placeholder="0.0"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="pl-[130px] rounded-none"
                  />
                </div>
              </div>
              <Button
                onClick={handleDonateClick}
                disabled={
                  !isConnected ||
                  !customAmount ||
                  isPending ||
                  Number(customAmount) <= 0
                }
                className="bg-teal-500 hover:bg-teal-600 rounded-none"
              >
                {isConnected ? "Donate" : "Connect Wallet"}
              </Button>
            </div>
          </div>

          {/* Max Button and Balance */}
          <div className="flex justify-between items-center text-sm text-gray-500">
            <button
              type="button"
              disabled={!isConnected || !userAddress}
              onClick={handleMaxClick}
              className="text-teal-600 hover:text-teal-700"
            >
              Max
            </button>
            <span>{Number(maxAmount).toFixed(4)}</span>{" "}
            {/* Replace with actual balance */}
          </div>
        </div>
        {showTransactionFlow && (
          <TransactionFlow
            amount={customAmount}
            token={selectedToken.symbol}
            recipient={
              fundraiser.fundraiserAddress.ensName ||
              fundraiser.fundraiserAddress.address
            }
            onConfirm={async () => {
              try {
                sendTransaction({
                  to:
                    fundraiser.fundraiserAddress.ensName ||
                    fundraiser.fundraiserAddress.address,
                  value: parseEther(customAmount),
                });
                setShowTransactionFlow(false); // Hide flow after successful transaction
              } catch (error) {
                console.error("Transaction failed:", error);
                throw error; // Let TransactionFlow handle the error
              }
            }}
            onClose={() => setShowTransactionFlow(false)}
          />
        )}

        {/* // Transaction status */}
        <div>
          {isConfirming && (
            <div className="text-orange-500 text-center mt-4">
              ⏳ Waiting for confirmation...
            </div>
          )}

          {isConfirmed && (
            <div
              className="text-green-500 text-center mt-4"
              onClick={() => linkToBaseScan(hash)}
            >
              <p>🎉 Transaction Confirmed!</p>
              <p>Tap to View on Basescan</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#D5C0A0]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500" />
      </div>
    );
  }

  // error from balanceError or transactionsError
  if (balanceError || transactionsError) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <h2 className="text-red-600 font-bold">Error loading data</h2>
        <p className="text-red-500">
          {balanceError?.message || transactionsError?.message}
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-2"
          variant="destructive"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative items-center max-w-md min-w-96 mx-auto p-4 bg-[#D5C0A0]">
      <Image
        src="/fundraider_logo.webp"
        width={200}
        height={200}
        alt="Fundraiser Logo"
      />

      {/* Main Fundraiser Card */}
      <div className="mt-6 flex justify-between px-1">
        <div className="flex-1">
          <Thermometer
            progress={(Number(raised) / fundraiser.goal) * 100}
            goal={fundraiser.goal}
            balance={Number(raised)}
          />
        </div>
        <div className="relative flex flex-col flex-2 w-full mb-6">
          <div className="flex flex-col relative bg-teal-50 rounded-none p-3">
            <div className="w-full flex flex-row justify-between items-start">
              <div>
                <h1 className="text-[16px] font-bold">{fundraiser.title}</h1>
                <p className="flex text-sm text-gray-500 w-full">
                  <Link
                    href={`https://warpcast.com/${fundraiser.fundraiserAddress.farcaster}`}
                    className="flex items-center gap-2"
                  >
                    {fundraiser.fundraiserAddress.farcaster}
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Share2 className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <EyeOff className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="text-md font-bold text-teal-600 mt-3">
              {Number(raised).toFixed(4)} ETH
            </div>
            <div className="text-sm text-gray-600">
              raised of {fundraiser.goal.toFixed(4)} ETH goal
            </div>
            <div className="mt-4 flex items-center gap-2 mb-6">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500">
                Campaign still ongoing <span className="ml-1">✅</span>
              </span>
            </div>

            {fundraiser.goal > Number(raised) ? (
              <div className="bg-red-50 text-red-600 py-2 px-3 rounded-none text-center text-xs font-medium border border-red-100">
                Goal not reached yet — Help make a difference!
              </div>
            ) : (
              <div className="bg-emerald-50 text-emerald-600 py-2 px-3 rounded-none text-center text-sm font-medium border border-emerald-100">
                {`Goal reached! Thank you! ${Number(raised).toFixed(1)}% of goal reached`}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Donations */}
      <DonationSection />

      {/* Campaign Details */}
      <Tabs defaultValue="about" className="w-full mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">About Rosalie</h2>
              <p className="text-gray-600 mb-4">
                Rosalie is a 9-year old girl living with Rett syndrome. She is
                unable to walk or stand unaided and has limited use of her
                hands.
              </p>
              <p className="text-gray-600 mb-6">
                Funds will go towards buying Rosalie a hiking cart, allowing her
                to experience the outdoors with her family.
              </p>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-2">Donation Address</h3>
                <div className="flex items-center gap-2">
                  {fundraiser.fundraiserAddress.ensName ? (
                    <>
                      {" "}
                      <code className="text-sm bg-white p-1 rounded">
                        {fundraiser.fundraiserAddress.ensName}
                      </code>
                      <Link href={fundraiser.fundraiserAddress.ensName}>
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </>
                  ) : (
                    <code className="text-sm bg-white px-2 py-1 rounded">
                      {fundraiser.fundraiserAddress.address}
                    </code>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="updates" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-gray-500">No updates yet</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="donations" className="mt-4">
          <DonationFeed transactions={transactions} />
        </TabsContent>
      </Tabs>

      <div className="mt-8 mb-4">
        <Badge variant="secondary" className="bg-black/80 text-white px-4 py-2">
          🚧 Beta - Support Rosalie's Campaign
        </Badge>
      </div>
    </div>
  );
}
