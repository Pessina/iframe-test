"use client";

import { useEffect, useState } from "react";
import {
  useWhitelabel,
  WhitelabelControls,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Button,
} from "@iframe-test/shared-components";
import {
  Monitor,
  Smartphone,
  ExternalLink,
  CheckCircle,
  ArrowUpRight,
  Copy,
  Sparkles,
} from "lucide-react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [iframeUrl, setIframeUrl] = useState<string>("");

  // Use the simplified whitelabel hook
  const whitelabel = useWhitelabel("solana");

  const [walletInfo, setWalletInfo] = useState<{
    connected: boolean;
    publicKey?: string;
    wallet?: string;
  } | null>(null);
  const [lastTransaction, setLastTransaction] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Build iframe URL with whitelabel API
  useEffect(() => {
    if (!mounted) return;

    const params = whitelabel.toUrlParams();

    const baseUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "/iframe-app";

    setIframeUrl(`${baseUrl}?${params.toString()}`);

    // Listen for messages from iframe
    const handleMessage = (event: MessageEvent) => {
      // In production: verify origin
      // if (event.origin !== 'https://your-iframe-domain.com') return;

      const { type, ...data } = event.data;

      switch (type) {
        case "wallet-connected":
          setWalletInfo({
            connected: true,
            publicKey: data.publicKey,
            wallet: data.wallet,
          });
          break;
        case "wallet-disconnected":
          setWalletInfo({ connected: false });
          break;
        case "toggle-theme":
          const newTheme =
            whitelabel.config.theme === "dark" ? "light" : "dark";
          whitelabel.setTheme(newTheme);
          break;
        case "transaction-success":
          setLastTransaction(data.signature);
          setTimeout(() => setLastTransaction(null), 5000);
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [mounted, whitelabel]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-pulse text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Configuration Sidebar */}
          <div className="xl:col-span-2 space-y-6">
            <WhitelabelControls whitelabel={whitelabel} />

            {/* Status Cards */}
            <div className="space-y-4">
              {walletInfo?.connected && (
                <Card className="border-green-200 bg-green-50/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-green-900">
                            Wallet Connected
                          </h3>
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            {walletInfo.wallet}
                          </Badge>
                        </div>
                        <p className="text-sm text-green-700 font-mono">
                          {walletInfo.publicKey?.slice(0, 8)}...
                          {walletInfo.publicKey?.slice(-8)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {lastTransaction && (
                <Card className="border-blue-200 bg-blue-50/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <ArrowUpRight className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-blue-900">
                          Transaction Sent
                        </h3>
                        <p className="text-sm text-blue-700 font-mono">
                          {lastTransaction.slice(0, 12)}...
                          {lastTransaction.slice(-12)}
                        </p>
                      </div>
                      <Button size="sm" variant="outline" className="shrink-0">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Preview Area */}
          <div className="xl:col-span-3 space-y-6">
            {/* Device Selector */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Live Preview
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {whitelabel.config.theme || "light"} theme
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {whitelabel.config.brand?.name || "Default"}
                    </Badge>
                  </div>
                </div>
                <CardDescription>
                  Real-time preview of your whitelabeled iframe integration
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Desktop Preview */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-slate-600" />
                    <span className="font-medium text-sm">Desktop View</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    1920×1080
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="bg-slate-100 p-4">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden border">
                    {iframeUrl && (
                      <iframe
                        src={iframeUrl}
                        title="Desktop Preview"
                        className="w-full h-[600px] border-0"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals"
                        allow="clipboard-read; clipboard-write"
                        referrerPolicy="strict-origin-when-cross-origin"
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mobile Preview */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-slate-600" />
                    <span className="font-medium text-sm">Mobile View</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    375×667
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="bg-gradient-to-b from-slate-100 to-slate-200 p-8 flex justify-center">
                  <div className="relative">
                    {/* iPhone Frame */}
                    <div className="bg-black rounded-[2.5rem] p-2 shadow-2xl">
                      <div className="bg-slate-900 rounded-[2rem] p-1">
                        <div className="bg-white rounded-[1.75rem] overflow-hidden relative">
                          {/* Notch */}
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl z-10"></div>
                          <div style={{ width: "375px", height: "600px" }}>
                            {iframeUrl && (
                              <iframe
                                src={iframeUrl}
                                title="Mobile Preview"
                                className="w-full h-full border-0"
                                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals"
                                allow="clipboard-read; clipboard-write"
                                referrerPolicy="strict-origin-when-cross-origin"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Device Label */}
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                      <Badge variant="secondary" className="text-xs">
                        iPhone 14 Pro
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
