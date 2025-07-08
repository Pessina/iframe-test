import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Theme = "solana" | "ton" | "custom";

export interface ThemeConfig {
  theme: Theme;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
    muted: string;
    accent: string;
    border: string;
    ring: string;
  };
  logo?: string;
  brandName?: string;
  radius?: string;
}

export const defaultThemes: Record<Theme, ThemeConfig> = {
  solana: {
    theme: "solana",
    colors: {
      primary: "267 84% 81%", // Purple
      secondary: "142 69% 58%", // Green
      background: "0 0% 4%", // Dark
      foreground: "0 0% 98%", // Light
      muted: "0 0% 15%",
      accent: "267 84% 81%",
      border: "0 0% 20%",
      ring: "267 84% 81%",
    },
    brandName: "Solana Wallet",
  },
  ton: {
    theme: "ton",
    colors: {
      primary: "210 100% 56%", // Blue
      secondary: "210 100% 56%",
      background: "0 0% 4%",
      foreground: "0 0% 98%",
      muted: "0 0% 15%",
      accent: "210 100% 56%",
      border: "0 0% 20%",
      ring: "210 100% 56%",
    },
    brandName: "TON Wallet",
  },
  custom: {
    theme: "custom",
    colors: {
      primary: "267 84% 81%",
      secondary: "142 69% 58%",
      background: "0 0% 4%",
      foreground: "0 0% 98%",
      muted: "0 0% 15%",
      accent: "267 84% 81%",
      border: "0 0% 20%",
      ring: "267 84% 81%",
    },
  },
};

export function applyTheme(config: ThemeConfig) {
  const root = document.documentElement;
  
  Object.entries(config.colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
  
  if (config.radius) {
    root.style.setProperty("--radius", config.radius);
  }
}

export function parseThemeFromUrl(searchParams: URLSearchParams): ThemeConfig {
  const theme = (searchParams.get("theme") || "solana") as Theme;
  const baseConfig = defaultThemes[theme === "custom" ? "custom" : theme];
  
  const config: ThemeConfig = {
    ...baseConfig,
    theme,
  };
  
  // Parse custom colors from URL
  const primaryParam = searchParams.get("primary");
  const secondaryParam = searchParams.get("secondary");
  const backgroundParam = searchParams.get("background");
  const foregroundParam = searchParams.get("foreground");
  const logoParam = searchParams.get("logo");
  const brandNameParam = searchParams.get("brandName");
  
  if (primaryParam) {
    config.colors.primary = hexToHsl(decodeURIComponent(primaryParam));
    config.colors.accent = config.colors.primary;
    config.colors.ring = config.colors.primary;
  }
  
  if (secondaryParam) {
    config.colors.secondary = hexToHsl(decodeURIComponent(secondaryParam));
  }
  
  if (backgroundParam) {
    config.colors.background = hexToHsl(decodeURIComponent(backgroundParam));
  }
  
  if (foregroundParam) {
    config.colors.foreground = hexToHsl(decodeURIComponent(foregroundParam));
  }
  
  if (logoParam) {
    config.logo = decodeURIComponent(logoParam);
  }
  
  if (brandNameParam) {
    config.brandName = decodeURIComponent(brandNameParam);
  }
  
  return config;
}

function hexToHsl(hex: string): string {
  // Remove the hash if present
  hex = hex.replace("#", "");
  
  // Parse the hex values
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}