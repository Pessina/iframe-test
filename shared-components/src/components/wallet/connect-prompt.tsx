import * as React from "react";
import { Card, CardContent } from "../ui/card";
import { cn } from "../../lib/utils";

interface ConnectPromptProps {
  message?: string;
  className?: string;
}

export const ConnectPrompt: React.FC<ConnectPromptProps> = ({
  message = "Connect your wallet to view balance and send transactions",
  className,
}) => {
  return (
    <Card className={cn("text-center", className)}>
      <CardContent className="p-6">
        <p className="text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
};