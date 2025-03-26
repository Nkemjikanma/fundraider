export async function GET() {
  const appURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const config = {
    accountAssociation: {
      header:
        "eyJmaWQiOjQwNTk0MSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweEQxYTQxODBmN0Y5MmE3YjM5YjFlRUNDN0Q2MUU1NzNFOTY1QTVjRmMifQ",
      payload:
        "eyJkb21haW4iOiIwMjNhLTJhMDItYzdjLWE4OTItODkwMC1jOWMtN2ExYy00MC1iODkwLm5ncm9rLWZyZWUuYXBwIn0",
      signature:
        "MHg1OTU2ODJjMGJjODYxMjNjMWFhZDUxNzNjOTlkOTMxMTJhYmE0MjU1NTdhYmVkMDJiOThiZTBkZDE2YmNmNDkwNGRjM2VjYzAzOTVkNzg4OTExZGZhNThmYzJhZDViNjg2ZjhjNGQzM2FiY2NmMWY1MjExNmU0YTU1ODk4MGQ2ZTFi",
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
//   "accountAssociation": {
//     "header": "eyJmaWQiOjQwNTk0MSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweEQxYTQxODBmN0Y5MmE3YjM5YjFlRUNDN0Q2MUU1NzNFOTY1QTVjRmMifQ",
//     "payload": "eyJkb21haW4iOiIwMjNhLTJhMDItYzdjLWE4OTItODkwMC1jOWMtN2ExYy00MC1iODkwLm5ncm9rLWZyZWUuYXBwIn0",
//     "signature": "MHg1OTU2ODJjMGJjODYxMjNjMWFhZDUxNzNjOTlkOTMxMTJhYmE0MjU1NTdhYmVkMDJiOThiZTBkZDE2YmNmNDkwNGRjM2VjYzAzOTVkNzg4OTExZGZhNThmYzJhZDViNjg2ZjhjNGQzM2FiY2NmMWY1MjExNmU0YTU1ODk4MGQ2ZTFi"
//   },
//   "frame": {
//     "version": "1",
//     "name": "Example Frame",
//     "iconUrl": "https://023a-2a02-c7c-a892-8900-c9c-7a1c-40-b890.ngrok-free.app/icon.png",
//     "homeUrl": "https://023a-2a02-c7c-a892-8900-c9c-7a1c-40-b890.ngrok-free.app",
//     "imageUrl": "https://023a-2a02-c7c-a892-8900-c9c-7a1c-40-b890.ngrok-free.app/image.png",
//     "buttonTitle": "Check this out",
//     "splashImageUrl": "https://023a-2a02-c7c-a892-8900-c9c-7a1c-40-b890.ngrok-free.app/splash.png",
//     "splashBackgroundColor": "#eeccff",
//     "webhookUrl": "https://023a-2a02-c7c-a892-8900-c9c-7a1c-40-b890.ngrok-free.app/api/webhook"
//   }
// }
