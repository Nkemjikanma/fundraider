"use client";

import { MiniAppProvider } from "@/components/providers/MiniAppProvider";
import dynamic from "next/dynamic";

const WagmiProvider = dynamic(() => import("@/components/providers/Wagmi"));
// const MiniAppProvider = dynamic(() => import("@/components/providers/MiniAppProvider"))

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider>
      <MiniAppProvider>{children}</MiniAppProvider>
    </WagmiProvider>
  );
}
