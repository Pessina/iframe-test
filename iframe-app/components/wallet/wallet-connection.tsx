import * as React from "react";
import { Card, CardContent } from "../ui/card";
import { cn } from "../../lib/utils";

interface WalletConnectionProps {
  children: React.ReactNode;
  connected?: boolean;
  walletName?: string;
  className?: string;
}

export const WalletConnection: React.FC<WalletConnectionProps> = ({
  children,
  connected,
  walletName,
  className,
}) => {
  return (
    <Card className={cn("text-center", className)}>
      <CardContent className="p-6">
        <div className="wallet-connection">
          {children}
          {connected && walletName && (
            <div className="mt-3 text-sm text-muted-foreground">
              Connected with {walletName}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};