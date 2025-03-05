"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { rosaliesAddress } from "@/lib/constants";
import { fundraisers, getAlchemyWalletBalance } from "@/lib/utils";
import sdk from "@farcaster/frame-sdk";
import type FrameContext from "@farcaster/frame-sdk";
import { Clock, Search, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatEther } from "viem";

export default function HomePage() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [raised, setRaised] = useState<string | undefined>("0");
  const [searchTerm, setSearchTerm] = useState("");
  const [totalRaised, setTotalRaised] = useState<string>("0");
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      sdk.actions.ready();
    };

    if (sdk && !isSDKLoaded) {
      load();
      setIsSDKLoaded(true);
    }
  }, [isSDKLoaded]);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        // fetch each fundraiser balance
        const balanceResponse = await fetch(
          `/api/balance?address=${fundraisers[0].fundraiserAddress.address}`,
        );

        const balanceData = await balanceResponse.json();

        if (!balanceResponse.ok) {
          throw new Error(balanceData.error || "Failed to fetch balance");
        }

        const formattedBalance = formatEther(BigInt(balanceData.balance));
        setRaised(formattedBalance);

        // Total of all fundraisers on Fundraider
        const fetchTotalFundraids = fundraisers.map((fundraiser) =>
          fetch(
            `/api/balance?address=${fundraiser.fundraiserAddress.address}`,
          ).then((res) => res.json()),
        );

        const allFundraids = await Promise.all(fetchTotalFundraids);

        const totalFundraids = allFundraids.reduce(
          (acc, { balance }) => acc + BigInt(balance),
          BigInt(0),
        );

        const formattedTotalRaised = Number(
          formatEther(totalFundraids),
        ).toFixed(4);
        setTotalRaised(formattedTotalRaised);
      } catch (error) {
        console.error("Error fetching wallet balance:", error);
      }
    };

    fetchBalance();
  }, []);

  console.log("Raised:", raised);
  if (!isSDKLoaded) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#D5C0A0]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center max-w-md min-w-96 mx-auto p-4 bg-[#D5C0A0]">
      <Image
        src="/fundraider_logo.webp"
        width={200}
        height={200}
        alt="Fundraiser Logo"
      />

      {/* Beta Badge */}
      <div className="relative flex w-full justify-center mt-6 mb-8">
        <Badge variant="secondary" className="bg-black/80 text-white px-4 py-2">
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
        className="w-full my-4 bg-teal-500 hover:bg-teal-600"
        onClick={() => router.push("/create-fundraiser")}
        disabled
      >
        Create New Fundraiser
      </Button>

      <div className="relative w-full space-y-4">
        {fundraisers.map((fundraiser) => (
          <Card
            key={fundraiser.id}
            className="relative hover:shadow-xl hover:shadow-teal-800 transition-shadow"
          >
            <CardHeader className="flex flex-row justify-between items-start">
              <div>
                <CardTitle>{fundraiser.title}</CardTitle>
                <p className="text-sm text-gray-500">by {fundraiser.creator}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  /* Add share logic */
                }}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{fundraiser.description}</p>

              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">
                  {new Date(fundraiser.endDate).toDateString()}
                </span>
              </div>

              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">
                  {Number(raised).toFixed(4)} ETH raised
                </span>
                <span className="text-sm text-gray-500">
                  Goal: {fundraiser.goal} ETH
                </span>
              </div>

              <div className="relative w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="relative bg-teal-500 h-2.5 rounded-full"
                  style={{
                    width: `${(Number(raised!).toFixed(4) / fundraiser.goal) * 100}%`,
                  }}
                />
              </div>

              <Link href={"/rosalie"}>
                <Button variant="link" className="mt-4 w-full">
                  View Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// bg-black text-white px-4 py-2

// <div className="w-full space-y-4 mb-6">
//      <div className="flex gap-2">
//        {/* <Input
//          placeholder="Search fundraisers..."
//          value={searchTerm}
//          onChange={(e) => setSearchTerm(e.target.value)}
//          className="flex-1"
//          icon={<Search className="w-4 h-4" />}
//        /> */}
//        {/* <Select value={currency} onValueChange={setCurrency}>
//          <SelectTrigger className="w-[100px]">
//            <SelectValue placeholder="Currency" />
//          </SelectTrigger>
//          <SelectContent>
//            <SelectItem value="ETH">ETH</SelectItem>
//            <SelectItem value="USDC">USDC</SelectItem>
//          </SelectContent>
//        </Select> */}
//      </div>

//      {/* <Select value={sortBy} onValueChange={setSortBy}>
//        <SelectTrigger className="w-full">
//          <SelectValue placeholder="Sort by" />
//        </SelectTrigger>
//        <SelectContent>
//          <SelectItem value="latest">Latest</SelectItem>
//          <SelectItem value="oldest">Oldest</SelectItem>
//          <SelectItem value="most-funded">Most Funded</SelectItem>
//          <SelectItem value="ending-soon">Ending Soon</SelectItem>
//        </SelectContent>
//      </Select> */}
//    </div>
