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
    primary?: string;      // Primary brand color
    background?: string;   // Background color
    text?: string;         // Text color
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
      text: "#ffffff"
    },
    theme: "dark",
    borderRadius: "8px"
  },
  
  ton: {
    colors: {
      primary: "#0088cc",
      background: "#0f1419",
      text: "#ffffff"  
    },
    theme: "dark",
    borderRadius: "12px"
  },
  
  light: {
    colors: {
      primary: "#2563eb",
      background: "#ffffff",
      text: "#000000"
    },
    theme: "light", 
    borderRadius: "6px"
  }
};

// Simple URL parameter encoding/decoding
export function encodeWhitelabelConfig(config: WhitelabelConfig): URLSearchParams {
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

export function decodeWhitelabelConfig(params: URLSearchParams): WhitelabelConfig {
  const config: WhitelabelConfig = {};
  
  // Brand
  const brand = params.get("brand");
  const logo = params.get("logo");
  if (brand || logo) {
    config.brand = {};
    if (brand) config.brand.name = brand;
    if (logo) config.brand.logo = logo;
  }
  
  // Colors
  const primary = params.get("primary");
  const bg = params.get("bg");
  const text = params.get("text");
  if (primary || bg || text) {
    config.colors = {};
    if (primary) config.colors.primary = primary;
    if (bg) config.colors.background = bg;
    if (text) config.colors.text = text;
  }
  
  // Theme
  const theme = params.get("theme");
  if (theme === "light" || theme === "dark") {
    config.theme = theme;
  }
  
  // Styling
  const radius = params.get("radius");
  if (radius) config.borderRadius = radius;
  
  return config;
}

// Apply whitelabel config to DOM
export function applyWhitelabelConfig(config: WhitelabelConfig) {
  const root = document.documentElement;
  
  // Apply colors as CSS custom properties
  if (config.colors?.primary) {
    root.style.setProperty("--color-primary", config.colors.primary);
  }
  if (config.colors?.background) {
    root.style.setProperty("--color-background", config.colors.background);
  }
  if (config.colors?.text) {
    root.style.setProperty("--color-text", config.colors.text);
  }
  
  // Apply border radius
  if (config.borderRadius) {
    root.style.setProperty("--border-radius", config.borderRadius);
  }
  
  // Apply theme class for additional styling
  if (config.theme) {
    root.classList.remove("theme-light", "theme-dark");
    root.classList.add(`theme-${config.theme}`);
  }
}

// Merge with preset theme
export function createWhitelabelConfig(preset?: string, overrides?: WhitelabelConfig): WhitelabelConfig {
  const base = preset ? WHITELABEL_THEMES[preset] || {} : {};
  
  return {
    ...base,
    ...overrides,
    brand: { ...base.brand, ...overrides?.brand },
    colors: { ...base.colors, ...overrides?.colors }
  };
}