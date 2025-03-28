export async function GET() {
  const appURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const config = {
    accountAssociation: {
      header:
        "eyJmaWQiOjQwNTk0MSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweEQxYTQxODBmN0Y5MmE3YjM5YjFlRUNDN0Q2MUU1NzNFOTY1QTVjRmMifQ",
      payload: "eyJkb21haW4iOiJ3d3cuZnVuZHJhaWRlci54eXoifQ",
      signature:
        "MHhhMmIxNTZlZjJhNjcxMzJkNjI4N2NmY2ZlZDE0ODk2MDE0ZTQ0NzEzN2E5ZTUyYWU3ZjYyZjA2M2Y2ODU3ZTYzN2NkMzFkNDI4NzhhYWU0YmZiN2FiZjRhOWYxNzljOWViZjU3NjFiNmMzNjhmZWJjNjFiODZlMjliMTBlODIxZjFj",
    },
    frame: {
      version: "1",
      name: "FundRaider",
      iconUrl: `${appURL}/fundraider_logo_padded.webp`,
      homeUrl: `${appURL}`,
      imageUrl: `${appURL}/fundraider_logo_padded.webp`,
      buttonTitle: "Fund raid",
      splashImageUrl: `${appURL}/fundraider_logo.webp`,
      splashBackgroundColor: "#D5C0A0",
      webhookUrl: `${appURL}/api/webhook`,
    },
  };

  return Response.json(config);
}

// {
// 	("accountAssociation");
// 	:
// 	("header");
// 	: "eyJmaWQiOjQwNTk0MSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweEQxYTQxODBmN0Y5MmE3YjM5YjFlRUNDN0Q2MUU1NzNFOTY1QTVjRmMifQ",
//     "payload": "eyJkb21haW4iOiJ3d3cuZnVuZHJhaWRlci54eXoifQ",
//     "signature": "MHhhMmIxNTZlZjJhNjcxMzJkNjI4N2NmY2ZlZDE0ODk2MDE0ZTQ0NzEzN2E5ZTUyYWU3ZjYyZjA2M2Y2ODU3ZTYzN2NkMzFkNDI4NzhhYWU0YmZiN2FiZjRhOWYxNzljOWViZjU3NjFiNmMzNjhmZWJjNjFiODZlMjliMTBlODIxZjFj"
// 	,
//   "frame":
// 	("version");
// 	: "1",
//     "name": "Example Frame",
//     "iconUrl": "https://www.fundraider.xyz/icon.png",
//     "homeUrl": "https://www.fundraider.xyz",
//     "imageUrl": "https://www.fundraider.xyz/image.png",
//     "buttonTitle": "Check this out",
//     "splashImageUrl": "https://www.fundraider.xyz/splash.png",
//     "splashBackgroundColor": "#eeccff",
//     "webhookUrl": "https://www.fundraider.xyz/api/webhook"
// }
