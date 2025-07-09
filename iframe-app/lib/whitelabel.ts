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

