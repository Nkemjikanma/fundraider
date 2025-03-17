import { getAlchemyWalletBalance } from "@/lib/utils";
import { NextResponse } from "next/server";

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

    const balance = await getAlchemyWalletBalance(address);

    return NextResponse.json(
      {
        balance: balance._hex,
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
