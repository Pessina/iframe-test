/**
 * Industry-standard iframe whitelabeling API
 * Follows common patterns used by Stripe, PayPal, Plaid, etc.
 */

// Minimal, focused interface for whitelabeling
export interface WhitelabelConfig {
  // Brand identity
  brand?: {
    name?: string;
    logo?: string;
  };

  // Essential colors only - keep it simple
  colors?: {
    primary?: string; // Primary brand color
    background?: string; // Background color
    text?: string; // Text color
  };

  // Theme mode
  theme?: "light" | "dark";

  // Optional styling
  borderRadius?: string;
}

// Pre-built themes for quick setup
export const WHITELABEL_THEMES: Record<string, WhitelabelConfig> = {
  solana: {
    colors: {
      primary: "#9945ff",
      background: "#000000",
      text: "#ffffff",
    },
    theme: "dark",
    borderRadius: "8px",
  },

  ton: {
    colors: {
      primary: "#0088cc",
      background: "#0f1419",
      text: "#ffffff",
    },
    theme: "dark",
    borderRadius: "12px",
  },

  light: {
    colors: {
      primary: "#2563eb",
      background: "#ffffff",
      text: "#000000",
    },
    theme: "light",
    borderRadius: "6px",
  },
};

// Simple URL parameter encoding/decoding
export function encodeWhitelabelConfig(
  config: WhitelabelConfig
): URLSearchParams {
  const params = new URLSearchParams();

  // Brand
  if (config.brand?.name) params.set("brand", config.brand.name);
  if (config.brand?.logo) params.set("logo", config.brand.logo);

  // Colors - use hex format for simplicity
  if (config.colors?.primary) params.set("primary", config.colors.primary);
  if (config.colors?.background) params.set("bg", config.colors.background);
  if (config.colors?.text) params.set("text", config.colors.text);

  // Theme
  if (config.theme) params.set("theme", config.theme);

  // Styling
  if (config.borderRadius) params.set("radius", config.borderRadius);

  return params;
}


// Merge with preset theme
export function createWhitelabelConfig(
  preset?: string,
  overrides?: WhitelabelConfig
): WhitelabelConfig {
  const base = preset ? WHITELABEL_THEMES[preset] || {} : {};

  return {
    ...base,
    ...overrides,
    brand: { ...base.brand, ...overrides?.brand },
    colors: { ...base.colors, ...overrides?.colors },
  };
}
