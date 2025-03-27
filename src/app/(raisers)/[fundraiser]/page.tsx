// "use client";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import FundRaider from "@/components/FundRaider";
import { FundraiserError } from "@/components/FundraiserError";
import { fundraisers } from "@/lib/constants";
import { notFound } from "next/navigation";

export default async function Home({
  params,
}: {
  params: Promise<{ fundraiser: string }>;
}) {
  const { fundraiser } = await params;

  console.log("params", fundraiser);

  const isValidFundraiser = fundraisers.some(
    (f) => f.id.toLowerCase() === fundraiser.toLowerCase(),
  );

  if (!isValidFundraiser) {
    notFound();
  }
  return (
    <div className="w-full bg-[#D5C0A0] min-h-screen">
      <ErrorBoundary fallback={<FundraiserError />}>
        <FundRaider param={fundraiser} />
      </ErrorBoundary>
    </div>
  );
}
