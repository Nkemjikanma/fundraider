import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./Providers";
import "./globals.css";
import { PostHogProvider } from "./PHProvider";

const appURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const frame = {
  version: "next",
  // imageUrl: `${appURL}/og_fundraider.jpeg`,
  image: `${appURL}/og_fundraider.jpeg`,
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
      images: [{ url: `${appURL}/og_fundraider.jpeg` }],
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
      <body className="antialiased bg-[#D5C0A0]">
        <PostHogProvider>
          <Providers>{children}</Providers>
        </PostHogProvider>
      </body>
    </html>
  );
}
