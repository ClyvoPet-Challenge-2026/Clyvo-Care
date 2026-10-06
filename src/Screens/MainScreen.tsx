import { View, ScrollView } from "react-native";
import type { MainScreenProps } from "../Types/types";
import { useAuth } from "../Context/AuthContext";
import { useTheme } from "../Context/ThemeContext";
import { usePets } from "../Hooks/usePets";
import { useHomePlans } from "../Hooks/useHomePlans";
import { WelcomeSection } from "../Components/MainScreenComponents/WelcomeSection";
import { PlansSection } from "../Components/MainScreenComponents/PlansSection";
import { RegisteredPetsSection } from "../Components/MainScreenComponents/RegisteredPetsSection";
import { ClinicsSection } from "../Components/MainScreenComponents/ClinicsSection";

export function MainScreen({ navigation }: MainScreenProps) {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { data: pets = [] } = usePets(user?.id);
  const plans = useHomePlans();

  return (
    <View className={`flex-1 ${isDark ? "bg-navy-2" : "bg-ground"}`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 48 }}
      >
        <WelcomeSection
          userName={user?.name}
          onAppointment={() => navigation.navigate("MakeAppointment")}
          onRegisterPet={() => navigation.navigate("RegisterPet")}
        />
        <View className="px-5 pt-8 space-y-9">
          <PlansSection {...plans} petName={pets[0]?.name} />
          <RegisteredPetsSection
            pets={pets}
            onViewPets={() => navigation.navigate("MyPet")}
            onRegisterPet={() => navigation.navigate("RegisterPet")}
          />
          <ClinicsSection />
        </View>
      </ScrollView>
    </View>
  );
}
