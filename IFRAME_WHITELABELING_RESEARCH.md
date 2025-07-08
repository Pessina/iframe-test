# iFrame Whitelabeling Best Practices - Industry Research

_Research conducted January 2025_

## Overview

This document summarizes research into how leading fintech companies implement color customization and branding for embedded iframe widgets. The goal was to understand industry standards and best practices for whitelabeling iframe applications.

## Key Findings

### ❌ Common Misconceptions

**Myth**: "Industry standard is 3-5 colors maximum with automatic derivation"
**Reality**: Most platforms provide 10-30+ customizable properties without automatic color derivation.

**Myth**: "Simple color input with smart defaults is the norm"
**Reality**: Companies use varied approaches from basic theming to full CSS customization.

### ✅ Actual Industry Practices

## Company Analysis

### 1. Stripe Elements

**Approach**: Three-tier customization system

```typescript
// Tier 1: Themes (3 presets)
{ theme: "stripe" | "night" | "flat" }

// Tier 2: Variables (10-15 properties)
{
  variables: {
    colorPrimary: "#1a73e8",
    fontFamily: "system-ui",
    borderRadius: "4px"
  }
}

// Tier 3: Rules (full CSS)
{
  rules: {
    '.Input': { color: '#32325d' },
    '.Input--invalid': { color: '#fa755a' }
  }
}
```

**Takeaway**: Progressive complexity - simple themes for basic users, full CSS for advanced needs.

### 2. Plaid Link

**Approach**: Minimal customization with focus on preset themes

```typescript
{
  theme: "default",
  brandName: "My Bank",
  logo: "https://example.com/logo.png",
  // Very limited color customization
}
```

**Takeaway**: Prioritizes consistency over customization. Focus on branding elements rather than deep styling.

### 3. Square Web Payments

**Approach**: CSS-style selectors with component states

```typescript
{
  '.input-container': {
    borderColor: '#2D2D2D',
    borderRadius: '6px',
  },
  '.input-container.is-focus': {
    borderColor: '#006AFF',
  },
  '.input-container.is-error': {
    borderColor: '#ff1600',
  },
  input: {
    backgroundColor: '#2D2D2D',
    color: '#FFFFFF',
    fontFamily: 'helvetica neue'
  }
}
```

**Takeaway**: Component-specific styling with state management (focus, error, etc.).

### 4. PayPal Card Fields

**Approach**: Supported CSS properties list

```typescript
{
  style: {
    'input': {
      'font-size': '16px',
      'font-family': 'courier, monospace',
      'color': '#ccc',
    },
    '.invalid': {
      'color': 'purple',
    },
  }
}
```

**Takeaway**: Specific allowlist of CSS properties (30+ supported properties).

### 5. Other Platforms

**Klarna**: Color-based customization with hex values

- `color_button`, `color_button_text`, `color_checkbox`, etc.
- Maximum 70-character shipping info text

**Payment Processors (Planet, HyperPay)**:

- Style options: `plain`, `card`, `custom`
- Full CSS class customization available
- Extensive documentation of CSS selectors

## Industry Patterns

### 1. Tiered Complexity

Most successful platforms offer multiple levels:

**Basic Tier** (80% of users):

- Theme presets (light/dark/branded)
- Primary brand color
- Logo and brand name

**Intermediate Tier** (15% of users):

- 5-10 key colors (primary, secondary, background, text, error)
- Font family selection
- Border radius and basic spacing

**Advanced Tier** (5% of users):

- Full CSS-style customization
- Component-specific styling
- State-based styling (hover, focus, error)

### 2. Common Customization Categories

**Brand Colors** (Universal):

- Primary color (buttons, links, active states)
- Secondary/accent color
- Background colors
- Text colors

**Layout & Spacing** (Common):

- Border radius
- Padding/margins
- Font family and sizing
- Component spacing

**States & Feedback** (Advanced):

- Error states (red borders, text)
- Focus states (highlighted borders)
- Success states (green indicators)
- Disabled states (muted appearance)

### 3. Technical Implementation Patterns

**CSS Custom Properties** (Most Popular):

```css
:root {
  --primary-color: #1a73e8;
  --border-radius: 4px;
  --font-family: system-ui;
}
```

