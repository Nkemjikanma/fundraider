import { getAlchemyTransfers } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");
  const page = searchParams.get("page");

  if (!address) {
    return NextResponse.json(
      {
        error: "Missing address parameter",
      },
      { status: 400 },
    );
  }

  const pageKey = page ? page : undefined;

  try {
    const transfers = await getAlchemyTransfers(address, pageKey);

    return NextResponse.json(
      {
        transfers: {
          transfers: transfers.transfers,
          pageKey: transfers.transfers.pageKey,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching transfers:", error);
    return NextResponse.json(
      { error: "Failed to fetch transfers" },
      { status: 500 },
    );
  }
}
