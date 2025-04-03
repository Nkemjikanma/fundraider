export async function GET() {
	const appURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
	const thermometerImageURL = `${appURL}/api/generate-og`;

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
			iconUrl: "https://fundraider.xyz/og_fundraider.jpeg",
			homeUrl: "https://fundraider.xyz",
			imageUrl: "https://fundraider.xyz/og_fundraider.jpeg",
			buttonTitle: "Fund raid",
			splashImageUrl: "https://fundraider.xyz/fundraider_logo.webp",
			splashBackgroundColor: "#D5C0A0",
			webhookUrl: "https://fundraider.xyz/api/webhook",
		},
	};

	return Response.json(config);
}

// {
//   "accountAssociation": {
//     "header": "eyJmaWQiOjQwNTk0MSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweEQxYTQxODBmN0Y5MmE3YjM5YjFlRUNDN0Q2MUU1NzNFOTY1QTVjRmMifQ",
//     "payload": "eyJkb21haW4iOiJ3d3cuZnVuZHJhaWRlci54eXoifQ",
//     "signature": "MHhhMmIxNTZlZjJhNjcxMzJkNjI4N2NmY2ZlZDE0ODk2MDE0ZTQ0NzEzN2E5ZTUyYWU3ZjYyZjA2M2Y2ODU3ZTYzN2NkMzFkNDI4NzhhYWU0YmZiN2FiZjRhOWYxNzljOWViZjU3NjFiNmMzNjhmZWJjNjFiODZlMjliMTBlODIxZjFj"
//   },
//   "frame": {
//     "version": "1",
//     "name": "FundRaider",
//     "iconUrl": "https://fundraider.xyz/og_fundraider.jpeg",
//     "homeUrl": "https://fundraider.xyz",
//     "imageUrl": "https://fundraider.xyz/og_fundraider.jpeg",
//     "buttonTitle": "Fund raid",
//     "splashImageUrl": "https://fundraider.xyz/fundraider_logo.webp",
//     "splashBackgroundColor": "#D5C0A0",
//     "webhookUrl": "https://fundraider.xyz/api/webhook"
//   }
// }
