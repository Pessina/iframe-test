import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface WalletInfoProps {
  publicKey: string;
  balance: number | null;
  className?: string;
}

export const WalletInfo: React.FC<WalletInfoProps> = ({
  publicKey,
  balance,
  className,
}) => {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Wallet Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Address:</span>
          <span className="font-mono text-sm">{formatAddress(publicKey)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Balance:</span>
          <span className="font-semibold text-sm">
            {balance !== null ? `${balance.toFixed(4)} SOL` : "Loading..."}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};