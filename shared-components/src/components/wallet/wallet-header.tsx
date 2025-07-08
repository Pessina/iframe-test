// Legacy wallet header - deprecated, use direct JSX in iframe app instead
import * as React from "react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

interface WalletHeaderProps {
  theme?: any;
  onThemeSwitch?: () => void;
  className?: string;
}

export const WalletHeader: React.FC<WalletHeaderProps> = ({
  theme = {},
  onThemeSwitch,
  className,
}) => {
  return (
    <div className={cn("text-center", className)}>
      <div className="flex items-center justify-center space-x-3 mb-4">
        {theme.brand?.logo ? (
          <img
            src={theme.brand.logo}
            alt="Logo"
            className="h-8 w-8 rounded"
            width={32}
            height={32}
          />
        ) : (
          <div className="h-8 w-8 bg-primary text-primary-foreground rounded flex items-center justify-center font-bold text-sm">
            W
          </div>
        )}
        <h1 className="text-xl font-semibold">
          Wallet
        </h1>
      </div>
      
      {onThemeSwitch && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onThemeSwitch}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Switch Theme
        </Button>
      )}
    </div>
  );
};