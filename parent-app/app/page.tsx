"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [iframeUrl, setIframeUrl] = useState<string>("");
  const [theme, setTheme] = useState("solana");
  const [logoUrl, setLogoUrl] = useState("");
  const [brandName, setBrandName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#9945ff");
  const [secondaryColor, setSecondaryColor] = useState("#14f195");
  const [backgroundColor, setBackgroundColor] = useState("#0a0a0a");
  const [foregroundColor, setForegroundColor] = useState("#ffffff");
  const [walletInfo, setWalletInfo] = useState<{
    connected: boolean;
    publicKey?: string;
    wallet?: string;
  } | null>(null);
  const [lastTransaction, setLastTransaction] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Build iframe URL with query parameters
    const params = new URLSearchParams({
      theme,
      ...(logoUrl && { logo: encodeURIComponent(logoUrl) }),
      ...(brandName && { brandName: encodeURIComponent(brandName) }),
      primary: encodeURIComponent(primaryColor),
      secondary: encodeURIComponent(secondaryColor),
      background: encodeURIComponent(backgroundColor),
      foreground: encodeURIComponent(foregroundColor),
    });

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
        case "navigate":
          if (data.theme) {
            setTheme(data.theme);
          }
          break;
        case "transaction-success":
          setLastTransaction(data.signature);
          setTimeout(() => setLastTransaction(null), 5000);
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [theme, logoUrl, brandName, primaryColor, secondaryColor, backgroundColor, foregroundColor, mounted]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold mb-2 text-slate-900">
            iFrame dApp POC
          </h1>
          <p className="text-slate-600">
            Testing iframe integration requirements
          </p>
          <div className="h-px bg-slate-200 mt-4"></div>
        </header>

        {/* Configuration Panel */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Theme Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="solana">Solana</option>
                <option value="ton">TON</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Brand Name</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Custom Wallet"
                className="w-full p-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Logo URL</label>
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://cryptologos.cc/logos/solana-sol-logo.png"
                className="w-full p-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Primary Color</label>
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-full p-1 border rounded-lg h-10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Secondary Color</label>
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-full p-1 border rounded-lg h-10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Background Color</label>
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-full p-1 border rounded-lg h-10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Text Color</label>
              <input
                type="color"
                value={foregroundColor}
                onChange={(e) => setForegroundColor(e.target.value)}
                className="w-full p-1 border rounded-lg h-10"
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mb-6 space-y-4">
          {walletInfo && walletInfo.connected && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <h3 className="font-semibold text-emerald-800">
                  Wallet Connected
                </h3>
              </div>
              <p className="text-sm text-emerald-700 mt-1">
                {walletInfo.wallet} • {walletInfo.publicKey?.slice(0, 8)}...
                {walletInfo.publicKey?.slice(-8)}
              </p>
            </div>
          )}

          {lastTransaction && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <h3 className="font-semibold text-blue-800">
                  Transaction Sent
                </h3>
              </div>
              <p className="text-sm text-blue-700 mt-1 font-mono">
                {lastTransaction.slice(0, 8)}...{lastTransaction.slice(-8)}
              </p>
            </div>
          )}
        </div>

        {/* iFrame */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-semibold text-sm text-gray-700">
              dApp iFrame - {theme.toUpperCase()} Theme
            </h2>
          </div>

          {iframeUrl && (
            <iframe
              src={iframeUrl}
              title="dApp POC"
              className="w-full h-[600px] border-0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals"
              allow="clipboard-read; clipboard-write"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          )}
        </div>
      </div>
    </div>
  );
}
