import { TOKENS, alchemy } from "@/lib/constants";
import { getAlchemyTokenBalance } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");
  const token = searchParams.get("token");

  if (!address || !token) {
    return NextResponse.json(
      { error: "Missing address or token parameter" },
      { status: 400 },
    );
  }

  try {
    // if (token === "ETH" || token === "WETH") {
    //   const ethBalance = await alchemy.core.getTokensForOwner(address, {
    //     contractAddresses: [TOKENS[0].address],
    //   });

    //   return NextResponse.json({ balance: ethBalance?.tokens.filter(token => token.symbol === token) }, { status: 200 });
    // }
    const balance = await getAlchemyTokenBalance(address, token);

    // console.log("the balance", balance);

    return NextResponse.json({ balance: balance?.balance }, { status: 200 });
  } catch (error) {
    console.error("Error fetching token balance:", error);
    return NextResponse.json(
      { error: "Failed to fetch token balance" },
      { status: 500 },
    );
  }
}
