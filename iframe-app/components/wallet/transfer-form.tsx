import * as React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { CheckCircle, XCircle } from "lucide-react";

interface TransferFormProps {
  recipient: string;
  amount: string;
  isLoading: boolean;
  message: string;
  onRecipientChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onSubmit: () => void;
  className?: string;
}

export const TransferForm: React.FC<TransferFormProps> = ({
  recipient,
  amount,
  isLoading,
  message,
  onRecipientChange,
  onAmountChange,
  onSubmit,
  className,
}) => {
  const isSuccess = message.includes("✅");
  const isError = message.includes("❌");

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Send SOL</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recipient">Recipient Address</Label>
          <Input
            id="recipient"
            type="text"
            value={recipient}
            onChange={(e) => onRecipientChange(e.target.value)}
            placeholder="Enter wallet address"
            className="font-mono"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount (SOL)</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="0.0"
            step="0.001"
            min="0"
          />
        </div>

        <Button
          onClick={onSubmit}
          disabled={!recipient || !amount || isLoading}
          className="w-full"
          variant="secondary"
        >
          {isLoading ? "Sending..." : "Send SOL"}
        </Button>

        {message && (
          <Alert variant={isSuccess ? "success" : isError ? "destructive" : "default"}>
            {isSuccess && <CheckCircle className="h-4 w-4" />}
            {isError && <XCircle className="h-4 w-4" />}
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};