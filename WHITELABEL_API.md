# iFrame Whitelabel API

Industry-standard iframe whitelabeling following patterns used by Stripe, PayPal, Plaid, and other major providers.

## Quick Start

```typescript
import { useWhitelabel, WhitelabelControls } from '@iframe-test/shared-components';

function ParentApp() {
  const whitelabel = useWhitelabel("solana");
  const iframeUrl = `https://your-iframe.com?${whitelabel.toUrlParams()}`;
  
  return (
    <div>
      <WhitelabelControls whitelabel={whitelabel} />
      <iframe src={iframeUrl} />
    </div>
  );
}
```

## URL Parameters

The API uses simple, standard URL parameters:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `brand` | Brand name | `brand=My%20Wallet` |
| `logo` | Logo URL | `logo=https%3A//logo.png` |
| `primary` | Primary color (hex) | `primary=%23ff0000` |
| `bg` | Background color (hex) | `bg=%23ffffff` |
| `text` | Text color (hex) | `text=%23000000` |
| `theme` | Theme mode | `theme=dark` |
| `radius` | Border radius | `radius=8px` |

## WhitelabelConfig Interface

```typescript
interface WhitelabelConfig {
  brand?: {
    name?: string;
    logo?: string;
  };
  colors?: {
    primary?: string;      // Primary brand color
    background?: string;   // Background color  
    text?: string;         // Text color
  };
  theme?: "light" | "dark";
  borderRadius?: string;
}
```

## Pre-built Themes

- `solana` - Purple theme for Solana ecosystem
- `ton` - Blue theme for TON ecosystem  
- `light` - Clean light theme

## CSS Custom Properties

The iframe automatically applies these CSS variables:

```css
:root {
  --color-primary: #2563eb;
  --color-background: #ffffff;
  --color-text: #000000;
  --border-radius: 6px;
}
```

## iframe Implementation

```typescript
// In your iframe app
import { decodeWhitelabelConfig, applyWhitelabelConfig } from '@iframe-test/shared-components';

function IframeApp() {
  const [config, setConfig] = useState(() => 
    decodeWhitelabelConfig(new URLSearchParams(window.location.search))
  );

  useEffect(() => {
    applyWhitelabelConfig(config);
  }, [config]);

  return (
    <div style={{ 
      backgroundColor: 'var(--color-background)',
      color: 'var(--color-text)' 
    }}>
      {config.brand?.name && <h1>{config.brand.name}</h1>}
      {/* Your app content */}
    </div>
  );
}
```

## Benefits

✅ **Simple** - Only 3 core colors + branding  
✅ **Standard** - Follows industry URL parameter patterns  
✅ **Flexible** - Works with any CSS framework  
✅ **Lightweight** - Minimal API surface  
✅ **Type-safe** - Full TypeScript support  

## Migration from Complex Theme API

The old complex theme API has been replaced with this simple whitelabel API. Key changes:

- **Before**: 15+ color properties, complex builder pattern
- **After**: 3 core colors (primary, background, text)
- **Before**: Custom HSL conversion, validation, accessibility checks
- **After**: Simple hex colors, standard CSS variables
- **Before**: useThemeBuilder hook with 20+ properties  
- **After**: useWhitelabel hook with 5 simple methods

This follows the principle: *"Make simple things simple, complex things possible"*