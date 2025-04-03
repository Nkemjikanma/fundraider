import Image from "next/image";
import { SplashContainer } from "./SplashContainer";
import { Badge } from "./ui/badge";

export const SafeArea = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col relative items-center max-w-md min-w-96 mx-auto p-4 bg-[#D5C0A0]">
      <SplashContainer>
        <Image
          src="/fundraider_logo.webp"
          width={200}
          height={200}
          alt="Fundraiser Logo"
        />

        {/* Beta Badge */}
        <div className="relative flex w-full justify-center mt-6 mb-8">
          <Badge
            variant="secondary"
            className="rounded-none bg-black/80 text-white px-4 py-2 border-1 border-white"
          >
            🚧 Beta - Currently focusing on Rosalie's Campaign
          </Badge>
        </div>
        {children}
      </SplashContainer>
    </div>
  );
};
