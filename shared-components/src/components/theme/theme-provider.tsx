// Legacy theme provider - deprecated, use whitelabel API instead
import * as React from "react";

interface ThemeContextType {
  theme: any;
  updateTheme: (newTheme: any) => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: any;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme = {},
}) => {
  const [theme, setTheme] = React.useState(initialTheme);

  const updateTheme = React.useCallback((newTheme: any) => {
    setTheme(newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};