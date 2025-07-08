import * as React from "react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { type ThemeConfig } from "../../lib/utils";

interface WalletHeaderProps {
  theme: ThemeConfig;
  onThemeSwitch?: () => void;
  className?: string;
}

export const WalletHeader: React.FC<WalletHeaderProps> = ({
  theme,
  onThemeSwitch,
  className,
}) => {
  return (
    <div className={cn("text-center", className)}>
      <div className="flex items-center justify-center space-x-3 mb-4">
        {theme.logo ? (
          <img
            src={theme.logo}
            alt="Logo"
            className="h-8 w-8 rounded"
            width={32}
            height={32}
          />
        ) : (
          <div className="h-8 w-8 bg-primary text-primary-foreground rounded flex items-center justify-center font-bold text-sm">
            {theme.theme === "solana" ? "S" : theme.theme === "ton" ? "T" : "C"}
          </div>
        )}
        <h1 className="text-xl font-semibold">
          {theme.brandName || `${theme.theme.toUpperCase()} Wallet`}
        </h1>
      </div>
      
      {onThemeSwitch && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onThemeSwitch}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Switch to {theme.theme === "solana" ? "TON" : "Solana"}
        </Button>
      )}
    </div>
  );
};