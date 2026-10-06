import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useTheme } from "../Context/ThemeContext";
import { useAuth } from "../Context/AuthContext";
import { useProfileForm } from "../Hooks/useProfileForm";
import { useAccountActions } from "../Hooks/useAccountActions";
import { Footer } from "../Components/Footer";
import { PersonalInfoSection } from "../Components/MyInformationsComponents/PersonalInfoSection";
import { ConfigSection } from "../Components/MyInformationsComponents/ConfigSection";
import { DeleteModal } from "../Components/MyInformationsComponents/DeleteModal";

export function MyInformations() {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { displayOwner, initial, cityNameText, personalInfoProps } = useProfileForm();
  const {
    logout,
    confirmDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    handleDeleteAccount,
    isDeleting,
  } = useAccountActions(user?.id || displayOwner?.id);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className={`flex-1 ${isDark ? "bg-navy-2" : "bg-ground"}`}
    >
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Título da Página (Sem loading no canto) */}
        <View className="mb-5">
          <Text className={`text-2xl font-bold ${isDark ? "text-paper" : "text-navy"}`}>Minha Conta</Text>
          <Text className={`text-xs mt-1 ${isDark ? "text-soft-line" : "text-mute"}`}>
            Gerencie suas informações pessoais e preferências do aplicativo
          </Text>
        </View>

        {/* Card do Perfil & Foto */}
        <View
          className={`rounded-3xl p-5 mb-5 border ${
            isDark ? "bg-navy border-white/10" : "bg-paper border-rule"
          }`}
          style={{
            shadowColor: "#0c0d10",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          <View className="flex-row items-center gap-4">
            <View className="w-16 h-16 rounded-2xl bg-brand items-center justify-center overflow-hidden border-2 border-soft shadow-sm">
              <Text className="text-paper text-2xl font-bold">{initial}</Text>
            </View>

            <View className="flex-1 min-w-0">
              <Text className={`text-lg font-bold truncate ${isDark ? "text-paper" : "text-navy"}`} numberOfLines={1}>
                {displayOwner?.name || "Tutor Clyvo"}
              </Text>
              <Text className={`text-xs truncate mt-0.5 ${isDark ? "text-soft-line" : "text-mute"}`} numberOfLines={1}>
                {displayOwner?.email}
              </Text>
              <Text className={`text-[11px] font-medium mt-1 ${isDark ? "text-soft-line" : "text-brand"}`}>
                Cidade: {cityNameText}
              </Text>
            </View>
          </View>
        </View>

        <PersonalInfoSection isDark={isDark} {...personalInfoProps} />

        <ConfigSection
          isDark={isDark}
          toggleTheme={toggleTheme}
          logout={logout}
          onDeleteAccount={openDeleteModal}
        />

        {/* Rodapé institucional */}
        <Footer />
      </ScrollView>

      <DeleteModal
        isDark={isDark}
        visible={confirmDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteAccount}
        isDeleting={isDeleting}
      />
    </KeyboardAvoidingView>
  );
}
