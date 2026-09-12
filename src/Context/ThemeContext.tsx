import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";
import type { ClyvoThemeColors, ThemeType } from "../Types/types";

const { clyvoLightColors, clyvoDarkColors } = require("../../tailwind.config");

export type Theme = ThemeType;
export type { ClyvoThemeColors };

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  colors: ClyvoThemeColors;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const STORAGE_THEME_KEY = "@clyvo_app_theme";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { colorScheme, setColorScheme } = useColorScheme();
  const systemColorScheme = Appearance.getColorScheme();

  const [theme, setThemeState] = useState<Theme>(() => {
    return colorScheme === "dark" || systemColorScheme === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    loadStoredTheme();
  }, []);

  const loadStoredTheme = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_THEME_KEY);
      if (stored === "light" || stored === "dark") {
        setThemeState(stored);
        setColorScheme(stored);
      } else if (systemColorScheme === "dark" || systemColorScheme === "light") {
        setThemeState(systemColorScheme);
        setColorScheme(systemColorScheme);
      }
    } catch (error) {
      console.error("Erro ao carregar tema armazenado:", error);
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    setColorScheme(newTheme);
    AsyncStorage.setItem(STORAGE_THEME_KEY, newTheme).catch((err) => {
      console.error("Erro ao salvar tema:", err);
    });
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isDark = theme === "dark";
  const colors = useMemo(() => (isDark ? clyvoDarkColors : clyvoLightColors), [isDark]);

  return (
    <ThemeContext.Provider value={{ theme, isDark, colors, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};