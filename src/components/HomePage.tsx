"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { appURL } from "@/lib/constants";
import { fundraisers } from "@/lib/constants";
import { getWalletBalance } from "@/lib/services";
import sdk, { type FrameNotificationDetails } from "@farcaster/frame-sdk";
import { Clock, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { SplashContainer } from "./SplashContainer";

export default function HomePage() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [raised, setRaised] = useState<string | undefined>("0");
  const [totalRaised, setTotalRaised] = useState<string>("0");

  const [addFrameResult, setAddFrameResult] = useState("");
  const [isAdded, setIsAdded] = useState(false);
  const [notificationDetails, setNotificationDetails] =
    useState<FrameNotificationDetails | null>(null);
  const router = useRouter();

  const fundraiser = fundraisers[0];

  useEffect(() => {
    const addedCheck = async () => {
      if ((await sdk.context)?.client.added) {
        setIsAdded(true);
      }
    };

    addedCheck();
  }, []);

  useEffect(() => {
    const load = async () => {
      await sdk.actions.ready();
    };

    if (sdk && !isSDKLoaded) {
      load();
      setIsSDKLoaded(true);
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded]);

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

  const addFrame = useCallback(async () => {
    if ((await sdk.context).client.added || isAdded) {
      return;
    }

    try {
      const result = await sdk.actions.addFrame();

      if (result.notificationDetails) {
        setIsAdded(true);
        await sendWelcomeNotification(result.notificationDetails);
      }
    } catch (e: unknown) {
      if (
        typeof e === "object" &&
        e !== null &&
        "reason" in e &&
        (e.reason === "rejected_by_user" ||
          e.reason === "invalid_domain_manifest")
      ) {
        console.log(`Frame add rejected: ${e.reason}`);
      } else {
        console.log("Unknown error", e);
      }
    }
  }, [isAdded]);

  const sendWelcomeNotification = async (
    notificationDetails: FrameNotificationDetails,
  ) => {};

  if (!isSDKLoaded) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#D5C0A0]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500" />
      </div>
    );
  }

  const handleShare = async (shareMessage?: string) => {
    console.log("handleShare");
    const message = shareMessage
      ? shareMessage
      : `Let's  help @${fundraiser.fundraiserAddress.farcaster} get her hiking cart. Support Rosalie's fundraiser!`;

    const shareSearchParams = new URLSearchParams({
      fundraiserId: fundraiser.id,
      raised: raised?.toString() ?? "0",
      // userId: (await sdk.context).user.fid.toString(),
      mt: "50",
      mb: "50",
      imageURL: encodeURIComponent(new URL("/rosalie.jpeg", appURL).toString()),
      ml: "50",
      mr: "50",
    });

    const url = `${appURL}/share?${shareSearchParams}`;

    if (!(await sdk.context)?.user) {
      console.log("here");
      router.push(
        `https://warpcast.com/~/compose?text=${encodeURIComponent(
          message,
        )}&embeds[]=${encodeURIComponent(url)}`,
      );
      return;
    }

    sdk.actions.openUrl(
      `https://warpcast.com/~/compose?text=${encodeURIComponent(
        message,
      )}&embeds[]=${encodeURIComponent(url)}`,
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center max-w-md min-w-96 mx-auto p-4 bg-[#D5C0A0]">
      <SplashContainer>
        <Image
          src="/fundraider_logo.webp"
          width={200}
          height={200}
          alt="Fundraiser Logo"
        />

        {/* Beta Badge */}
        <div className="relative flex w-full justify-center mt-6 mb-8">
          <Badge
            variant="secondary"
            className="rounded-none bg-black/80 text-white px-4 py-2 border-1 border-white"
          >
            🚧 Beta - Currently focusing on Rosalie's Campaign
          </Badge>
        </div>

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
              <Card className="relative border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3),0_0_40px_rgba(0,0,0,0.1)] group-hover:bg-yellow-100/70 hover:shadow-teal-800 transition-all ">
                <CardHeader className="flex flex-row justify-between items-start">
                  <div>
                    <CardTitle>{fundraiser.title}</CardTitle>
                    <p className="text-sm text-gray-500">
                      by {fundraiser.creator}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      handleShare();
                    }}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
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
      </SplashContainer>
    </div>
  );
}
