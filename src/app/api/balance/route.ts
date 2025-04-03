import { publicClient } from "@/lib/client";
import { NextResponse } from "next/server";
import { formatEther } from "viem";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json(
        {
          error: "Missing address parameter",
        },
        { status: 400 },
      );
    }

    const balance = await publicClient.getBalance({
      address: address as `0x${string}`,
      blockTag: "latest",
    });

    return NextResponse.json(
      {
        balance: formatEther(BigInt(balance)),
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error fetching balance:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch balance",
      },
      { status: 500 },
    );
  }
}
