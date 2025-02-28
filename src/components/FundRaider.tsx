import { DonationFeed } from "@/components/DonationFeed";
import { Thermometer } from "@/components/Thermometer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import sdk from "@farcaster/frame-sdk";
import { useCallback, useEffect, useState } from "react";

export default function FundRaider() {
	const [activeTab, setActiveTab] = useState("progress");
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		const load = async () => {
			sdk.actions.ready();
		};

		if (sdk && !isLoaded) {
			load();
			setIsLoaded(true);
		}
	}, [isLoaded]);

	if (!isLoaded) {
		return <div>Loading...</div>;
	}

	return (
		<div className="min-h-screen flex flex-col items-center max-w-md mx-auto">
			<h1>Fundraiser</h1>
			<p>This is a fundraiser page.</p>

			<Thermometer />

			<Tabs defaultValue="progress" className="w-full mt-4">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="transactions">Recent Donations</TabsTrigger>
					<TabsTrigger value="progress">Progress</TabsTrigger>
				</TabsList>
				<TabsContent value="progress" className="mt-4">
					<div className="p-4 border rounded-lg">
						<h2 className="text-xl font-semibold mb-2">About This Fundraiser</h2>
						<p className="mb-4">
							We're raising funds to support our cause. Every donation helps us get closer to our
							goal!
						</p>
						<div className="bg-gray-100 rounded-lg p-3 text-sm">
							<p className="font-medium">Wallet Address:</p>
							{/* <p className="text-xs break-all mt-1">{walletAddress}</p> */}
						</div>
					</div>
				</TabsContent>
				<TabsContent value="transactions" className="mt-4">
					<DonationFeed />
					{/* <TransactionFeed transactions={transactions} loading={loading} /> */}
				</TabsContent>
			</Tabs>
		</div>
	);
}
