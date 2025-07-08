# iFrame dApp POC

Simple POC to test iframe integration requirements for Solana dApps.

## Requirements Tested

Based on your document, this POC answers:

1. **✅ Wallet connections**: Phantom, Solflare, OKX support
2. **✅ Security**: iframe sandbox attributes and restrictions  
3. **✅ Responsive**: works on mobile/tablet/desktop
4. **✅ Query strings**: pass variables to iframe via URL parameters
5. **✅ CSS customization**: colors via CSS variables with tones
6. **✅ Logo support**: custom logo via URL parameter
7. **✅ Navigation**: switch between Solana/TON themes
8. **✅ Persistent connections**: wallet stays connected after refresh

## Quick Start

```bash
# Terminal 1 - iframe app 
cd iframe-app && npm run dev

# Terminal 2 - parent app (specify port manually)
cd parent-app && npm run dev -- --port 3001
```

Visit: `http://localhost:3001`

## Test Features

- Connect wallets (Phantom/Solflare/OKX)
- Change theme (Solana ↔ TON) 
- Customize colors and logo
- Test responsiveness
- Verify persistent connections

## Security Features

- Sandbox: `allow-scripts allow-same-origin allow-forms allow-popups allow-modals`
- PostMessage communication
- Origin verification ready for production
- CSP headers configured

## Files Structure

```
iframe-app/          # dApp inside iframe
├── app/page.tsx     # Main POC interface
├── app/components/WalletConnection.tsx
└── app/providers/WalletProvider.tsx

parent-app/          # Parent that embeds iframe
└── app/page.tsx     # Configuration and iframe container
```

That's it! Simple, focused POC for testing iframe requirements.