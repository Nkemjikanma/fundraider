import { useState } from "react";
import { useTransaction } from "wagmi";
import { Button } from "./ui/button";

interface TransactionFlowProps {
  amount: string;
  token: string;
  recipient: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export const TransactionFlow = ({
  amount,
  token,
  recipient,
  onConfirm,
  onClose,
}: TransactionFlowProps) => {
  const [step, setStep] = useState<"preview" | "confirming" | "complete">(
    "preview",
  );
  const [hash, setHash] = useState<string>();
  const [error, setError] = useState<string>();

  const { isLoading, isSuccess } = useTransaction({
    hash: hash as `0x${string}`,
  });

  const handleConfirm = async () => {
    try {
      setStep("confirming");
      await onConfirm();
      setStep("complete");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Transaction failed");
      setStep("preview");
    }
  };

  return (
    <div className="relative p-4 border rounded-none mt-2">
      {onClose && (
        <Button
          variant="ghost"
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ×
        </Button>
      )}
      {step === "preview" && (
        <div>
          <h3 className="font-bold">Confirm Transaction</h3>
          <div className="mt-2">
            <p>
              Amount: {amount} {token}
            </p>
            <p>To: {recipient}</p>
            {/* Add estimated gas fees here */}
          </div>
          <Button
            type="button"
            onClick={handleConfirm}
            className="bg-teal-500 hover:bg-teal-600 rounded-none mt-2"
          >
            Confirm
          </Button>
        </div>
      )}

      {step === "confirming" && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-2">Confirming transaction...</p>
        </div>
      )}

      {step === "complete" && (
        <div className="text-center text-green-600">
          <p>Transaction complete!</p>
          {/* Add transaction details and link to explorer */}
        </div>
      )}

      {error && (
        <div className="mt-2 p-2 bg-red-50 text-red-600 rounded">{error}</div>
      )}
    </div>
  );
};
