import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThirdwebProvider } from "thirdweb/react";
import { Providers } from "./Providers";
import "./globals.css";

// export const metadata: Metadata = {
//   title: "Fundraider",
//   description: "A V2 Frame for fundraising",
// };

const appURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const frame = {
  version: "next",
  // imageUrl: `${appURL}/opengraph-image`,
  imageUrl: `${appURL}/fundraider_logo.webp`,
  image: `${appURL}/fundraider_logo.webp`,
  button: {
    title: "Fund raid",
    action: {
      type: "launch_frame",
      name: "Fundraider",
      splashImageUrl: `${appURL}/fundraider_logo.webp`,
      url: appURL,
      splashBackgroundColor: "#D5C0A0",
    },
  },
};

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(appURL),
    title: "Fundraider",
    description: "A V2 Frame for fundraising",
    openGraph: {
      title: "Fundraider",
      description: "A V2 Frame for fundraising",
      images: [{ url: `${appURL}/fundraider_logo.webp` }],
      url: appURL,
      siteName: "Fundraider",
      locale: "en_US",
      type: "website",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ThirdwebProvider>
          <Providers>{children}</Providers>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
