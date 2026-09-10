import './global.css';
import AppNavigator from "./src/Navigation/AppNavigator";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from "./src/Context/AuthContext";
import { ThemeProvider } from "./src/Context/ThemeContext";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/Lib/queryClient';

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}