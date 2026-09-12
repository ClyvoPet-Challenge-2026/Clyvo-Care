import './global.css';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import AppNavigator from "./src/Navigation/AppNavigator";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { AuthProvider } from "./src/Context/AuthContext";
import { ThemeProvider, useTheme } from "./src/Context/ThemeContext";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/Lib/queryClient';

function AppContent() {
  const { isDark, colors } = useTheme();

  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      primary: colors.brand,
    },
  };

  return (
    <View className={`flex-1 ${isDark ? "dark bg-navy-2" : "bg-ground"}`} style={{ backgroundColor: colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <NavigationContainer theme={navigationTheme}>
        <AppNavigator />
      </NavigationContainer>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}