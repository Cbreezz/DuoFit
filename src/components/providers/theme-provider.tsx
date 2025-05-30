
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
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedTheme = window.localStorage.getItem(storageKey) as Theme | null;
        if (storedTheme) return storedTheme;
        // Fallback to system preference if no stored theme
        // const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        // return prefersDark ? "dark" : defaultTheme; 
        // For simplicity, DuoFit defaults to light unless a theme is stored. Dark mode is explicit.
      } catch (e) {
        // Handle potential localStorage access errors (e.g., in private browsing)
        console.error("Error reading theme from localStorage", e);
      }
    }
    return defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    try {
        window.localStorage.setItem(storageKey, newTheme);
    } catch (e) {
        console.error("Error saving theme to localStorage", e);
    }
    setThemeState(newTheme);
  }, [storageKey]);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);

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
