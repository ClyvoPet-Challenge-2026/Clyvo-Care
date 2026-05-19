import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Header() {
    return (
        <SafeAreaView className="border-b-2 border-gray-700 relative top-0 ">
            <View className="flex-row m-auto p-3 mb-3">
                <Text className="text-black font-semibold text-2xl ml-2 mt-1">Clyvo</Text>
                <Text className="text-blue-500 font-semibold text-2xl mt-1 mb-4 ">Care</Text>
            </View>
        </SafeAreaView>
    )
}