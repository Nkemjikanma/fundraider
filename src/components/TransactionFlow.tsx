import { fundraisers } from "@/lib/constants";
import { useState } from "react";
import { useTransaction } from "wagmi";
import { Button } from "./ui/button";

interface TransactionFlowProps {
	amount: string;
	token: string;
	recipient: string;
	onConfirm: () => Promise<void>;
	isConfirmed: boolean;
	isConfirming: boolean;
	linkToBaseScan: () => void;
	onClose: () => void;
}

export const TransactionFlow = ({
	amount,
	token,
	recipient,
	onConfirm,
	isConfirmed,
	isConfirming,
	linkToBaseScan,
	onClose,
}: TransactionFlowProps) => {
	const [step, setStep] = useState<"preview" | "confirming" | "error" | "complete">("preview");
	const [error, setError] = useState<string>();

	const handleConfirm = async () => {
		try {
			setError(undefined); // Clear any previous errors
			await onConfirm();
			if (isConfirming) {
				setStep("confirming");
			}

			if (isConfirmed) {
				setStep("complete");
			}
		} catch (e) {
			console.error("Transaction error:", e);
			setError(e instanceof Error ? e.message : "Transaction failed");
			setStep("error");
		}
	};

	return (
		<div className="relative p-4 border rounded-none mt-2">
			{step !== "confirming" && onClose && (
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
						<p>To: {fundraisers[0].fundraiserAddress.ensName}</p>
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

			{/*TODO: Why does this not render?  */}

			{step === "confirming" && (
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
					<p className="mt-2">
						<span className="animate-spin">⏳</span> Waiting for confirmation...
					</p>
				</div>
			)}

			{step === "complete" && (
				<div className="text-center text-green-600">
					<p>Transaction complete!</p>
					<button type="button" onClick={linkToBaseScan}>
						click to view transaction
					</button>
				</div>
			)}
			{step === "error" && (
				<div>
					<div className="mt-2 p-2 bg-red-50 text-red-600 rounded">
						Something went wrong. Please click button to try again.
					</div>
					<Button type="button" onClick={() => setStep("preview")} className="mt-2 w-full">
						Try Again
					</Button>
				</div>
			)}
		</div>
	);
};
