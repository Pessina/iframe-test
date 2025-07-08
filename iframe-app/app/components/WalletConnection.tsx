'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect } from 'react';

export default function WalletConnection() {
  const { publicKey, connected, wallet } = useWallet();

  useEffect(() => {
    if (connected && publicKey) {
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletPublicKey', publicKey.toBase58());
      
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

  return (
    <div className="wallet-connection">
      <WalletMultiButton />
      {connected && wallet && (
        <div className="mt-3 text-sm text-muted-foreground">
          Connected with {wallet.adapter.name}
        </div>
      )}
    </div>
  );
}