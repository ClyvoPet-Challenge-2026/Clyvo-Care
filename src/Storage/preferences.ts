import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
 
 export function useIsLoggedIn() {
     const [loggedIn, setLoggedIn] = useState(false);
     const [loading, setLoading] = useState(true);
 
     useEffect(() => {
         const checkLoginStatus = async () => {
             try {
                 const token = await AsyncStorage.getItem("authToken");
                 setLoggedIn(!!token); // true se token existe, false caso contrário
             } catch (error) {
                 console.error("Error checking login status:", error);
                 setLoggedIn(false);
             } finally {
                 setLoading(false);
             }
         };
 
         checkLoginStatus();
     }, []);
 
     return { loggedIn, loading };
 }

 export async function setLoginSession() {
     try {
         await AsyncStorage.setItem("authToken", "user_session_token");
     } catch (error) {
         console.error("Error setting login session:", error);
     }
 }
 
 // Função auxiliar para fazer logout
 export async function clearLoginSession() {
     try {
         await AsyncStorage.removeItem("authToken");
     } catch (error) {
         console.error("Error clearing login session:", error);
     }
 }