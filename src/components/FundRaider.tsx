"use client";
import { DonationFeed } from "@/components/DonationFeed";
import { Thermometer } from "@/components/Thermometer";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TOKENS } from "@/lib/constants";
import { useBalance } from "@/lib/hooks/useBalance";
import { useTransactions } from "@/lib/hooks/useTransactions";
import { useValidTokens } from "@/lib/hooks/useValidTokens";
import { fundraisers, getFundRaiderValidTokens } from "@/lib/utils";
import sdk from "@farcaster/frame-sdk";
import { Clock, ExternalLink, Share2, WalletIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { formatEther } from "viem";
import { parseEther } from "viem";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import {
  UsePrepareTransactionRequestParameters,
  useSendTransaction,
} from "wagmi";
import { Logo } from "./Logo";
import { TransactionFlow } from "./TransactionFlow";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
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
  const [showTransactionFlow, setShowTransactionFlow] = useState(false);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [selectedToken, setSelectedToken] = useState("ETH");
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

  const { data: validTokens, isLoading: isLoadingTokens } =
    useValidTokens(userAddress);

  const displayedValiedTokens =
    validTokens?.length === 0 ? [TOKENS[0]] : validTokens;

  console.log("token validest", displayedValiedTokens);

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
    (amount: number) => {
      setCustomAmount(amount.toString());
      setSelectedToken("ETH");
      console.log(`Donating ${amount} ${selectedToken}`);
    },
    [selectedToken],
  );

  const handleDonateClick = () => {
    if (!customAmount || !isConnected) return;
    setShowTransactionFlow(true);
  };

  const handleMaxClick = async () => {
    if (!userAddress) return;
    try {
      if (selectedToken === "ETH") {
        // For ETH, use the native balance
        const response = await fetch(
          `/api/token-balance?address=${userAddress}&token=${selectedToken}`,
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Failed to fetch balance");
        }

        const formattedBalance = data.balance;

        console.log("formattedBalance", formattedBalance);
        // Leave some ETH for gas
        const maxAmount =
          Number(formattedBalance) > 0.01
            ? (Number(formattedBalance) - 0.01).toString()
            : "0";

        setMaxAmount(formattedBalance);
        setCustomAmount(maxAmount);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const DonationSection = () => (
    <Card className="w-full mt-4">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Connected Wallet Info */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <WalletIcon className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium">Connected Wallet</span>
            </div>
            {isConnected ? (
              <code className="text-sm bg-white px-2 py-1 rounded">
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
                  className="w-full"
                >
                  {amount} ETH
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Amount Input */}
          <div className="space-y-2">
            <Label>Custom Amount</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <div className="relative flex items-center">
                  <Select
                    value={selectedToken}
                    onValueChange={setSelectedToken}
                    defaultValue={TOKENS[0].symbol}
                  >
                    {isLoadingTokens ? (
                      <SelectTrigger className="w-[100px] absolute left-0 z-10">
                        <SelectValue
                          placeholder="Loading..."
                          defaultValue={TOKENS[0].symbol}
                        />
                      </SelectTrigger>
                    ) : (
                      <SelectTrigger className="w-[100px] absolute left-0 z-10">
                        <SelectValue placeholder="Token" />
                      </SelectTrigger>
                    )}
                    <SelectContent>
                      {displayedValiedTokens !== undefined ? (
                        displayedValiedTokens.map((token) => (
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
                        ))
                      ) : (
                        <div>No tokens available</div>
                      )}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    inputMode="decimal"
                    placeholder="0.0"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="pl-[130px]"
                  />
                </div>
              </div>
              <Button
                onClick={handleDonateClick}
                disabled={
                  !isConnected ||
                  !customAmount ||
                  isPending ||
                  customAmount <= "0"
                }
                className="bg-teal-500 hover:bg-teal-600"
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
            <span>{maxAmount}</span> {/* Replace with actual balance */}
          </div>
        </div>
        {showTransactionFlow && (
          <TransactionFlow
            amount={customAmount}
            recipient={fundraiser.fundraiserAddress.address}
            onConfirm={async () => {
              try {
                await sendTransaction({
                  to: fundraiser.fundraiserAddress.address,
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
      <div className="mt-8 mb-4">
        <Badge variant="secondary" className="bg-black/80 text-white px-4 py-2">
          🚧 Beta - Support Rosalie's Campaign
        </Badge>
      </div>

      {/* Main Fundraiser Card */}
      <Card className="w-full relative mt-6">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{fundraiser.title}</h1>
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
            <Button variant="ghost" size="icon">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>

          <div className="mt-6 flex gap-1">
            <div className="flex-1">
              <Thermometer
                progress={(Number(raised) / fundraiser.goal) * 100}
                goal={fundraiser.goal}
                balance={Number(raised)}
              />
            </div>
            <div
              className="relative flex flex-col flex-3 w-full
              justify-between"
            >
              <div className="relative bg-teal-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-teal-600">
                  {Number(raised).toFixed(4)} ETH
                </div>
                <div className="text-sm text-gray-600">
                  raised of {fundraiser.goal.toFixed(4)} ETH goal
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">
                    Campaign ends in 30 days
                  </span>
                </div>
              </div>
              <div className="relative bg-gray-50 rounded-lg p-2 mt-3">
                {fundraiser.goal === Number(raised) ? (
                  <Badge
                    variant="secondary"
                    className="text-sm bg-green-600/80 text-white p-1"
                  >
                    Goal reached!
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="!text-sm bg-red-300 text-white p-1"
                  >
                    Goal not reached yet
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
                      <code className="text-sm bg-white py-1 rounded">
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
    </div>
  );
}
