"use client";

import dynamic from "next/dynamic";

const Fundraider = dynamic(() => import("../components/HomePage"), {
  ssr: false,
});

export default function App() {
  return <Fundraider />;
}
