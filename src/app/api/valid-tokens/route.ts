// import { getFundRaiderValidTokens } from "@/lib/utils";
import { NextResponse } from "next/server";

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const address = searchParams.get("address");

//     if (!address) {
//       return NextResponse.json(
//         { error: "Address parameter is required" },
//         { status: 400 },
//       );
//     }

//     const validTokens = await getFundRaiderValidTokens(address);
//     return NextResponse.json({ tokens: validTokens }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching valid tokens:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch valid tokens" },
//       { status: 500 },
//     );
//   }
// }
