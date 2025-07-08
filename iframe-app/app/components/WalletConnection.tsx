'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect } from 'react';

export default function WalletConnection() {
  const { publicKey, connected, connecting, disconnecting, wallet } = useWallet();

  useEffect(() => {
    if (connected && publicKey) {
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletPublicKey', publicKey.toBase58());
      
      // Send message to parent window
      window.parent.postMessage({
        type: 'wallet-connected',
        wallet: wallet?.adapter.name,
        publicKey: publicKey.toBase58()
      }, '*');
    } else {
      localStorage.removeItem('walletConnected');
      localStorage.removeItem('walletPublicKey');
      
      window.parent.postMessage({
        type: 'wallet-disconnected'
      }, '*');
    }
  }, [connected, publicKey, wallet]);

  // Auto-connect on mount if previously connected
  useEffect(() => {
    const wasConnected = localStorage.getItem('walletConnected');
    if (wasConnected === 'true' && wallet && !connected && !connecting && !disconnecting) {
      wallet.adapter.connect().catch(() => {
        localStorage.removeItem('walletConnected');
        localStorage.removeItem('walletPublicKey');
      });
    }
  }, [wallet, connected, connecting, disconnecting]);

  return (
    <div className="wallet-connection">
      <WalletMultiButton />
      {connected && publicKey && (
        <p className="text-sm mt-2">
          Connected: {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
        </p>
      )}
    </div>
  );
}