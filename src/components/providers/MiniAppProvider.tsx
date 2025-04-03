import { appURL, fundraisers } from "@/lib/constants";
import { generateSignInNonce } from "@/lib/utils";
import {
  type Context,
  type FrameNotificationDetails,
  type SignIn,
  sdk,
} from "@farcaster/frame-sdk";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SafeArea } from "../SafeArea";

export type MiniAppContextType = {
  context: Context.FrameContext | undefined;
  isLoaded: boolean;
  isAdded: boolean;
  notificationDetails: FrameNotificationDetails | null;
  signInResult: SignIn.SignInResult | null;
  signInError: Error | undefined;
  addMiniApp: () => void;
  isValidFrameContext: boolean | null;
  // lastEvent: string;
  handleShare: (raised?: string, shareMessage?: string) => void;
};

const MiniAppContext = createContext<MiniAppContextType | undefined>(undefined);

export function MiniAppProvider({ children }: { children: React.ReactNode }) {
  const fundraiser = fundraisers[0];

  const [context, setContext] = useState<MiniAppContextType["context"]>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [notificationDetails, setNotificationDetails] =
    useState<FrameNotificationDetails | null>(null);
  const [signInResult, setSignInResult] =
    useState<MiniAppContextType["signInResult"]>(null);
  const [signInError, setSignInError] =
    useState<MiniAppContextType["signInError"]>();
  const [isValidFrameContext, setIsValidFrameContext] =
    useState<MiniAppContextType["isValidFrameContext"]>(null);

  const router = useRouter();

  const getSignInNonce = useCallback(async () => {
    const signInNonce = generateSignInNonce();

    if (!signInNonce) {
      throw new Error("Unable to generate nonce");
    }

    return signInNonce;
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const context = await sdk.context;

        if (context) {
          setIsValidFrameContext(true);
          setContext(context);
          setIsAdded(context.client.added);

          const nonce = await getSignInNonce();

          try {
            const signInResult = await sdk.actions.signIn({ nonce });
            setSignInResult(signInResult);
          } catch (error) {
            setSignInError(error as Error);
          }
        } else {
          setIsValidFrameContext(false);
        }

        await sdk.actions.ready();
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to load context:", error);
        setIsValidFrameContext(false);
      } finally {
        setIsLoaded(true);
      }
    };

    if (sdk && !isLoaded) {
      load();
    }

    return () => {
      sdk.removeAllListeners();
    };
    // run only once when page loads.
  }, []);

  const addMiniApp = useCallback(async () => {
    if (context?.client.added) {
      return;
    }

    try {
      sdk.actions.addFrame();

      // if (result.notificationDetails) {
      //   setIsAdded(true);
      //   await sendWelcomeNotification(result.notificationDetails);
      // }
    } catch (e: unknown) {
      if (
        typeof e === "object" &&
        e !== null &&
        "reason" in e &&
        (e.reason === "rejected_by_user" ||
          e.reason === "invalid_domain_manifest")
      ) {
        console.log(`Frame add rejected: ${e.reason}`);
      } else {
        console.log("Unknown error", e);
      }
    }
  }, [context?.client.added]);

  const handleShare = useCallback(
    async (raised?: string, shareMessage?: string) => {
      console.log("handleShare");
      const message = shareMessage
        ? shareMessage
        : `Let's help @rosaliesrainbow get her hiking cart. Support Rosalie's fundraiser!`;

      const shareSearchParams = new URLSearchParams({
        fundraiserId: fundraiser.id,
        raised: raised?.toString() ?? "0",
        // userId: (await sdk.context).user.fid.toString(),
        mt: "50",
        mb: "50",
        imageURL: encodeURIComponent(
          new URL("/rosalie.jpeg", appURL).toString(),
        ),
        ml: "50",
        mr: "50",
      });

      const url = `${appURL}/share?${shareSearchParams}`;

      if (!isValidFrameContext) {
        router.push(
          `https://warpcast.com/~/compose?text=${encodeURIComponent(message)}&embeds[]=${encodeURIComponent(url)}`,
        );
        return;
      }

      sdk.actions.openUrl(
        `https://warpcast.com/~/compose?text=${encodeURIComponent(message)}&embeds[]=${encodeURIComponent(url)}`,
      );
    },
    [fundraiser],
  );

  const value = useMemo(
    () => ({
      context,
      isLoaded,
      isAdded,
      notificationDetails,
      // lastEvent,
      signInResult,
      signInError,
      isValidFrameContext,
      addMiniApp,
      handleShare,
    }),
    [
      context,
      isLoaded,
      isAdded,
      notificationDetails,
      // lastEvent,
      signInResult,
      signInError,
      isValidFrameContext,
      addMiniApp,
      handleShare,
    ],
  );

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#D5C0A0]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500" />
      </div>
    );
  }

  return (
    <MiniAppContext.Provider value={value}>
      <SafeArea>{children}</SafeArea>
    </MiniAppContext.Provider>
  );
}

export function useMiniApp() {
  const context = useContext(MiniAppContext);

  if (context === undefined) {
    throw new Error("useMiniApp must be used within MiniAppProvider");
  }

  return context;
}
