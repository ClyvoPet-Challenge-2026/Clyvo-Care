import { View, Text } from 'react-native';
import { useTheme } from '../Context/ThemeContext';

export function Footer() {
    const { isDark } = useTheme();
    return (
        <View className="flex-row items-center justify-center">
            <Text className={`text-center p-4 text-xs ${isDark ? "text-soft-line" : "text-mute"}`}>
                © 2026 Clyvo Care. All rights reserved.
            </Text>
        </View>
    );
}