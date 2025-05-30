
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

type Theme = "light" | "dark";

export interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
  toggleTheme: () => null,
};

export const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "duofit-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  // Runs once on the client after initial hydration to set theme from localStorage
  useEffect(() => {
    const storedTheme = typeof window !== 'undefined' ? window.localStorage.getItem(storageKey) as Theme | null : null;
    if (storedTheme && (storedTheme === "light" || storedTheme === "dark")) {
      setThemeState(storedTheme); // Update to stored theme
    }
    // If no stored theme, it remains `defaultTheme` from useState init
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]); // Only re-run if storageKey changes (which it likely won't)

  // Runs whenever `theme` state changes to apply it to the DOM and localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(theme);
      try {
        window.localStorage.setItem(storageKey, theme);
      } catch (e) {
        console.error("Error saving theme to localStorage", e);
      }
    }
  }, [theme, storageKey]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(currentTheme => (currentTheme === "light" ? "dark" : "light"));
  }, []);

  const value = {
    theme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
