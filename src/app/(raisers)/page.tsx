"use client";
// import HomePage from "@/components/HomePage";
import type { Metadata } from "next";

import dynamic from "next/dynamic";

const HomePage = dynamic(() => import("@/components/HomePage"), { ssr: false });

export default function Home() {
  return (
    <main className="h-full w-full bg-transparent">
      <HomePage />
    </main>
  );
}
