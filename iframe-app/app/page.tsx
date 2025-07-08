'use client';

import { useEffect, useState, Suspense } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import WalletConnection from './components/WalletConnection';
import { useSearchParams } from 'next/navigation';

function HomePage() {
  const searchParams = useSearchParams();
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  
  const [theme, setTheme] = useState<'solana' | 'ton'>('solana');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const themeParam = searchParams.get('theme');
    const logoParam = searchParams.get('logo');

    if (themeParam === 'ton') setTheme('ton');
    if (logoParam) setLogoUrl(decodeURIComponent(logoParam));
  }, [searchParams]);

  useEffect(() => {
    if (publicKey) {
      // Get balance
      connection.getBalance(publicKey).then(balance => {
        setBalance(balance / LAMPORTS_PER_SOL);
      });
    } else {
      setBalance(null);
    }
  }, [publicKey, connection]);

  const handleTransfer = async () => {
    if (!publicKey || !recipient || !amount) return;

    setIsLoading(true);
    setMessage('');

    try {
      const recipientPubkey = new PublicKey(recipient);
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
          lamports,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      setMessage(`✅ Transfer successful: ${signature.slice(0, 8)}...`);
      
      // Send message to parent
      window.parent.postMessage({
        type: 'transaction-success',
        signature
      }, '*');
      
      // Clear form and refresh balance
      setRecipient('');
      setAmount('');
      setTimeout(() => {
        if (publicKey) {
          connection.getBalance(publicKey).then(balance => {
            setBalance(balance / LAMPORTS_PER_SOL);
          });
        }
      }, 1000);

    } catch (error) {
      setMessage(`❌ Transfer failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeSwitch = () => {
    const newTheme = theme === 'solana' ? 'ton' : 'solana';
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('theme', newTheme);
    
    window.parent.postMessage({
      type: 'navigate',
      url: newUrl.toString(),
      theme: newTheme
    }, '*');

    setTheme(newTheme);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-md mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-8 w-8 rounded" />
            ) : (
              <div className="h-8 w-8 bg-white text-black rounded flex items-center justify-center font-bold text-sm">
                {theme === 'solana' ? 'S' : 'T'}
              </div>
            )}
            <h1 className="text-xl font-semibold">
              {theme === 'solana' ? 'Solana' : 'TON'} Wallet
            </h1>
          </div>
          
          <button
            onClick={handleThemeSwitch}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Switch to {theme === 'solana' ? 'TON' : 'Solana'}
          </button>
        </div>

        {/* Wallet Connection */}
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <WalletConnection />
        </div>

        {/* Wallet Info */}
        {publicKey && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-semibold mb-3">Wallet Info</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Address:</span>
                <span className="font-mono">
                  {publicKey.toBase58().slice(0, 6)}...{publicKey.toBase58().slice(-6)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Balance:</span>
                <span className="font-semibold">
                  {balance !== null ? `${balance.toFixed(4)} SOL` : 'Loading...'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Transfer Form */}
        {publicKey && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-semibold mb-4">Send SOL</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Recipient Address</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Enter wallet address"
                  className="w-full p-3 bg-muted border border-border rounded-lg text-foreground focus:border-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Amount (SOL)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  step="0.001"
                  className="w-full p-3 bg-muted border border-border rounded-lg text-foreground focus:border-white focus:outline-none"
                />
              </div>

              <button
                onClick={handleTransfer}
                disabled={!recipient || !amount || isLoading}
                className="w-full p-3 bg-success text-white rounded-lg font-medium hover:bg-success/90 disabled:bg-secondary disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Sending...' : 'Send SOL'}
              </button>

              {message && (
                <div className={`p-3 rounded-lg text-sm ${
                  message.includes('✅') 
                    ? 'bg-success/20 text-success border border-success/30' 
                    : 'bg-danger/20 text-danger border border-danger/30'
                }`}>
                  {message}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Connect Prompt */}
        {!publicKey && (
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <p className="text-muted-foreground mb-4">
              Connect your wallet to view balance and send transactions
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    }>
      <HomePage />
    </Suspense>
  );
}