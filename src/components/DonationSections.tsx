import { config } from "@/components/providers/Wagmi";
import { TOKENS } from "@/lib/constants";
import type { Fundraiser, Token } from "@/lib/types";
import { WalletIcon } from "lucide-react";
import { useRef } from "react";
import { Farcaster } from "./Icons/Farcaster";
import { TransactionFlow } from "./TransactionFlow";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface DonationSectionProps {
  isConnected: boolean;
  userAddress: `0x${string}` | undefined;
  customAmount: string;
  setCustomAmount: (value: string) => void;
  selectedToken: Token;
  setSelectedToken: (token: Token) => void;
  handleDonateClick: () => Promise<void>;
  isSendTxPending: boolean;
  handleMaxClick: () => Promise<void>;
  showTransactionFlow: boolean;
  showQuickDonateError: boolean;
  handleQuickDonateButtons: (amount: number) => Promise<void>;
  // Additional props needed from parent
  disconnect: () => void;
  connect: (config: any) => void;
  fundraiser: Fundraiser;
  sendTx: () => Promise<void>;
  isConfirming: boolean;
  isConfirmed: boolean;
  linkToBaseScan: () => void;
  setShowTransactionFlow: (show: boolean) => void;
  handleShare: (message?: string) => void;
  isTransactionError: boolean;
}

const FIXED_AMOUNTS = [0.01, 0.05, 0.1, 0.25, 0.5, 1];

export const DonationSection = ({
  isConnected,
  userAddress,
  customAmount,
  setCustomAmount,
  selectedToken,
  setSelectedToken,
  handleDonateClick,
  isSendTxPending,
  handleMaxClick,
  showTransactionFlow,
  showQuickDonateError,
  handleQuickDonateButtons,
  disconnect,
  connect,
  fundraiser,
  sendTx,
  isConfirming,
  isConfirmed,
  linkToBaseScan,
  setShowTransactionFlow,
  handleShare,
  isTransactionError,
}: DonationSectionProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Card className="w-full mt-4 z-10">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Connected Wallet Info */}
          <div className="flex items-center justify-between p-3 bg-gray-50">
            <div className="flex items-center gap-2">
              <WalletIcon className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium">Connected Wallet</span>
            </div>
            {isConnected ? (
              <code className="text-sm bg-white px-2 py-1">
                {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}
              </code>
            ) : (
              <Button
                onClick={() =>
                  isConnected
                    ? disconnect()
                    : connect({ connector: config.connectors[0] })
                }
                variant="outline"
                size="sm"
              >
                Connect Wallet
              </Button>
            )}
          </div>

          {/* Fixed Amount Buttons */}
          <div className="space-y-2">
            <Label>Quick Donate</Label>
            <div className="grid grid-cols-3 gap-2">
              {FIXED_AMOUNTS.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  onClick={() => handleQuickDonateButtons(amount)}
                  className={`w-full rounded-none ${
                    !isConnected ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={!isConnected || !userAddress}
                >
                  {amount} ETH
                </Button>
              ))}
            </div>
            {showQuickDonateError && (
              <p className="text-red-500 text-xs">
                Not enough ETH in thy wallet <span className="ml-1">👎🏾</span>
              </p>
            )}
          </div>

          {/* Custom Amount Input */}
          <div className="space-y-2">
            <Label>Custom Amount</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <div className="relative flex items-center">
                  <Select
                    value={selectedToken.symbol}
                    onValueChange={(value) => {
                      setSelectedToken(
                        TOKENS.find((token) => token.symbol === value) ??
                          TOKENS[0],
                      );
                      setCustomAmount("0.0");
                    }}
                    defaultValue={TOKENS[0].symbol}
                  >
                    <SelectTrigger className="w-[100px] absolute left-0 z-10 rounded-none">
                      <SelectValue
                        placeholder="Token"
                        defaultValue={TOKENS[0].symbol}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {TOKENS.map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol}>
                          <div className="flex items-center gap-2">
                            <img
                              src={token.image}
                              alt={token.symbol}
                              className="w-4 h-4"
                            />
                            {token.symbol}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    ref={inputRef}
                    type="number"
                    inputMode="decimal"
                    placeholder="0.0"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        inputRef?.current?.blur();
                      }

                      if (
                        e.key === "Enter" &&
                        isConnected &&
                        customAmount &&
                        !isSendTxPending
                      ) {
                        handleDonateClick();
                      }
                    }}
                    className="pl-[130px] rounded-none"
                  />
                </div>
              </div>
              <Button
                onClick={handleDonateClick}
                disabled={
                  !isConnected ||
                  !customAmount ||
                  isSendTxPending ||
                  Number(customAmount) <= 0
                }
                className="bg-teal-500 hover:bg-teal-600 rounded-none"
              >
                {isConnected ? "Donate" : "Connect Wallet"}
              </Button>
            </div>
          </div>

          {/* Max Button and Balance */}
          <div className="flex justify-between items-center text-sm text-gray-500">
            <button
              type="button"
              disabled={!isConnected || !userAddress}
              onClick={handleMaxClick}
              className="text-teal-600 hover:text-teal-700"
            >
              Max
            </button>
          </div>
        </div>
        {showTransactionFlow && (
          <TransactionFlow
            amount={customAmount}
            token={selectedToken.symbol}
            recipient={fundraiser.fundraiserAddress.address}
            onConfirm={sendTx}
            isConfirming={isConfirming}
            isConfirmed={isConfirmed}
            linkToBaseScan={linkToBaseScan}
            onClose={() => setShowTransactionFlow(false)}
          />
        )}

        {/* // Transaction status */}
        <div>
          {isConfirming && (
            <div className="text-orange-500 text-center mt-4">
              ⏳ Waiting for confirmation...
            </div>
          )}

          {isConfirmed && (
            <div className="relative w-full flex flex-col items-center justify-center">
              <Button
                variant="link"
                className="text-green-500 text-center mt-4"
                onClick={() => linkToBaseScan()}
              >
                <p>🎉 Transaction Confirmed!</p>
                <p>Tap to View on Basescan</p>
              </Button>
              <Button
                variant="link"
                className="text-green-500 text-center mt-4"
                onClick={() => {
                  const message = `I just contributed to getting @${fundraiser.fundraiserAddress.farcaster} her hiking cart. You should too!`;
                  handleShare(message);
                }}
              >
                Share on <Farcaster />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
