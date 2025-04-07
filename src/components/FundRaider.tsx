"use client";
import { DonationFeed } from "@/components/DonationFeed";
import { Thermometer } from "@/components/Thermometer";
import { config } from "@/components/providers/Wagmi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TOKENS, fundraisers } from "@/lib/constants";
import { useBalance } from "@/lib/hooks/useBalance";
import { useTransactions } from "@/lib/hooks/useTransactions";
import type { Token } from "@/lib/types";
import sdk from "@farcaster/frame-sdk";
import { getBalance, injected } from "@wagmi/core";
import {
  ArrowLeft,
  Clock,
  ExternalLink,
  EyeOff,
  MousePointerClick,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { formatUnits, parseUnits } from "viem";
import { parseEther } from "viem";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

import { base } from "wagmi/chains";
import { DonationSection } from "./DonationSections";
import { useMiniApp } from "./providers/MiniAppProvider";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

export default function FundRaider({ param }: { param: string }) {
  const { handleShare, isLoaded, isAdded, context, isValidFrameContext } =
    useMiniApp();

  //TODO: get current fundraiser data using param
  const fundraiser = fundraisers[0];

  const [showQuickDonateError, setShowQuickDonateError] = useState(false);
  const [showTransactionFlow, setShowTransactionFlow] = useState(false);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [selectedToken, setSelectedToken] = useState<Token>(TOKENS[1]);
  const [txHash, setTxHash] = useState<string | null>(null);
  const { address: userAddress, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect } = useConnect();
  const { writeContractAsync } = useWriteContract();
  const router = useRouter();

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

  const isLoading = !isLoaded || isBalanceLoading || isTransactionsLoading;

  const raised = balanceData ? balanceData.balance : "0";
  const transactions = transactionsData?.transfers;

  const { isPending: isSendTxPending, sendTransaction } = useSendTransaction();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isTransactionError,
  } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
  });

  const linkToBaseScan = useCallback(() => {
    if (txHash) {
      sdk.actions.openUrl(`https://basescan.org/tx/${txHash}`);
    }
  }, [txHash]);

  const handleQuickDonateButtons = useCallback(
    async (amount: number) => {
      if (!userAddress) return;

      if (showTransactionFlow) {
        setShowTransactionFlow(false);
      }

      try {
        const ownerTokensWagmi = await getBalance(config, {
          address: userAddress,
          token: TOKENS[1].address as `0x${string}`,
          blockTag: "latest",
          chainId: base.id,
        });

        const formattedBalance = Number(
          formatUnits(ownerTokensWagmi.value, ownerTokensWagmi.decimals),
        );

        if (Number(formattedBalance) > Number(customAmount)) {
          setCustomAmount(Number(amount).toFixed(4).toString());
          setSelectedToken(TOKENS[1]);
          setShowTransactionFlow(true);
        } else {
          setShowQuickDonateError(true);
        }
      } catch (error) {
        console.error("Error fetching ETH balance:", error);
      }
    },
    [customAmount, userAddress, showTransactionFlow],
  );

  const handleDonateClick = async () => {
    if (!customAmount || !isConnected) return;

    setShowTransactionFlow(true);
  };

  const handleMaxClick = async () => {
    if (!userAddress) return;
    try {
      const balance = await getBalance(config, {
        address: userAddress,
        token: selectedToken.address as `0x${string}`,
        chainId: base.id,
      });

      const formattedBalance = formatUnits(balance.value, balance.decimals);

      setCustomAmount(Number(formattedBalance).toFixed(4).toString());
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const closeFrame = useCallback(() => {
    sdk.actions.close();
  }, []);

  const sendTx = useCallback(async () => {
    if (!userAddress) {
      connect({ chainId: base.id, connector: injected() });
    }

    try {
      if (selectedToken.symbol === "ETH") {
        sendTransaction(
          {
            to: fundraiser.fundraiserAddress.address as `0x${string}`,
            value: parseEther(customAmount),
          },
          {
            onSuccess: (hash) => {
              setTxHash(hash);
              setTimeout(() => {
                setShowTransactionFlow(false);
              }, 2000);
            },
            onError: (error) => {
              console.error("Transaction failed:", error);
              throw error;
            },
          },
        );
      } else {
        const data = writeContractAsync({
          address: selectedToken.address as `0x${string}`,
          chainId: base.id,
          functionName: "transfer",
          abi: [
            {
              inputs: [
                { name: "recipient", type: "address" },
                { name: "amount", type: "uint256" },
              ],
              name: "transfer",
              outputs: [{ name: "", type: "bool" }],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
          args: [
            fundraiser.fundraiserAddress.address as `0x${string}`,
            parseUnits(customAmount, selectedToken.decimals),
          ],
        });
        setTxHash(await data);
      }
    } catch (error) {
      console.error("Transaction failed:", error);
      throw error;
    }
  }, [sendTransaction, customAmount, fundraiser.fundraiserAddress.address]);

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
          size="sm"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative items-center max-w-md min-w-96 mx-auto p-4 bg-transparent">
      <div>
        <div
          onClick={() => router.push("/")}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              router.push("/");
            }
          }}
          className="relative flex flex-row items-center gap-2 text-gray-500 hover:text-gray-700 text-xl p-4 border ease-in transition-all py-1 hover:bg-zinc-200/70"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </div>
      </div>

      {/* Main Fundraiser Card */}
      <div className="mt-6 flex justify-between px-1 h-full relative">
        <div className="flex-1">
          <Thermometer />
        </div>
        <div className="relative flex flex-col flex-2 w-full mb-6">
          <div className="flex flex-col relative justify-between bg-[#F0DEC2] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3),0_0_40px_rgba(0,0,0,0.1)] h-full rounded-none p-3">
            <div className="flex flex-col relative">
              <div className="w-full flex flex-row justify-between items-start">
                <div className="relative flex flex-col items-start justify-start h-fit">
                  <div className="flex flex-row items-center gap-2 h-fit">
                    <h1 className="text-[16px] font-bold">
                      {fundraiser.title}
                    </h1>
                    <Button
                      onClick={() => {
                        const message = `Let's help @${fundraiser.fundraiserAddress.farcaster} get her hiking cart. Support Rosalie's fundraiser!`;
                        handleShare(raised, message);
                      }}
                      variant="ghost"
                      size="icon"
                    >
                      <Share2 className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" disabled>
                      <EyeOff className="w-3 h-3" />
                    </Button>
                  </div>

                  <p className="relative flex text-sm items-start justify-start">
                    <Button
                      variant="link"
                      onClick={async () =>
                        await sdk.actions.viewProfile({
                          fid: fundraiser.fundraiserAddress.fid,
                        })
                      }
                      className="relative flex flex-row items-center justify-center text-left h-fit text-amber-700 py-1"
                    >
                      {fundraiser.fundraiserAddress.farcaster}
                      <MousePointerClick className="w-3 h-3" />
                    </Button>
                  </p>
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
      <DonationSection
        isConnected={isConnected}
        userAddress={userAddress}
        customAmount={customAmount}
        setCustomAmount={setCustomAmount}
        selectedToken={selectedToken}
        setSelectedToken={setSelectedToken}
        handleDonateClick={handleDonateClick}
        isSendTxPending={isSendTxPending}
        handleMaxClick={handleMaxClick}
        showTransactionFlow={showTransactionFlow}
        showQuickDonateError={showQuickDonateError}
        handleQuickDonateButtons={handleQuickDonateButtons}
        disconnect={disconnect}
        connect={connect}
        fundraiser={fundraiser}
        sendTx={sendTx}
        isConfirming={isConfirming}
        isConfirmed={isConfirmed}
        linkToBaseScan={linkToBaseScan}
        setShowTransactionFlow={setShowTransactionFlow}
        handleShare={handleShare}
        raised={raised}
        isTransactionError={isTransactionError}
      />

      {/* Campaign Details */}
      <Tabs defaultValue="about" className="w-full mt-6 z-10">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="">
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

        <TabsContent value="updates" className="">
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-gray-500">No updates yet</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="donations" className="">
          <DonationFeed transactions={transactions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
