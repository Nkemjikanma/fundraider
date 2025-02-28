"use client";

import type { Transaction } from "@/lib/wallet-api";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

// interface TransactionFeedProps {
// 	transactions: Transaction[];
// 	loading: boolean;
// }

// { transactions, loading }: TransactionFeedProps
export function DonationFeed() {
	const transactions = [];
	const loading = false;

	if (loading) {
		return (
			<div className="flex justify-center p-8">
				<div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	if (transactions.length === 0) {
		return (
			<div className="text-center p-8 border rounded-lg">
				<p className="text-gray-500">No transactions yet</p>
			</div>
		);
	}

	return (
		<div className="border rounded-lg overflow-hidden">
			<div className="bg-gray-50 p-3 border-b">
				<h3 className="font-medium">Recent Donations</h3>
			</div>
			<ul className="divide-y">
				{transactions.map((tx, index) => (
					<motion.li
						key={tx.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1 }}
						className="p-3"
					>
						<div className="flex justify-between items-start">
							<div>
								<p className="font-medium truncate max-w-[180px]">
									{tx.from.slice(0, 6)}...{tx.from.slice(-4)}
								</p>
								<p className="text-sm text-gray-500">
									{formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}
								</p>
							</div>
							<div className="text-right">
								<p className="font-bold text-green-600">+{tx.amount.toFixed(4)}</p>
								<p className="text-xs text-gray-500">{tx.token}</p>
							</div>
						</div>
					</motion.li>
				))}
			</ul>
		</div>
	);
}
