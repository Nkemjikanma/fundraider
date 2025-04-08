import { appURL, fundraisers } from "@/lib/constants";
import { generateSignInNonce } from "@/lib/utils";
import {
  AddFrame,
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

export type MiniAppContextType = {
  context: Context.FrameContext | undefined;
  isLoaded: boolean;
  isAdded: boolean;
  notificationDetails: FrameNotificationDetails | null;
  signInResult: SignIn.SignInResult | null;
  signInError: Error | undefined;
  addMiniApp: () => void;
  isValidFrameContext: boolean | null;
  lastEvent: string;
  handleShare: (raised?: string, shareMessage?: string) => void;
};

const MiniAppContext = createContext<MiniAppContextType | undefined>(undefined);

export function MiniAppProvider({ children }: { children: React.ReactNode }) {
  const fundraiser = fundraisers[0];

  const [context, setContext] = useState<MiniAppContextType["context"]>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [addFrameResult, setAddFrameResult] = useState("");
  const [notificationDetails, setNotificationDetails] =
    useState<FrameNotificationDetails | null>(null);
  const [signInResult, setSignInResult] =
    useState<MiniAppContextType["signInResult"]>(null);
  const [signInError, setSignInError] =
    useState<MiniAppContextType["signInError"]>();
  const [isValidFrameContext, setIsValidFrameContext] =
    useState<MiniAppContextType["isValidFrameContext"]>(null);
  const [lastEvent, setLastEvent] = useState("");

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

        sdk.on("frameAdded", ({ notificationDetails }) => {
          setLastEvent(
            `frameAdded${!!notificationDetails ? ", notifications enabled" : ""}`,
          );
          setIsAdded(true);
          if (notificationDetails) {
            setNotificationDetails(notificationDetails);
          }
        });

        sdk.on("frameAddRejected", ({ reason }) => {
          setLastEvent(`frameAddRejected, reason ${reason}`);
        });

        sdk.on("frameRemoved", () => {
          setLastEvent("frameRemoved");
          setIsAdded(false);
          setNotificationDetails(null);
        });

        sdk.on("notificationsEnabled", ({ notificationDetails }) => {
          setLastEvent("notificationsEnabled");
          setNotificationDetails(notificationDetails);
        });
        sdk.on("notificationsDisabled", () => {
          setLastEvent("notificationsDisabled");
          setNotificationDetails(null);
        });
      } catch (error) {
        console.error("Failed to load context:", error);
        setIsValidFrameContext(false);
      } finally {
        setIsLoaded(true);
      }
    };

    load();

    return () => {
      sdk.removeAllListeners();
    };
  }, [getSignInNonce]);

  const addMiniApp = useCallback(async () => {
    try {
      setNotificationDetails(null);

      const result = await sdk.actions.addFrame();

      if (result.notificationDetails) {
        setNotificationDetails(result.notificationDetails);
      }
      setAddFrameResult(
        result.notificationDetails
          ? `Added, got notificaton token ${result.notificationDetails.token} and url ${result.notificationDetails.url}`
          : "Added, got no notification details",
      );
    } catch (error) {
      if (error instanceof AddFrame.RejectedByUser) {
        setAddFrameResult(`Not added: ${error.message}`);
      }

      if (error instanceof AddFrame.InvalidDomainManifest) {
        setAddFrameResult(`Not added: ${error.message}`);
      }

      setAddFrameResult(`Error: ${error}`);
    }
  }, []);

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
    [fundraiser, isValidFrameContext],
  );

  const value = useMemo(
    () => ({
      context,
      isLoaded,
      isAdded,
      notificationDetails,
      lastEvent,
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
      lastEvent,
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
    <MiniAppContext.Provider value={value}>{children}</MiniAppContext.Provider>
  );
}

export function useMiniApp() {
  const context = useContext(MiniAppContext);

  if (context === undefined) {
    throw new Error("useMiniApp must be used within MiniAppProvider");
  }

  return context;
}
