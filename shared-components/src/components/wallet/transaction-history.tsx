import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ExternalLink, RefreshCw } from "lucide-react";

interface Transaction {
  signature: string;
  type: "send" | "receive";
  amount: number;
  timestamp: Date;
  status: "confirmed" | "pending" | "failed";
  recipient?: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  onRefresh?: () => void;
  isLoading?: boolean;
  className?: string;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  onRefresh,
  isLoading = false,
  className,
}) => {
  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatAmount = (amount: number, type: Transaction["type"]) => {
    const sign = type === "send" ? "-" : "+";
    return `${sign}${amount.toFixed(4)} SOL`;
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Transaction History</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="h-8 w-8 p-0"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {transactions.map((tx) => (
              <div
                key={tx.signature}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={getStatusColor(tx.status)} className="text-xs">
                      {tx.status}
                    </Badge>
                    <span className="text-sm capitalize text-muted-foreground">
                      {tx.type}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {formatAddress(tx.signature)}
                  </div>
                  {tx.recipient && (
                    <div className="text-xs text-muted-foreground">
                      To: {formatAddress(tx.recipient)}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div
                    className={`font-mono text-sm ${
                      tx.type === "send" ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {formatAmount(tx.amount, tx.type)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {tx.timestamp.toLocaleDateString()}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-8 w-8 p-0"
                  onClick={() => {
                    window.open(
                      `https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`,
                      "_blank"
                    );
                  }}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};