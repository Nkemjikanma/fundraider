import { getWalletValue } from "@/lib/services/wallet-value";
import { getTotalWalletBalance } from "@/lib/utils";
import { NextResponse } from "next/server";
import { formatEther } from "viem";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json(
        { error: "Missing address parameter" },
        { status: 400 },
      );
    }

    const walletValue = await getTotalWalletBalance(address);

    return NextResponse.json(walletValue, { status: 200 });
  } catch (e) {
    console.log("Error fetching wallet value", e);
    return NextResponse.json(
      {
        error: "Failed to fetch wallet value",
      },
      { status: 500 },
    );
  }
}
