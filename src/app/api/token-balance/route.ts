import { getAlchemyTokenBalance } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const address = searchParams.get("address");
	const tokenAddress = searchParams.get("tokenAddress");

	if (!address || !tokenAddress) {
		return NextResponse.json({ error: "Missing address or token parameter" }, { status: 400 });
	}

	try {
		const balance = await getAlchemyTokenBalance(address, tokenAddress);

		return NextResponse.json({ balance: balance?.balance }, { status: 200 });
	} catch (error) {
		console.error("Error fetching token balance:", error);
		return NextResponse.json({ error: "Failed to fetch token balance" }, { status: 500 });
	}
}
