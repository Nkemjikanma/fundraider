"use client";
// import HomePage from "@/components/HomePage";
import type { Metadata } from "next";

import dynamic from "next/dynamic";

const HomePage = dynamic(() => import("@/components/HomePage"), { ssr: false });

export default function Home() {
  return (
    <main className="w-full min-h-screen border border-red-300 bg-[#D5C0A0]">
      <HomePage />
    </main>
  );
}
