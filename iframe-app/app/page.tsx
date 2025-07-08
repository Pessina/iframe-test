'use client';

import { useEffect, useState, Suspense } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { useSearchParams } from 'next/navigation';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
  ThemeProvider,
  parseThemeFromUrl,
  WalletHeader,
  WalletInfo,
  TransferForm,
  WalletConnection,
  ConnectPrompt,
  useTheme
} from '@iframe-test/shared-components';

function HomePage() {
  const searchParams = useSearchParams();
  const { publicKey, sendTransaction, connected, wallet } = useWallet();
  const { connection } = useConnection();
  
  const [mounted, setMounted] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { theme, updateTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const newTheme = parseThemeFromUrl(searchParams);
    updateTheme(newTheme);
  }, [searchParams, mounted, updateTheme]);

  useEffect(() => {
    if (!mounted || !publicKey) {
      setBalance(null);
      return;
    }
    
    connection.getBalance(publicKey).then(balance => {
      setBalance(balance / LAMPORTS_PER_SOL);
    });
  }, [publicKey, connection, mounted]);

  // Send wallet connection status to parent
  useEffect(() => {
    if (!mounted) return;
    
    if (connected && publicKey) {
      window.parent.postMessage({
        type: 'wallet-connected',
        wallet: wallet?.adapter.name,
        publicKey: publicKey.toBase58()
      }, '*');
    } else {
      window.parent.postMessage({
        type: 'wallet-disconnected'
      }, '*');
    }
  }, [connected, publicKey, wallet, mounted]);

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
    const newTheme = theme.theme === 'solana' ? 'ton' : 'solana';
    
    // Send message to parent to handle the navigation
    window.parent.postMessage({
      type: 'navigate',
      theme: newTheme
    }, '*');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6">
        <div className="max-w-md mx-auto space-y-6">
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-md mx-auto space-y-6">
        
        <WalletHeader 
          theme={theme}
          onThemeSwitch={handleThemeSwitch}
        />

        <WalletConnection 
          connected={connected}
          walletName={wallet?.adapter.name}
        >
          <WalletMultiButton />
        </WalletConnection>

        {publicKey && (
          <WalletInfo 
            publicKey={publicKey.toBase58()}
            balance={balance}
          />
        )}

        {publicKey && (
          <TransferForm
            recipient={recipient}
            amount={amount}
            isLoading={isLoading}
            message={message}
            onRecipientChange={setRecipient}
            onAmountChange={setAmount}
            onSubmit={handleTransfer}
          />
        )}

        {!publicKey && (
          <ConnectPrompt />
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
      <ThemeProvider initialTheme={{ theme: 'solana', colors: { primary: '267 84% 81%', secondary: '142 69% 58%', background: '0 0% 4%', foreground: '0 0% 98%', muted: '0 0% 15%', accent: '267 84% 81%', border: '0 0% 20%', ring: '267 84% 81%' } }}>
        <HomePage />
      </ThemeProvider>
    </Suspense>
  );
}