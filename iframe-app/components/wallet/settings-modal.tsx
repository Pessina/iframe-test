import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Settings, Shield, Palette, Bell, HelpCircle } from "lucide-react";

interface SettingsModalProps {
  children?: React.ReactNode;
  onNetworkChange?: (network: string) => void;
  onNotificationToggle?: (enabled: boolean) => void;
  onSlippageChange?: (slippage: number) => void;
  currentNetwork?: string;
  notificationsEnabled?: boolean;
  slippageTolerance?: number;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  children,
  onNetworkChange,
  onNotificationToggle,
  onSlippageChange,
  currentNetwork = "devnet",
  notificationsEnabled = true,
  slippageTolerance = 0.5,
}) => {
  const [slippage, setSlippage] = React.useState(slippageTolerance);
  const [notifications, setNotifications] = React.useState(notificationsEnabled);

  const networks = [
    { id: "mainnet-beta", name: "Mainnet Beta", status: "active" },
    { id: "devnet", name: "Devnet", status: "active" },
    { id: "testnet", name: "Testnet", status: "deprecated" },
  ];

  const handleSlippageChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 50) {
      setSlippage(numValue);
      onSlippageChange?.(numValue);
    }
  };

  const handleNotificationToggle = () => {
    const newState = !notifications;
    setNotifications(newState);
    onNotificationToggle?.(newState);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Wallet Settings
          </DialogTitle>
          <DialogDescription>
            Manage your wallet preferences and security settings.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" className="text-xs">
              General
            </TabsTrigger>
            <TabsTrigger value="security" className="text-xs">
              Security
            </TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs">
              Advanced
            </TabsTrigger>
            <TabsTrigger value="about" className="text-xs">
              About
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize how your wallet looks and feels.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Dark
                    </Button>
                    <Button variant="ghost" size="sm">
                      Light
                    </Button>
                    <Button variant="ghost" size="sm">
                      Auto
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Control what notifications you receive.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Transaction Notifications</div>
                    <div className="text-sm text-muted-foreground">
                      Get notified when transactions complete
                    </div>
                  </div>
                  <Button
                    variant={notifications ? "default" : "outline"}
                    size="sm"
                    onClick={handleNotificationToggle}
                  >
                    {notifications ? "On" : "Off"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Network Settings
                </CardTitle>
                <CardDescription>
                  Choose which Solana network to connect to.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {networks.map((network) => (
                  <div
                    key={network.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          network.id === currentNetwork
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <div>
                        <div className="font-medium">{network.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {network.id}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {network.status === "deprecated" && (
                        <Badge variant="destructive" className="text-xs">
                          Deprecated
                        </Badge>
                      )}
                      <Button
                        variant={
                          network.id === currentNetwork ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => onNetworkChange?.(network.id)}
                        disabled={network.status === "deprecated"}
                      >
                        {network.id === currentNetwork ? "Connected" : "Connect"}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Transaction Settings</CardTitle>
                <CardDescription>
                  Advanced settings for transaction handling.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="slippage">Slippage Tolerance (%)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="slippage"
                      type="number"
                      value={slippage}
                      onChange={(e) => handleSlippageChange(e.target.value)}
                      min="0"
                      max="50"
                      step="0.1"
                      className="w-24"
                    />
                    <div className="flex gap-1">
                      {[0.1, 0.5, 1.0].map((preset) => (
                        <Button
                          key={preset}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSlippageChange(preset.toString())}
                        >
                          {preset}%
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Higher slippage tolerance allows larger price movements during
                    transactions
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  About This Wallet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Version</div>
                    <div className="text-muted-foreground">1.0.0</div>
                  </div>
                  <div>
                    <div className="font-medium">Network</div>
                    <div className="text-muted-foreground capitalize">
                      {currentNetwork}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Build</div>
                    <div className="text-muted-foreground">Development</div>
                  </div>
                  <div>
                    <div className="font-medium">Chain ID</div>
                    <div className="text-muted-foreground">
                      {currentNetwork === "mainnet-beta" ? "101" : "103"}
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    View on GitHub
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};