import { useState, useCallback } from "react";
import { 
  WhitelabelConfig, 
  encodeWhitelabelConfig, 
  createWhitelabelConfig 
} from "../lib/whitelabel";

export interface UseWhitelabelReturn {
  // Current config
  config: WhitelabelConfig;
  
  // Simple setters
  setPreset: (preset: string) => void;
  setBrand: (brand: { name?: string; logo?: string }) => void;
  setColors: (colors: { primary?: string; background?: string; text?: string }) => void;
  setTheme: (theme: "light" | "dark") => void;
  setBorderRadius: (radius: string) => void;
  
  // Utilities
  toUrlParams: () => URLSearchParams;
  reset: () => void;
}

export function useWhitelabel(initialPreset: string = "solana"): UseWhitelabelReturn {
  const [config, setConfig] = useState<WhitelabelConfig>(() => 
    createWhitelabelConfig(initialPreset)
  );

  const setPreset = useCallback((preset: string) => {
    setConfig(createWhitelabelConfig(preset));
  }, []);

  const setBrand = useCallback((brand: { name?: string; logo?: string }) => {
    setConfig(prev => createWhitelabelConfig(undefined, {
      ...prev,
      brand: { ...prev.brand, ...brand }
    }));
  }, []);

  const setColors = useCallback((colors: { primary?: string; background?: string; text?: string }) => {
    setConfig(prev => createWhitelabelConfig(undefined, {
      ...prev,
      colors: { ...prev.colors, ...colors }
    }));
  }, []);

  const setTheme = useCallback((theme: "light" | "dark") => {
    setConfig(prev => createWhitelabelConfig(undefined, { ...prev, theme }));
  }, []);

  const setBorderRadius = useCallback((radius: string) => {
    setConfig(prev => createWhitelabelConfig(undefined, { ...prev, borderRadius: radius }));
  }, []);

  const toUrlParams = useCallback(() => {
    return encodeWhitelabelConfig(config);
  }, [config]);

  const reset = useCallback(() => {
    setConfig(createWhitelabelConfig(initialPreset));
  }, [initialPreset]);

  return {
    config,
    setPreset,
    setBrand,
    setColors, 
    setTheme,
    setBorderRadius,
    toUrlParams,
    reset
  };
}