import { FormattedTextInput } from "../Components/FormattedTextInput";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform,ScrollView, ActivityIndicator } from "react-native";
import { Mail, Lock, Eye, EyeOff, User, Phone, MapPin, ChevronDown, Check } from "lucide-react-native";
import { useTheme } from "../Context/ThemeContext";
import { RegisterScreenProps } from "../Types/types";
import { useRegisterForm } from "../Hooks/useRegisterForm";
import { ErrorState } from "../Components/ErrorState";

export function RegisterScreen({ navigation }: RegisterScreenProps) {
  const { isDark } = useTheme();
  const { formData, errors, apiError, isSubmitting, updateField, handleRegister, locations } = useRegisterForm();
  const {
    states, availableCities, selectedStateId, selectedCityId,
    currentStateName, currentCityName, isBusy: loadingLocations,
    isUnavailable: locationsUnavailable, canRegister, selectState, selectCity,
    retry: retryLocations,
  } = locations;

  const [openStateDropdown, setOpenStateDropdown] = useState(false);
  const [openCityDropdown, setOpenCityDropdown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleStateSelect = (stateId: number) => {
    selectState(stateId);
    setOpenStateDropdown(false);
    setOpenCityDropdown(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className={`flex-1 ${isDark ? "bg-navy-2" : "bg-brand"}`}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingVertical: 40 }}
        keyboardShouldPersistTaps="handled"
        className="px-6"
      >
        <View className="w-full max-w-sm mx-auto">
          {/* Header */}
          <View className="items-center mb-6">
            <Image
              source={require("../../assets/Logo-ClyvoCare.png")}
              className="w-28 h-28"
              resizeMode="contain"
            />
            <Text className="text-2xl font-bold text-paper mt-2">Crie sua conta</Text>
            <Text className="text-xs text-soft opacity-90 mt-1">
              Cadastre-se para cuidar do seu pet
            </Text>
          </View>

          {/* Card do Formulário */}
          <View
            className={`rounded-3xl p-6 mb-8 border ${
              isDark ? "bg-navy border-white/10" : "bg-paper border-transparent"
            }`}
          >
            {apiError ? (
              <View className={`mb-4 p-3 rounded-xl border ${
                isDark ? "bg-danger/20 border-danger/30" : "bg-red-50 border-red-200"
              }`}>
                <Text className="text-danger text-xs">{apiError}</Text>
              </View>
            ) : null}

            {/* Nome Completo */}
            <View className="mb-3.5">
              <Text className={`text-xs font-medium mb-1.5 ${isDark ? "text-soft-line" : "text-mute"}`}>Nome Completo</Text>
              <View className={`flex-row items-center rounded-xl border px-3 py-2.5 ${
                isDark ? "border-white/10 bg-navy-2" : "border-rule bg-ground/50"
              }`}>
                <User size={16} color={isDark ? "#99b6e6" : "#6c778c"} />
                <TextInput
                  placeholder="Seu nome"
                  placeholderTextColor="#6c778c"
                  value={formData.name}
                  onChangeText={(text) => updateField("name", text)}
                  className={`flex-1 ml-2 text-sm p-0 ${isDark ? "text-paper" : "text-ink"}`}
                />
              </View>
              {errors.name ? <Text className="text-danger text-xs mt-1">{errors.name}</Text> : null}
            </View>

            {/* CPF */}
            <View className="mb-3.5">
              <Text className={`text-xs font-medium mb-1.5 ${isDark ? "text-soft-line" : "text-mute"}`}>CPF (11 dígitos)</Text>
              <View className={`flex-row items-center rounded-xl border px-3 py-2.5 ${
                isDark ? "border-white/10 bg-navy-2" : "border-rule bg-ground/50"
              }`}>
                <FormattedTextInput
                  format="cpf"
                  placeholder="000.000.000-00"
                  placeholderTextColor="#6c778c"
                  value={formData.cpf}
                  onChangeText={(text) => updateField("cpf", text)}
                  className={`flex-1 text-sm p-0 ${isDark ? "text-paper" : "text-ink"}`}
                />
              </View>
              {errors.cpf ? <Text className="text-danger text-xs mt-1">{errors.cpf}</Text> : null}
            </View>

            {/* E-mail */}
            <View className="mb-3.5">
              <Text className={`text-xs font-medium mb-1.5 ${isDark ? "text-soft-line" : "text-mute"}`}>E-mail</Text>
              <View className={`flex-row items-center rounded-xl border px-3 py-2.5 ${
                isDark ? "border-white/10 bg-navy-2" : "border-rule bg-ground/50"
              }`}>
                <Mail size={16} color={isDark ? "#99b6e6" : "#6c778c"} />
                <TextInput
                  placeholder="voce@email.com"
                  placeholderTextColor="#6c778c"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) => updateField("email", text)}
                  className={`flex-1 ml-2 text-sm p-0 ${isDark ? "text-paper" : "text-ink"}`}
                />
              </View>
              {errors.email ? <Text className="text-danger text-xs mt-1">{errors.email}</Text> : null}
            </View>

            {/* Telefone */}
            <View className="mb-3.5">
              <Text className={`text-xs font-medium mb-1.5 ${isDark ? "text-soft-line" : "text-mute"}`}>Telefone</Text>
              <View className={`flex-row items-center rounded-xl border px-3 py-2.5 ${
                isDark ? "border-white/10 bg-navy-2" : "border-rule bg-ground/50"
              }`}>
                <Phone size={16} color={isDark ? "#99b6e6" : "#6c778c"} />
                <FormattedTextInput
                  format="phone"
                  placeholder="(11) 99999-9999"
                  placeholderTextColor="#6c778c"
                  value={formData.phone}
                  onChangeText={(text) => updateField("phone", text)}
                  className={`flex-1 ml-2 text-sm p-0 ${isDark ? "text-paper" : "text-ink"}`}
                />
              </View>
              {errors.phone ? <Text className="text-danger text-xs mt-1">{errors.phone}</Text> : null}
            </View>

            {loadingLocations ? (
              <View className="flex-row items-center gap-2 mb-3.5" accessibilityLiveRegion="polite">
                <ActivityIndicator size="small" color="#1f6ae1" />
                <Text className={`text-xs ${isDark ? "text-soft-line" : "text-mute"}`}>
                  Carregando estados e cidades...
                </Text>
              </View>
            ) : locationsUnavailable ? (
              <ErrorState
                title="Localidades indisponíveis"
                message="Não foi possível obter os estados e cidades necessários para o cadastro. Tente novamente mais tarde."
                onRetry={() => { void retryLocations(); }}
              />
            ) : null}

            {/* Estado */}
            <View className="mb-3.5">
              <Text className={`text-xs font-medium mb-1.5 ${isDark ? "text-soft-line" : "text-mute"}`}>Estado</Text>
              <TouchableOpacity
                disabled={loadingLocations || locationsUnavailable}
                accessibilityState={{ disabled: loadingLocations || locationsUnavailable }}
                onPress={() => {
                  setOpenStateDropdown(!openStateDropdown);
                  setOpenCityDropdown(false);
                }}
                className={`w-full min-h-[44px] rounded-xl border px-3 py-2.5 flex-row items-center justify-between ${
                  isDark ? "border-white/10 bg-navy-2" : "border-rule bg-ground/50"
                }`}
              >
                <View className="flex-row items-center">
                  <MapPin size={16} color={isDark ? "#99b6e6" : "#6c778c"} />
                  <Text className={`ml-2 text-sm ${isDark ? "text-paper" : "text-ink"}`}>{currentStateName}</Text>
                </View>
                <ChevronDown size={16} color={isDark ? "#99b6e6" : "#6c778c"} />
              </TouchableOpacity>
              {openStateDropdown && !loadingLocations && !locationsUnavailable && (
                <View className={`mt-1 border rounded-xl max-h-40 overflow-hidden ${
                  isDark ? "bg-navy-2 border-white/10" : "bg-paper border-rule"
                }`}>
                  <ScrollView nestedScrollEnabled>
                    {states.map((s) => (
                      <TouchableOpacity
                        key={s.id}
                        onPress={() => handleStateSelect(s.id)}
                        className={`px-3 py-2.5 flex-row items-center justify-between border-b ${
                          isDark ? "border-white/10" : "border-rule/50"
                        }`}
                      >
                        <Text className={`text-sm ${isDark ? "text-paper" : "text-body"}`}>{s.name} ({s.uf})</Text>
                        {selectedStateId === s.id && <Check size={14} color="#1f6ae1" />}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Cidade */}
            <View className="mb-3.5">
              <Text className={`text-xs font-medium mb-1.5 ${isDark ? "text-soft-line" : "text-mute"}`}>Cidade</Text>
              <TouchableOpacity
                disabled={loadingLocations || locationsUnavailable || availableCities.length === 0}
                accessibilityState={{ disabled: loadingLocations || locationsUnavailable || availableCities.length === 0 }}
                onPress={() => {
                  setOpenCityDropdown(!openCityDropdown);
                  setOpenStateDropdown(false);
                }}
                className={`w-full min-h-[44px] rounded-xl border px-3 py-2.5 flex-row items-center justify-between ${
                  isDark ? "border-white/10 bg-navy-2" : "border-rule bg-ground/50"
                }`}
              >
                <View className="flex-row items-center">
                  <MapPin size={16} color={isDark ? "#99b6e6" : "#6c778c"} />
                  <Text className={`ml-2 text-sm ${isDark ? "text-paper" : "text-ink"}`}>{currentCityName}</Text>
                </View>
                <ChevronDown size={16} color={isDark ? "#99b6e6" : "#6c778c"} />
              </TouchableOpacity>
              {openCityDropdown && !loadingLocations && !locationsUnavailable && (
                <View className={`mt-1 border rounded-xl max-h-40 overflow-hidden ${
                  isDark ? "bg-navy-2 border-white/10" : "bg-paper border-rule"
                }`}>
                  <ScrollView nestedScrollEnabled>
                    {availableCities.map((c) => (
                      <TouchableOpacity
                        key={c.id}
                        onPress={() => {
                          selectCity(c.id);
                          setOpenCityDropdown(false);
                        }}
                        className={`px-3 py-2.5 flex-row items-center justify-between border-b ${
                          isDark ? "border-white/10" : "border-rule/50"
                        }`}
                      >
                        <Text className={`text-sm ${isDark ? "text-paper" : "text-body"}`}>{c.name}</Text>
                        {selectedCityId === c.id && <Check size={14} color="#1f6ae1" />}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
              {!loadingLocations && !locationsUnavailable && availableCities.length === 0 && (
                <Text className="text-danger text-xs mt-1">
                  Nenhuma cidade disponível neste estado. Selecione outro estado.
                </Text>
              )}
              {errors.city ? <Text className="text-danger text-xs mt-1">{errors.city}</Text> : null}
            </View>

            {/* Senha */}
            <View className="mb-3.5">
              <Text className={`text-xs font-medium mb-1.5 ${isDark ? "text-soft-line" : "text-mute"}`}>Senha (mínimo 8 caracteres)</Text>
              <View className={`flex-row items-center rounded-xl border px-3 py-2.5 ${
                isDark ? "border-white/10 bg-navy-2" : "border-rule bg-ground/50"
              }`}>
                <Lock size={16} color={isDark ? "#99b6e6" : "#6c778c"} />
                <TextInput
                  placeholder="Mínimo 8 caracteres"
                  placeholderTextColor="#6c778c"
                  secureTextEntry={!showPassword}
                  value={formData.senha}
                  onChangeText={(text) => updateField("senha", text)}
                  className={`flex-1 ml-2 text-sm p-0 ${isDark ? "text-paper" : "text-ink"}`}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <Eye size={16} color={isDark ? "#99b6e6" : "#6c778c"} />
                  ) : (
                    <EyeOff size={16} color={isDark ? "#99b6e6" : "#6c778c"} />
                  )}
                </TouchableOpacity>
              </View>
              {errors.senha ? <Text className="text-danger text-xs mt-1">{errors.senha}</Text> : null}
            </View>

            {/* Confirmar Senha */}
            <View className="mb-5">
              <Text className={`text-xs font-medium mb-1.5 ${isDark ? "text-soft-line" : "text-mute"}`}>Confirmar Senha</Text>
              <View className={`flex-row items-center rounded-xl border px-3 py-2.5 ${
                isDark ? "border-white/10 bg-navy-2" : "border-rule bg-ground/50"
              }`}>
                <Lock size={16} color={isDark ? "#99b6e6" : "#6c778c"} />
                <TextInput
                  placeholder="Repita sua senha"
                  placeholderTextColor="#6c778c"
                  secureTextEntry={!showConfirmPassword}
                  value={formData.confirmarSenha}
                  onChangeText={(text) => updateField("confirmarSenha", text)}
                  className={`flex-1 ml-2 text-sm p-0 ${isDark ? "text-paper" : "text-ink"}`}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? (
                    <Eye size={16} color={isDark ? "#99b6e6" : "#6c778c"} />
                  ) : (
                    <EyeOff size={16} color={isDark ? "#99b6e6" : "#6c778c"} />
                  )}
                </TouchableOpacity>
              </View>
              {errors.confirmarSenha ? <Text className="text-danger text-xs mt-1">{errors.confirmarSenha}</Text> : null}
            </View>

            {/* Botão de Cadastro */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={isSubmitting || !canRegister}
              style={{ opacity: isSubmitting || !canRegister ? 0.5 : 1 }}
              activeOpacity={0.85}
              className="w-full rounded-xl bg-brand py-3.5 items-center justify-center"
            >
              {isSubmitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-paper text-base font-semibold">Cadastrar</Text>
              )}
            </TouchableOpacity>

            {/* Link de Retorno */}
            <View className="flex-row items-center justify-center mt-5">
              <Text className={`text-sm ${isDark ? "text-soft-line" : "text-mute"}`}>Já tem uma conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
                <Text className="text-sm text-brand font-semibold">Entrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
