export async function GET() {
  const appURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const config = {
    accountAssociation: {
      header:
        "eyJmaWQiOjQwNTk0MSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweEQxYTQxODBmN0Y5MmE3YjM5YjFlRUNDN0Q2MUU1NzNFOTY1QTVjRmMifQ",
      payload:
        "eyJkb21haW4iOiIyMzJlLTJhMDItYzdjLWE4OTItODkwMC0yZDI1LTUyZWItNDg0Mi1jZWRlLm5ncm9rLWZyZWUuYXBwIn0",
      signature:
        "MHgzZWJjMTlmOGVhODIxY2U0ZDI1Y2ExZGE3YzFjMWEwNjdhN2NlMDg0Njk1ZTIyYzA0MjBkYjJkZDkzNzRjYjBiNTA1YWM0N2U3NjIyYTIwN2Q0MDNjYTU4OTkwMWI3ZDRiMjZjN2IxMzFhNTg4NDgxNDFlZGViN2U2ZDBhOTNkYTFi",
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
//     "payload": "eyJkb21haW4iOiIyMzJlLTJhMDItYzdjLWE4OTItODkwMC0yZDI1LTUyZWItNDg0Mi1jZWRlLm5ncm9rLWZyZWUuYXBwIn0",
//     "signature": "MHgzZWJjMTlmOGVhODIxY2U0ZDI1Y2ExZGE3YzFjMWEwNjdhN2NlMDg0Njk1ZTIyYzA0MjBkYjJkZDkzNzRjYjBiNTA1YWM0N2U3NjIyYTIwN2Q0MDNjYTU4OTkwMWI3ZDRiMjZjN2IxMzFhNTg4NDgxNDFlZGViN2U2ZDBhOTNkYTFi"
//   },
//   "frame": {
//     "version": "1",
//     "name": "Example Frame",
//     "iconUrl": "https://232e-2a02-c7c-a892-8900-2d25-52eb-4842-cede.ngrok-free.app/icon.png",
//     "homeUrl": "https://232e-2a02-c7c-a892-8900-2d25-52eb-4842-cede.ngrok-free.app",
//     "imageUrl": "https://232e-2a02-c7c-a892-8900-2d25-52eb-4842-cede.ngrok-free.app/image.png",
//     "buttonTitle": "Check this out",
//     "splashImageUrl": "https://232e-2a02-c7c-a892-8900-2d25-52eb-4842-cede.ngrok-free.app/splash.png",
//     "splashBackgroundColor": "#eeccff",
//     "webhookUrl": "https://232e-2a02-c7c-a892-8900-2d25-52eb-4842-cede.ngrok-free.app/api/webhook"
//   }
// }
