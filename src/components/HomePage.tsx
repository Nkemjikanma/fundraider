"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fundraisers } from "@/lib/constants";
import { getWalletBalance } from "@/lib/services";
import sdk, { type FrameNotificationDetails } from "@farcaster/frame-sdk";
import { Clock, PlusIcon, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { SplashContainer } from "./SplashContainer";
import { useMiniApp } from "./providers/MiniAppProvider";

export default function HomePage() {
  const {
    context,
    signInResult,
    signInError,
    isValidFrameContext,
    isLoaded,
    handleShare,
    isAdded,
    addMiniApp,
  } = useMiniApp();
  const [raised, setRaised] = useState<string>("0");
  const [totalRaised, setTotalRaised] = useState<string>("0");

  const router = useRouter();

  const fundraiser = fundraisers[0];

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        // fetch each fundraiser balance
        const balanceResponse = await getWalletBalance(
          fundraisers[0].fundraiserAddress.address,
        );

        setRaised(balanceResponse.balance);

        // Total of all fundraisers on Fundraider
        const fetchTotalFundraids = fundraisers.map(
          async (fundraiser) =>
            await getWalletBalance(fundraiser.fundraiserAddress.address),
        );

        const allFundraids = await Promise.all(fetchTotalFundraids);

        const totalFundraids = allFundraids.reduce(
          (acc, { balance }) => acc + Number(balance),
          0,
        );

        const formattedTotalRaised = totalFundraids.toFixed(4);
        setTotalRaised(formattedTotalRaised);
      } catch (error) {
        console.error("Error fetching wallet balance:", error);
      }
    };

    fetchBalance();
  }, []);

  const sendWelcomeNotification = async (
    notificationDetails: FrameNotificationDetails,
  ) => {};

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#D5C0A0]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500" />
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col items-center max-w-md min-w-96 mx-auto p-4 bg-transparent">
      {/* Add frame button */}
      {isValidFrameContext && !isAdded && (
        <Button
          variant="ghost"
          size="sm"
          className="mb-2 rounded-none"
          onClick={() => {
            addMiniApp();
          }}
        >
          <PlusIcon />
          Add frame
        </Button>
      )}
      {/* Stats Section */}
      <div className="w-full grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total Raised</p>
            <h3 className="text-xl font-bold text-wrap">{totalRaised} ETH</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Active Campaigns</p>
            <h3 className="text-xl font-bold">{fundraisers.length}</h3>
          </CardContent>
        </Card>
      </div>

      <Button
        className="w-full my-4 bg-teal-700 hover:bg-teal-800 rounded-none"
        onClick={() => router.push("/create-fundraiser")}
        disabled
      >
        Create New Fundraiser
      </Button>

      <div className="relative w-full space-y-4">
        {fundraisers.map((fundraiser) => (
          <Link
            key={fundraiser.id}
            href={"/rosalie"}
            className="group hover:shadow-md"
          >
            <Card className="relative border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3),0_0_40px_rgba(0,0,0,0.1)] group-hover:bg-yellow-100/70 transition-all ">
              <CardHeader className="flex flex-row justify-between items-start">
                <div>
                  <CardTitle>{fundraiser.title}</CardTitle>
                  <p className="text-sm text-gray-500">
                    by {fundraiser.creator}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="relative flex flex-col items-center">
                <p className="text-gray-600 mb-4">{fundraiser.description}</p>

                <div className="flex gap-2 mb-2 w-full items-start">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">
                    {new Date(fundraiser.endDate).toDateString()}
                  </span>
                </div>

                <div className="flex flex-row w-full justify-between mt-2">
                  <div className="flex w-full justify-between items-center">
                    <span className="text-sm font-medium">
                      {Number(raised).toFixed(4)} ETH raised
                    </span>
                    <span className="text-sm text-gray-500">
                      Goal: {fundraiser.goal} ETH
                    </span>
                  </div>
                </div>
                <div className="relative w-full bg-gray-200 h-2.5">
                  <div
                    className="relative bg-teal-500 h-2.5"
                    style={{
                      width: `${(Number(raised) / fundraiser.goal) * 100}%`,
                    }}
                  />
                </div>

                <div className="group mt-4 w-1/2 group-hover:underline text-center">
                  View Details
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
