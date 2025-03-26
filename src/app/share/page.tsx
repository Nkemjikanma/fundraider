import { appURL } from "@/lib/constants";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SharePageProps = {
  // params:
  searchParams: Promise<{
    fundraiserId: string;
    raised: string;
    // userId: string;
    mt: string;
    mb: string;
    ml: string;
    mr: string;
  }>;
};

export async function generateMetadata({
  searchParams,
}: SharePageProps): Promise<Metadata> {
  try {
    const timestamp = Date.now();
    const { fundraiserId, raised, mt, mb, ml, mr } = await searchParams;
    const thermometerImageURL = `${appURL}/api/generate-thermometer?fundraiserId=${fundraiserId}&raised=${raised}&mt=${mt}&mb=${mb}&ml=${ml}&mr=${mr}&t=${timestamp}`;
    const frame = {
      version: "next",
      imageUrl: thermometerImageURL,
      button: {
        title: "Fund raid for rosalie",
        action: {
          type: "launch_frame",
          name: "Fundraider",
          splashImageUrl: `${appURL}/fundraider_logo.webp`,
          url: `${appURL}/${fundraiserId}`,
          splashBackgroundColor: "#D5C0A0",
        },
      },
    };

    return {
      other: {
        "fc:frame": JSON.stringify(frame),
        "fc:frame:cache": "no-cache",
      },
    };
  } catch (error) {
    console.error(error);
    return {
      title: "Error",
      description: "An error occurred while loading Fundraider",
    };
  }
}
export default function SharePage() {
  return <>Rosalie's Fundraider</>;
}
