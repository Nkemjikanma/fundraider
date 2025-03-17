"use client";

import dynamic from "next/dynamic";

const WagmiProvider = dynamic(() => import("@/components/providers/Wagmi"));

export function Providers({ children }: { children: React.ReactNode }) {
	return <WagmiProvider>{children}</WagmiProvider>;
}
