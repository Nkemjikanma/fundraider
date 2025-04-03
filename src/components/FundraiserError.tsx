import { Button } from "@/components/ui/button";
import Link from "next/link";

export const FundraiserError = () => {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-[#D5C0A0] p-4">
			<div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
				<h2 className="text-2xl font-bold text-red-600 mb-4">Fundraiser Not Found</h2>
				<p className="text-gray-600 mb-6">Sorry, we couldn't find the fundraiser you're looking for.</p>
				<Link href="/">
					<Button className="bg-teal-500 hover:bg-teal-600 text-white">Return to Homepage</Button>
				</Link>
			</div>
		</div>
	);
};
