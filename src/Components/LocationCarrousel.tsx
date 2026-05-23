import { View, Text, Image, TouchableOpacity, Linking, ScrollView } from "react-native";
import { locations } from "../Data/LocationData";
import { ChevronRight } from "lucide-react-native";

export function LocationCarrousel() {
    return (
        <View className="mt-4">
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
            >
                {locations.map((item) => (
                    <TouchableOpacity
                        key={item.identifier}
                        activeOpacity={0.85}
                        onPress={() => Linking.openURL(item.linkMaps)}
                        className="mr-4 last:mr-0"
                    >
                        <View className="w-44 h-56 bg-white rounded-2xl shadow-md overflow-hidden">
                            <Image source={item.img} className="w-full h-28" resizeMode="cover" />
                            <View className="p-3 flex-1 justify-between">
                                <View>
                                    <Text className="text-neutral-900 text-sm font-semibold mb-1" numberOfLines={1}>
                                        {item.name}
                                    </Text>
                                    <Text className="text-neutral-600 text-xs" numberOfLines={2}>
                                        {item.location}
                                    </Text>
                                </View>
                                <View className="mt-3 items-center justify-center bg-blue/10 rounded-full py-1 flex-row space-x-1">
                                    <Text className="text-blue text-xs font-semibold">Ver Unidade</Text>
                                    <ChevronRight size={16} color="#1F6AE1" />
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}