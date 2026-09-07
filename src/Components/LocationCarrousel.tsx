import { View, Text, Image, TouchableOpacity, Linking, ScrollView } from "react-native";
import { locations } from "../Data/LocationData";
import { ChevronRight } from "lucide-react-native";

export function LocationCarrousel() {
  return (
    <View className="mt-3 -mx-5">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingLeft: 20,
          paddingRight: 20,
          alignItems: "stretch",
        }}
      >
        {locations.map((item, index) => {
          const isLast = index === locations.length - 1;
          return (
            <TouchableOpacity
              key={item.identifier}
              activeOpacity={0.85}
              onPress={() => Linking.openURL(item.linkMaps)}
              className="w-52"
              style={{ marginRight: isLast ? 0 : 14 }}
            >
              <View
                className="w-full bg-paper rounded-2xl border border-rule overflow-hidden"
                style={{
                  shadowColor: "#0c0d10",
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <Image
                  source={item.img}
                  className="w-full h-28"
                  resizeMode="cover"
                />
                <View className="p-3.5 justify-between min-h-[134px]">
                  <View>
                    <Text
                      className="text-navy text-sm font-bold mb-1"
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    <Text
                      className="text-mute text-xs leading-4"
                      numberOfLines={2}
                    >
                      {item.location}
                    </Text>
                  </View>
                  <View className="mt-3 items-center justify-center bg-soft rounded-xl py-2 px-2 flex-row gap-1 border border-rule/50">
                    <Text className="text-brand text-xs font-semibold">
                      Ver no Mapa
                    </Text>
                    <ChevronRight size={14} color="#1f6ae1" />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
