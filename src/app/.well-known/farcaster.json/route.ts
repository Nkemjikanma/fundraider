export async function GET() {
  const appURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const config = {
    accountAssociation: {
      header:
        "eyJmaWQiOjQwNTk0MSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweEQxYTQxODBmN0Y5MmE3YjM5YjFlRUNDN0Q2MUU1NzNFOTY1QTVjRmMifQ",
      payload:
        "eyJkb21haW4iOiJmdW5kcmFpZGVyLm5rZW1qaWthb2hhbnllcmUud29ya2Vycy5kZXYifQ",
      signature:
        "MHgyMjFlMDY5ZWViOWE4ZWU2MWRiMGYwN2I4ZjE1MWMyZDg1ZTY4ZjhhYjZjZGY4ZDZmNTg5OTNhNDk0NDBjZTE4MmM5YTAwMjYwMTU5YzM0MTI4Yzg4NTkxMDA0MTk2ZDk0MWM1MTJlNDZlNjVlMmU4NzNjYzVmYzkzMmVmZjRjYzFj",
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
//     "payload": "eyJkb21haW4iOiJmdW5kcmFpZGVyLm5rZW1qaWthb2hhbnllcmUud29ya2Vycy5kZXYifQ",
//     "signature": "MHgyMjFlMDY5ZWViOWE4ZWU2MWRiMGYwN2I4ZjE1MWMyZDg1ZTY4ZjhhYjZjZGY4ZDZmNTg5OTNhNDk0NDBjZTE4MmM5YTAwMjYwMTU5YzM0MTI4Yzg4NTkxMDA0MTk2ZDk0MWM1MTJlNDZlNjVlMmU4NzNjYzVmYzkzMmVmZjRjYzFj"
//   },
//   "frame": {
//     "version": "1",
//     "name": "Example Frame",
//     "iconUrl": "https://fundraider.nkemjikaohanyere.workers.dev/icon.png",
//     "homeUrl": "https://fundraider.nkemjikaohanyere.workers.dev",
//     "imageUrl": "https://fundraider.nkemjikaohanyere.workers.dev/image.png",
//     "buttonTitle": "Check this out",
//     "splashImageUrl": "https://fundraider.nkemjikaohanyere.workers.dev/splash.png",
//     "splashBackgroundColor": "#eeccff",
//     "webhookUrl": "https://fundraider.nkemjikaohanyere.workers.dev/api/webhook"
//   }
// }
