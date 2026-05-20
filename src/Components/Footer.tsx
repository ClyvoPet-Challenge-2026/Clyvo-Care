import { View, Text } from 'react-native';

export default function Footer() {
    return (
        <View className="flex-row fixed bottom-0 w-screen justify-center bg-gray-100">
            <Text className="text-center text-gray-500 p-4">© 2026 Clyvo Care. All rights reserved.</Text>
        </View>
    )
}