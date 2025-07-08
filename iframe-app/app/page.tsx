'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import WalletConnection from './components/WalletConnection';
import { useSearchParams } from 'next/navigation';

export default function Home() {
  const searchParams = useSearchParams();
  const [theme, setTheme] = useState<'solana' | 'ton'>('solana');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState<string>('#9945FF');
  const [secondaryColor, setSecondaryColor] = useState<string>('#14F195');

  useEffect(() => {
    // Parse query parameters
    const themeParam = searchParams.get('theme');
    const logoParam = searchParams.get('logo');
    const primaryParam = searchParams.get('primary');
    const secondaryParam = searchParams.get('secondary');

    if (themeParam === 'ton') {
      setTheme('ton');
      setPrimaryColor('#0098EA');
      setSecondaryColor('#1AC8FF');
    }

    if (logoParam) {
      setLogoUrl(decodeURIComponent(logoParam));
    }

    if (primaryParam) {
      setPrimaryColor(decodeURIComponent(primaryParam));
    }

    if (secondaryParam) {
      setSecondaryColor(decodeURIComponent(secondaryParam));
    }

    // Apply CSS variables
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);
    
    // Generate color tones
    generateColorTones(primaryColor, 'primary');
    generateColorTones(secondaryColor, 'secondary');
  }, [searchParams, primaryColor, secondaryColor]);

  const generateColorTones = (color: string, prefix: string) => {
    // Simple tone generation - in production you'd want more sophisticated color manipulation
    document.documentElement.style.setProperty(`--${prefix}-light`, color + '33');
    document.documentElement.style.setProperty(`--${prefix}-medium`, color + '66');
    document.documentElement.style.setProperty(`--${prefix}-dark`, color + 'CC');
  };

  const handleThemeSwitch = () => {
    const newTheme = theme === 'solana' ? 'ton' : 'solana';
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('theme', newTheme);
    
    // Send message to parent
    window.parent.postMessage({
      type: 'navigate',
      url: newUrl.toString(),
      theme: newTheme
    }, '*');

    // Update local state
    setTheme(newTheme);
    if (newTheme === 'ton') {
      setPrimaryColor('#0098EA');
      setSecondaryColor('#1AC8FF');
    } else {
      setPrimaryColor('#9945FF');
      setSecondaryColor('#14F195');
    }
  };

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="h-12 w-auto" />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]" />
          )}
          <h1 className="text-2xl font-bold">
            {theme === 'solana' ? 'Solana' : 'TON'} Staking dApp
          </h1>
        </div>
        <WalletConnection />
      </header>

      <main className="flex flex-col gap-8 max-w-4xl mx-auto">
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Staking Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Connected to {theme === 'solana' ? 'Solana' : 'TON'} network
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Staked</p>
              <p className="text-2xl font-bold text-[var(--primary-color)]">0 {theme === 'solana' ? 'SOL' : 'TON'}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
              <p className="text-sm text-gray-500 dark:text-gray-400">Rewards Earned</p>
              <p className="text-2xl font-bold text-[var(--secondary-color)]">0 {theme === 'solana' ? 'SOL' : 'TON'}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
              <p className="text-sm text-gray-500 dark:text-gray-400">APY</p>
              <p className="text-2xl font-bold">7.5%</p>
            </div>
          </div>

          <button 
            onClick={handleThemeSwitch}
            className="w-full md:w-auto px-6 py-2 bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Switch to {theme === 'solana' ? 'TON' : 'Solana'} Network
          </button>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Stake Your Tokens</h3>
          <div className="flex flex-col gap-4">
            <input
              type="number"
              placeholder={`Amount to stake (${theme === 'solana' ? 'SOL' : 'TON'})`}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            />
            <button className="w-full p-3 bg-[var(--primary-color)] text-white rounded-lg hover:opacity-90 transition-opacity">
              Stake Now
            </button>
          </div>
        </section>
      </main>

      <footer className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>iFrame dApp POC - Testing wallet connections and security</p>
      </footer>
    </div>
  );
}