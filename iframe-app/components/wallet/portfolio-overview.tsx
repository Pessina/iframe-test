import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { TrendingUp, TrendingDown, Wallet, DollarSign } from "lucide-react";

interface Token {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  change24h: number;
  percentage: number;
}

interface PortfolioOverviewProps {
  totalValue: number;
  change24h: number;
  tokens: Token[];
  className?: string;
}

export const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({
  totalValue,
  change24h,
  tokens,
  className,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? "+" : ""}${percentage.toFixed(2)}%`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Portfolio Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Portfolio Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Total Value</span>
              </div>
              <div className="text-2xl font-bold">
                {formatCurrency(totalValue)}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                {change24h >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm text-muted-foreground">24h Change</span>
              </div>
              <div
                className={`text-xl font-semibold ${
                  change24h >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {formatPercentage(change24h)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Token Holdings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Token Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tokens.map((token) => (
              <div key={token.symbol} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">
                        {token.symbol.slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-sm">{token.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {token.symbol}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">
                      {formatCurrency(token.value)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {token.balance.toFixed(4)} {token.symbol}
                    </div>
                  </div>
                  <Badge
                    variant={token.change24h >= 0 ? "default" : "destructive"}
                    className="ml-2"
                  >
                    {formatPercentage(token.change24h)}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Portfolio Weight</span>
                    <span>{token.percentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={token.percentage} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};