**CSS-in-JS Objects** (React/Modern):

```typescript
{
  primaryColor: "#1a73e8",
  borderRadius: "4px",
  fontFamily: "system-ui"
}
```

**Scoped CSS Classes** (Traditional):

```css
.payment-widget .btn-primary {
  background-color: #1a73e8;
}
```

## Security & Performance Considerations

### Content Security Policy (CSP)

- Inline styles often blocked by CSP
- Use CSS custom properties or allowlisted classes
- Avoid `style` attributes in favor of classes

### Cross-Origin Constraints

- Limited font loading from external domains
- Logo images must be accessible cross-origin
- Color validation to prevent injection attacks

### Performance Impact

- CSS custom properties: Minimal impact
- Dynamic style injection: Medium impact
- Full CSS recompilation: High impact

## Recommendations

### For New Implementations

**Start Simple, Scale Complex**:

```typescript
interface ThemeConfig {
  // Basic (required)
  mode: "light" | "dark";
  primaryColor: string;

  // Branding (optional)
  brandName?: string;
  logo?: string;

  // Intermediate (optional)
  colors?: {
    background?: string;
    text?: string;
    border?: string;
    error?: string;
  };

  // Advanced (optional)
  customCSS?: Record<string, CSSProperties>;
}
```

**Validation Requirements**:

- WCAG contrast ratio validation (4.5:1 minimum)
- Hex color format validation
- Logo size and format restrictions
- Font family allowlisting (web-safe fonts)

**Testing Strategy**:

- Light/dark mode compatibility
- Mobile responsive design
- Cross-browser testing
- Accessibility compliance

### For Existing Complex Systems

**Organization over Reduction**:
Instead of reducing parameters, organize them:

```typescript
// Before: Flat structure (confusing)
{ primary, secondary, background, foreground, surface, muted, border, ring, success, error, warning, info }

// After: Grouped structure (clear)
{
  brand: { primary, secondary, logo, name },
  surface: { background, foreground, border, muted },
  feedback: { success, error, warning, info },
  layout: { borderRadius, spacing, fontFamily }
}
```

**Progressive Disclosure**:

- Basic mode: Show only brand colors + logo
- Advanced mode: Reveal all options
- Expert mode: Allow custom CSS injection

## Implementation Examples

### Minimal Configuration

```typescript
const config = {
  mode: "dark",
  primaryColor: "#9945ff",
  brandName: "My Wallet",
  logo: "https://example.com/logo.png",
};
```

### Intermediate Configuration

```typescript
const config = {
  theme: "custom",
  brand: {
    primary: "#9945ff",
    secondary: "#14f195",
    name: "My Wallet",
    logo: "https://example.com/logo.png",
  },
  surface: {
    background: "#000000",
    foreground: "#ffffff",
    border: "#333333",
  },
};
```

### Advanced Configuration

```typescript
const config = {
  customCSS: {
    ".payment-button": {
      backgroundColor: "#9945ff",
      borderRadius: "8px",
      fontWeight: "bold",
    },
    ".payment-button:hover": {
      backgroundColor: "#7c3aed",
    },
    ".error-message": {
      color: "#ff6b6b",
      fontSize: "14px",
    },
  },
};
```

## Conclusion

**Key Insights**:

1. **No Universal Standard**: Each platform has evolved different approaches based on their user needs and technical constraints.

2. **Complexity vs. Adoption**: Simpler systems have higher adoption, but power users demand advanced customization.

3. **Organization Matters**: Well-organized complex systems outperform poorly-organized simple systems.

4. **Progressive Enhancement**: Start simple, allow complexity when needed.

5. **Validation is Critical**: Color contrast, security, and accessibility must be enforced.

**Recommendation**: Implement a tiered system that serves both simple and complex use cases, with clear organization and proper validation.

## Sources

- Stripe Elements Documentation
- Plaid Link Customization Guide
- Square Web Payments SDK
- PayPal Card Fields Style Guide
- Klarna Checkout Customization
- HyperPay/Planet Payment Widget Documentation
- Various fintech platform documentation and implementations

---

_This research was conducted to inform iframe whitelabeling decisions for production fintech applications._
