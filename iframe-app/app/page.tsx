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
  TransactionHistory,
  PortfolioOverview,
  SettingsModal,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Button,
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
  const [transactions, setTransactions] = useState([
    {
      signature: '5VfYJQKYGzGjdHHvv5YLRzTMZ8Mw9A7QKYt2w5VK4FN5K5Mw9A7QKYt2w5VK4FN5',
      type: 'send' as const,
      amount: 0.5,
      timestamp: new Date(Date.now() - 3600000),
      status: 'confirmed' as const,
      recipient: '7XgE5JvKYzGjdHHvv5YLRzTMZ8Mw9A7QKYt2w5VK4FN5'
    },
    {
      signature: '8VgF6KQKYGzGjdHHvv5YLRzTMZ8Mw9A7QKYt2w5VK4FN5K5Mw9A7QKYt2w5VK4FN5',
      type: 'receive' as const,
      amount: 1.2,
      timestamp: new Date(Date.now() - 7200000),
      status: 'confirmed' as const,
    },
    {
      signature: '9WhG7LRKYGzGjdHHvv5YLRzTMZ8Mw9A7QKYt2w5VK4FN5K5Mw9A7QKYt2w5VK4FN5',
      type: 'send' as const,
      amount: 0.1,
      timestamp: new Date(Date.now() - 86400000),
      status: 'pending' as const,
      recipient: '2XhF8MvKYzGjdHHvv5YLRzTMZ8Mw9A7QKYt2w5VK4FN5'
    }
  ]);

  const portfolioData = {
    totalValue: 2486.75,
    change24h: 5.67,
    tokens: [
      {
        symbol: 'SOL',
        name: 'Solana',
        balance: 12.5,
        value: 2250.00,
        change24h: 6.2,
        percentage: 90.5
      },
      {
        symbol: 'USDC',
        name: 'USD Coin',
        balance: 236.75,
        value: 236.75,
        change24h: 0.01,
        percentage: 9.5
      }
    ]
  };

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
      
      // Add to transaction history
      const newTransaction = {
        signature,
        type: 'send' as const,
        amount: parseFloat(amount),
        timestamp: new Date(),
        status: 'confirmed' as const,
        recipient
      };
      setTransactions(prev => [newTransaction, ...prev]);
      
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile-First Responsive Layout */}
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
        
        {/* Header with Settings */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <WalletHeader 
            theme={theme}
            onThemeSwitch={handleThemeSwitch}
          />
          <div className="flex items-center gap-2">
            <SettingsModal>
              <Button variant="outline" size="sm">
                Settings
              </Button>
            </SettingsModal>
          </div>
        </div>

        {/* Wallet Connection Section */}
        <div className="mb-6">
          <WalletConnection 
            connected={connected}
            walletName={wallet?.adapter.name}
          >
            <WalletMultiButton />
          </WalletConnection>
        </div>

        {!publicKey ? (
          /* Connect Prompt for Disconnected State */
          <ConnectPrompt />
        ) : (
          /* Main Dashboard - Connected State */
          <div className="space-y-6">
            
            {/* Portfolio Overview - Full Width on Mobile, Side Panel on Desktop */}
            <div className="lg:hidden">
              <PortfolioOverview
                totalValue={portfolioData.totalValue}
                change24h={portfolioData.change24h}
                tokens={portfolioData.tokens}
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column - Main Actions */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Wallet Info */}
                <WalletInfo 
                  publicKey={publicKey.toBase58()}
                  balance={balance}
                />

                {/* Tabbed Interface for Mobile, Separate Cards for Desktop */}
                <div className="md:hidden">
                  <Tabs defaultValue="transfer" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="transfer">Transfer</TabsTrigger>
                      <TabsTrigger value="history">History</TabsTrigger>
                    </TabsList>
                    <TabsContent value="transfer" className="mt-4">
                      <TransferForm
                        recipient={recipient}
                        amount={amount}
                        isLoading={isLoading}
                        message={message}
                        onRecipientChange={setRecipient}
                        onAmountChange={setAmount}
                        onSubmit={handleTransfer}
                      />
                    </TabsContent>
                    <TabsContent value="history" className="mt-4">
                      <TransactionHistory
                        transactions={transactions}
                        onRefresh={() => {
                          // Mock refresh
                          console.log('Refreshing transactions...');
                        }}
                      />
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Desktop Layout - Separate Cards */}
                <div className="hidden md:block space-y-6">
                  <TransferForm
                    recipient={recipient}
                    amount={amount}
                    isLoading={isLoading}
                    message={message}
                    onRecipientChange={setRecipient}
                    onAmountChange={setAmount}
                    onSubmit={handleTransfer}
                  />
                  
                  <TransactionHistory
                    transactions={transactions}
                    onRefresh={() => {
                      // Mock refresh
                      console.log('Refreshing transactions...');
                    }}
                  />
                </div>
              </div>

              {/* Right Column - Portfolio (Desktop Only) */}
              <div className="hidden lg:block">
                <PortfolioOverview
                  totalValue={portfolioData.totalValue}
                  change24h={portfolioData.change24h}
                  tokens={portfolioData.tokens}
                />
              </div>
            </div>
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
      <ThemeProvider initialTheme={{ theme: 'solana', colors: { primary: '267 84% 81%', secondary: '142 69% 58%', background: '0 0% 4%', foreground: '0 0% 98%', muted: '0 0% 15%', accent: '267 84% 81%', border: '0 0% 20%', ring: '267 84% 81%' } }}>
        <HomePage />
      </ThemeProvider>
    </Suspense>
  );
}