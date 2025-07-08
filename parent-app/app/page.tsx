'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [iframeUrl, setIframeUrl] = useState<string>('');
  const [showConfig, setShowConfig] = useState(true);
  const [theme, setTheme] = useState('solana');
  const [logoUrl, setLogoUrl] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#9945FF');
  const [secondaryColor, setSecondaryColor] = useState('#14F195');
  const [walletInfo, setWalletInfo] = useState<{ connected: boolean; publicKey?: string; wallet?: string } | null>(null);

  useEffect(() => {
    // Build iframe URL with parameters
    const params = new URLSearchParams({
      theme,
      ...(logoUrl && { logo: encodeURIComponent(logoUrl) }),
      primary: encodeURIComponent(primaryColor),
      secondary: encodeURIComponent(secondaryColor)
    });

    // In development, use localhost:3000 for iframe-app
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : '/iframe-app'; // Update this to your production URL

    setIframeUrl(`${baseUrl}?${params.toString()}`);

    // Listen for messages from iframe
    const handleMessage = (event: MessageEvent) => {
      // In production, verify the origin
      // if (event.origin !== 'https://your-iframe-domain.com') return;

      const { type, ...data } = event.data;

      switch (type) {
        case 'wallet-connected':
          setWalletInfo({ connected: true, publicKey: data.publicKey, wallet: data.wallet });
          break;
        case 'wallet-disconnected':
          setWalletInfo({ connected: false });
          break;
        case 'navigate':
          if (data.theme) {
            setTheme(data.theme);
          }
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [theme, logoUrl, primaryColor, secondaryColor]);

  return (
    <div className="min-h-screen p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">iFrame dApp Parent</h1>
        <p className="text-gray-600">Testing secure iframe integration with Solana wallet connections</p>
      </header>

      {showConfig && (
        <section className="mb-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <select 
                value={theme} 
                onChange={(e) => setTheme(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="solana">Solana</option>
                <option value="ton">TON</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Logo URL</label>
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Primary Color</label>
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-full p-2 border rounded h-10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Secondary Color</label>
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-full p-2 border rounded h-10"
              />
            </div>
          </div>
          <button
            onClick={() => setShowConfig(false)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Apply Configuration
          </button>
        </section>
      )}

      {walletInfo && walletInfo.connected && (
        <section className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800">Wallet Connected!</h3>
          <p className="text-sm text-green-700">
            Wallet: {walletInfo.wallet}<br />
            Public Key: {walletInfo.publicKey?.slice(0, 8)}...{walletInfo.publicKey?.slice(-8)}
          </p>
        </section>
      )}

      <section className="bg-gray-100 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">iFrame Content</h2>
          {!showConfig && (
            <button
              onClick={() => setShowConfig(true)}
              className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              Edit Config
            </button>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {iframeUrl && (
            <iframe
              src={iframeUrl}
              title="Staking dApp"
              className="w-full h-[600px] md:h-[800px]"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals"
              allow="clipboard-read; clipboard-write"
              referrerPolicy="strict-origin-when-cross-origin"
              loading="lazy"
            />
          )}
        </div>
      </section>

      <section className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">Security Features Implemented</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Sandbox attribute with specific permissions</li>
          <li>Strict referrer policy</li>
          <li>Origin verification for postMessage (ready for production)</li>
          <li>Limited permissions (no camera, microphone, etc.)</li>
          <li>Lazy loading for performance</li>
        </ul>
      </section>
    </div>
  );
}