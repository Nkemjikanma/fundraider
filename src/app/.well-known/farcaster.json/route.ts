export async function GET() {
  const appURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const config = {
    accountAssociation: {
      header:
        "eyJmaWQiOjQwNTk0MSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweEQxYTQxODBmN0Y5MmE3YjM5YjFlRUNDN0Q2MUU1NzNFOTY1QTVjRmMifQ",
      payload: "eyJkb21haW4iOiJmdW5kcmFpZGVyLm5rZW0ud29ya2Vycy5kZXYifQ",
      signature:
        "MHg2YzhlNzIyYjU2MjE5ZDBiYWU1Nzk2ZmQ4ZjY1N2QzMTBiMzAxMzEwZDc4YmMzMWYzNDA4YTU5NjY5MWM5MmYzMDM2YzJhMTlhNjBjZTM2YjI2NDYxNzk2MjQ3ZTFhYjJjNjIwNzNhN2U3MGRmZDIzODM0MjA1OWQ3ZjJiMzhkOTFi",
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
//     "payload": "eyJkb21haW4iOiJmdW5kcmFpZGVyLm5rZW0ud29ya2Vycy5kZXYifQ",
//     "signature": "MHg2YzhlNzIyYjU2MjE5ZDBiYWU1Nzk2ZmQ4ZjY1N2QzMTBiMzAxMzEwZDc4YmMzMWYzNDA4YTU5NjY5MWM5MmYzMDM2YzJhMTlhNjBjZTM2YjI2NDYxNzk2MjQ3ZTFhYjJjNjIwNzNhN2U3MGRmZDIzODM0MjA1OWQ3ZjJiMzhkOTFi"
// 	,
//   "frame":
// 	("version");
// 	: "1",
//     "name": "Example Frame",
//     "iconUrl": "https://fundraider.nkem.workers.dev/icon.png",
//     "homeUrl": "https://fundraider.nkem.workers.dev",
//     "imageUrl": "https://fundraider.nkem.workers.dev/image.png",
//     "buttonTitle": "Check this out",
//     "splashImageUrl": "https://fundraider.nkem.workers.dev/splash.png",
//     "splashBackgroundColor": "#eeccff",
//     "webhookUrl": "https://fundraider.nkem.workers.dev/api/webhook"
// }
