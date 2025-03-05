export async function GET() {
  const appURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const config = {
    accountAssociation: {
      header:
        "eyJmaWQiOjQwNTk0MSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweEQxYTQxODBmN0Y5MmE3YjM5YjFlRUNDN0Q2MUU1NzNFOTY1QTVjRmMifQ",
      payload:
        "eyJkb21haW4iOiJiMWM5LTJhMDItYzdjLWE4OTItODkwMC1mMDQzLTNlM2YtOGNkOS02ZWMyLm5ncm9rLWZyZWUuYXBwIn0",
      signature:
        "MHgxYjU2YTJiNzYxNmFhNzFiN2NhNjA2NzIwZWMwM2E1OTUzMzFjZTI2Zjk2MGFkZjNjOWU0N2ZiNDVmYzhmOTVjMDMyY2U4Y2UyYTg0NzAzODhiMzAwYjhlNGQ0YzYwMGU3ZDI2OWI1N2ZhMzVkYjJiMDkzZjc1N2JhYzcwNGJjNTFi",
    },
    frame: {
      version: "1",
      name: "FundRaider",
      iconUrl: `${appURL}/fundraider_logo.webp`,
      homeUrl: `${appURL}`,
      imageUrl: `${appURL}/fundraider_logo.webp`,
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
//     "payload": "eyJkb21haW4iOiJiMWM5LTJhMDItYzdjLWE4OTItODkwMC1mMDQzLTNlM2YtOGNkOS02ZWMyLm5ncm9rLWZyZWUuYXBwIn0",
//     "signature": "MHgxYjU2YTJiNzYxNmFhNzFiN2NhNjA2NzIwZWMwM2E1OTUzMzFjZTI2Zjk2MGFkZjNjOWU0N2ZiNDVmYzhmOTVjMDMyY2U4Y2UyYTg0NzAzODhiMzAwYjhlNGQ0YzYwMGU3ZDI2OWI1N2ZhMzVkYjJiMDkzZjc1N2JhYzcwNGJjNTFi"
// 	,
//   "frame":
// 	("version");
// 	: "1",
//     "name": "Example Frame",
//     "iconUrl": "https://b1c9-2a02-c7c-a892-8900-f043-3e3f-8cd9-6ec2.ngrok-free.app/icon.png",
//     "homeUrl": "https://b1c9-2a02-c7c-a892-8900-f043-3e3f-8cd9-6ec2.ngrok-free.app",
//     "imageUrl": "https://b1c9-2a02-c7c-a892-8900-f043-3e3f-8cd9-6ec2.ngrok-free.app/image.png",
//     "buttonTitle": "Check this out",
//     "splashImageUrl": "https://b1c9-2a02-c7c-a892-8900-f043-3e3f-8cd9-6ec2.ngrok-free.app/splash.png",
//     "splashBackgroundColor": "#eeccff",
//     "webhookUrl": "https://b1c9-2a02-c7c-a892-8900-f043-3e3f-8cd9-6ec2.ngrok-free.app/api/webhook"
// }
