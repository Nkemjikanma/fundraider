"use client";

import type { AssetTransfersResult, AssetTransfersWithMetadataResult } from "alchemy-sdk";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

interface TransactionFeedProps {
  transactions?: AssetTransfersWithMetadataResult[];
  // loading: boolean;
}

// { transactions, loading }: TransactionFeedProps
export function DonationFeed({ transactions = [] }: TransactionFeedProps) {
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
    <div className="border overflow-hidden">
      <div className="bg-gray-50 p-3 border-b">
        <h3 className="font-medium">Recent Donations</h3>
      </div>
      <ul className="divide-y">
        {transactions.map((tx, index) => (
          <motion.li
            key={tx.uniqueId}
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
                  {formatDistanceToNow(new Date(tx.metadata.blockTimestamp), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">+{tx.value}</p>
                <p className="text-xs text-gray-500">{tx.asset}</p>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
