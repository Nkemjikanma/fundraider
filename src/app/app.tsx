"use client";

import dynamic from "next/dynamic";

const FundRaider = dynamic(() => import("@/components/FundRaider.tsx"), { ssr: false });

export default function App() {
	return <FundRaider />;
}
