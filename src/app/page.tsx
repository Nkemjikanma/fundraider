import Image from "next/image";
import App from "./app";
export const revalidate = 300;

const appURL = "https://fundraider.com";

const frame = {
	version: "next",
	imageUrl: `${appURL}/opengraph-image`,
	button: {
		title: "Donate now",
		action: {
			type: "launc_frame",
			name: "Fundraider",
			// splashImageUrl: ICON_IMG_URL,
			url: appURL,
			splashBackgroundColor: "#000000",
		},
	},
};
export async function generateMetadata() {
	return {
		title: "Fundraider",
		openGraph: {
			title: "Fundraider",
			description: "A V2 Frame for fundraising",
			url: "https://fundraider.com",
			siteName: "Fundraider",
		},
		other: {
			"fc:frame": JSON.stringify(frame),
		},
	};
}

export default function Home() {
	return <App />;
}
