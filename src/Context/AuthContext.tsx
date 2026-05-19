import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
    loggedIn: boolean;
    loading: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    // Verifica o status de login ao montar
    useEffect(() => {
        checkLoginStatus();
    }, []);

    const checkLoginStatus = async () => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            setLoggedIn(!!token);
        } catch (error) {
            console.error("Error checking login status:", error);
            setLoggedIn(false);
        } finally {
            setLoading(false);
        }
    };

    const login = async () => {
        try {
            await AsyncStorage.setItem("authToken", "user_session_token");
            setLoggedIn(true);
        } catch (error) {
            console.error("Error setting login session:", error);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem("authToken");
            setLoggedIn(false);
        } catch (error) {
            console.error("Error clearing login session:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ loggedIn, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
