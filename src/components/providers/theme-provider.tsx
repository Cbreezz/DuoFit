
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
  const [theme, setThemeState] = useState<Theme>(defaultTheme); // Initialize with defaultTheme

  // Effect 1: On client mount, read from localStorage and update theme state if needed.
  // This runs after initial hydration.
  useEffect(() => {
    let effectiveTheme = defaultTheme;
    try {
      const storedTheme = window.localStorage.getItem(storageKey) as Theme | null;
      // Ensure storedTheme is a valid Theme value
      if (storedTheme && (storedTheme === "light" || storedTheme === "dark")) {
        effectiveTheme = storedTheme;
      }
    } catch (e) {
      console.error("Error reading theme from localStorage", e);
      // Fallback to defaultTheme if localStorage access fails
    }
    setThemeState(effectiveTheme);
  }, [defaultTheme, storageKey]); // Dependencies ensure this runs once based on these props

  // Effect 2: Apply theme to HTML and save to localStorage whenever theme state changes.
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    try {
      window.localStorage.setItem(storageKey, theme);
    } catch (e) {
      console.error("Error saving theme to localStorage", e);
    }
  }, [theme, storageKey]); // Runs when theme or storageKey changes

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
