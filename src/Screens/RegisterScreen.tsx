import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Mail, Lock, Eye, EyeOff, User, Phone, MapPin, ChevronDown, Check } from "lucide-react-native";
import { useAuth } from "../Context/AuthContext";
import { RegisterScreenProps, RegisterFormData, StateApiDTO, CityApiDTO } from "../Types/types";
import { getStates, getCities } from "../Services/auth";
import { DEFAULT_STATES, DEFAULT_CITIES } from "../Data/LocationGeoData";

export function RegisterScreen({ navigation }: RegisterScreenProps) {
  const { register } = useAuth();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    cpf: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    phone: "",
    cityId: 0,
  });

  const [states, setStates] = useState<StateApiDTO[]>([]);
  const [cities, setCities] = useState<CityApiDTO[]>([]);
  const [selectedStateId, setSelectedStateId] = useState<number | null>(null);

  const [openStateDropdown, setOpenStateDropdown] = useState(false);
  const [openCityDropdown, setOpenCityDropdown] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    loadLocationData();
  }, []);

  const loadLocationData = async () => {
    try {
      setLoadingLocations(true);
      const [statesData, citiesData] = await Promise.all([
        getStates(),
        getCities(),
      ]);

      if (statesData && statesData.length > 0) {
        setStates(statesData);
        setCities(citiesData || []);
        setSelectedStateId(statesData[0].id);
        const stateCities = (citiesData || []).filter((c) => c.state?.id === statesData[0].id);
        if (stateCities.length > 0) {
          setFormData((prev) => ({ ...prev, cityId: stateCities[0].id }));
        }
        return;
      }
    } catch (e) {
      console.warn("API de estados/cidades indisponível no momento, usando catálogo padrão:", e);
    } finally {
      setLoadingLocations(false);
    }

    // Fallback importado de src/Data/LocationGeoData.ts
    setStates(DEFAULT_STATES);
    setCities(DEFAULT_CITIES);
    setSelectedStateId(DEFAULT_STATES[0].id);
    setFormData((prev) => ({ ...prev, cityId: DEFAULT_CITIES[0].id }));
  };

  const handleStateSelect = (stateId: number) => {
    setSelectedStateId(stateId);
    setOpenStateDropdown(false);
    const filtered = cities.filter((c) => c.state?.id === stateId);
    if (filtered.length > 0) {
      setFormData((prev) => ({ ...prev, cityId: filtered[0].id }));
    } else {
      setFormData((prev) => ({ ...prev, cityId: 0 }));
    }
  };

  const formatCpf = (text: string) => {
    const cleaned = text.replace(/\D/g, "").slice(0, 11);
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
    if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
  };

  const formatPhone = (text: string) => {
    const cleaned = text.replace(/\D/g, "").slice(0, 11);
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Nome completo é obrigatório";
      isValid = false;
    }

    const rawCpf = formData.cpf.replace(/\D/g, "");
    if (rawCpf.length !== 11) {
      newErrors.cpf = "CPF deve conter 11 dígitos";
      isValid = false;
    }

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email inválido";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório";
      isValid = false;
    }

    if (!formData.cityId || formData.cityId === 0) {
      newErrors.city = "Selecione uma cidade";
      isValid = false;
    }

    if (formData.senha.length < 8) {
      newErrors.senha = "Senha deve ter no mínimo 8 caracteres (requisito da API)";
      isValid = false;
    }

    if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = "As senhas não coincidem";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    setApiError("");
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await register({
        ...formData,
        cpf: formData.cpf.replace(/\D/g, ""),
      });
    } catch (err: any) {
      setApiError(err.message || "Não foi possível realizar o cadastro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableCities = selectedStateId
    ? cities.filter((c) => c.state?.id === selectedStateId)
    : cities;

  const currentStateName =
    states.find((s) => s.id === selectedStateId)?.name || "Selecione o Estado";

  const currentCityName =
    cities.find((c) => c.id === formData.cityId)?.name || "Selecione a Cidade";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-blue"
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
            className="bg-paper rounded-3xl p-6 mb-8"
            style={{
              shadowColor: "#0c0d10",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.1,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            {apiError ? (
              <View className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <Text className="text-danger text-xs">{apiError}</Text>
              </View>
            ) : null}

            {/* Nome Completo */}
            <View className="mb-3.5">
              <Text className="text-xs font-medium text-mute mb-1.5">Nome Completo</Text>
              <View className="flex-row items-center rounded-xl border border-rule bg-ground/50 px-3 py-2.5">
                <User size={16} color="#6c778c" />
                <TextInput
                  placeholder="Seu nome"
                  placeholderTextColor="#6c778c"
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  className="flex-1 ml-2 text-sm text-ink p-0"
                />
              </View>
              {errors.name ? <Text className="text-danger text-xs mt-1">{errors.name}</Text> : null}
            </View>

            {/* CPF */}
            <View className="mb-3.5">
              <Text className="text-xs font-medium text-mute mb-1.5">CPF (11 dígitos)</Text>
              <View className="flex-row items-center rounded-xl border border-rule bg-ground/50 px-3 py-2.5">
                <TextInput
                  placeholder="000.000.000-00"
                  placeholderTextColor="#6c778c"
                  keyboardType="numeric"
                  value={formData.cpf}
                  onChangeText={(text) => setFormData({ ...formData, cpf: formatCpf(text) })}
                  className="flex-1 text-sm text-ink p-0"
                />
              </View>
              {errors.cpf ? <Text className="text-danger text-xs mt-1">{errors.cpf}</Text> : null}
            </View>

            {/* E-mail */}
            <View className="mb-3.5">
              <Text className="text-xs font-medium text-mute mb-1.5">E-mail</Text>
              <View className="flex-row items-center rounded-xl border border-rule bg-ground/50 px-3 py-2.5">
                <Mail size={16} color="#6c778c" />
                <TextInput
                  placeholder="voce@email.com"
                  placeholderTextColor="#6c778c"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  className="flex-1 ml-2 text-sm text-ink p-0"
                />
              </View>
              {errors.email ? <Text className="text-danger text-xs mt-1">{errors.email}</Text> : null}
            </View>

            {/* Telefone */}
            <View className="mb-3.5">
              <Text className="text-xs font-medium text-mute mb-1.5">Telefone</Text>
              <View className="flex-row items-center rounded-xl border border-rule bg-ground/50 px-3 py-2.5">
                <Phone size={16} color="#6c778c" />
                <TextInput
                  placeholder="(11) 99999-9999"
                  placeholderTextColor="#6c778c"
                  keyboardType="phone-pad"
                  value={formData.phone}
                  onChangeText={(text) => setFormData({ ...formData, phone: formatPhone(text) })}
                  className="flex-1 ml-2 text-sm text-ink p-0"
                />
              </View>
              {errors.phone ? <Text className="text-danger text-xs mt-1">{errors.phone}</Text> : null}
            </View>

            {/* Estado */}
            <View className="mb-3.5">
              <Text className="text-xs font-medium text-mute mb-1.5">Estado</Text>
              <TouchableOpacity
                onPress={() => setOpenStateDropdown(!openStateDropdown)}
                className="w-full min-h-[44px] rounded-xl border border-rule bg-ground/50 px-3 py-2.5 flex-row items-center justify-between"
              >
                <View className="flex-row items-center">
                  <MapPin size={16} color="#6c778c" />
                  <Text className="ml-2 text-sm text-ink">{currentStateName}</Text>
                </View>
                <ChevronDown size={16} color="#6c778c" />
              </TouchableOpacity>
              {openStateDropdown && (
                <View className="mt-1 bg-paper border border-rule rounded-xl max-h-40 overflow-hidden">
                  <ScrollView nestedScrollEnabled>
                    {states.map((s) => (
                      <TouchableOpacity
                        key={s.id}
                        onPress={() => handleStateSelect(s.id)}
                        className="px-3 py-2.5 flex-row items-center justify-between border-b border-rule/50"
                      >
                        <Text className="text-sm text-body">{s.name} ({s.uf})</Text>
                        {selectedStateId === s.id && <Check size={14} color="#1f6ae1" />}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Cidade */}
            <View className="mb-3.5">
              <Text className="text-xs font-medium text-mute mb-1.5">Cidade</Text>
              <TouchableOpacity
                onPress={() => setOpenCityDropdown(!openCityDropdown)}
                className="w-full min-h-[44px] rounded-xl border border-rule bg-ground/50 px-3 py-2.5 flex-row items-center justify-between"
              >
                <View className="flex-row items-center">
                  <MapPin size={16} color="#6c778c" />
                  <Text className="ml-2 text-sm text-ink">{currentCityName}</Text>
                </View>
                <ChevronDown size={16} color="#6c778c" />
              </TouchableOpacity>
              {openCityDropdown && (
                <View className="mt-1 bg-paper border border-rule rounded-xl max-h-40 overflow-hidden">
                  <ScrollView nestedScrollEnabled>
                    {availableCities.map((c) => (
                      <TouchableOpacity
                        key={c.id}
                        onPress={() => {
                          setFormData({ ...formData, cityId: c.id });
                          setOpenCityDropdown(false);
                        }}
                        className="px-3 py-2.5 flex-row items-center justify-between border-b border-rule/50"
                      >
                        <Text className="text-sm text-body">{c.name}</Text>
                        {formData.cityId === c.id && <Check size={14} color="#1f6ae1" />}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
              {errors.city ? <Text className="text-danger text-xs mt-1">{errors.city}</Text> : null}
            </View>

            {/* Senha */}
            <View className="mb-3.5">
              <Text className="text-xs font-medium text-mute mb-1.5">Senha (mínimo 8 caracteres)</Text>
              <View className="flex-row items-center rounded-xl border border-rule bg-ground/50 px-3 py-2.5">
                <Lock size={16} color="#6c778c" />
                <TextInput
                  placeholder="Mínimo 8 caracteres"
                  placeholderTextColor="#6c778c"
                  secureTextEntry={!showPassword}
                  value={formData.senha}
                  onChangeText={(text) => setFormData({ ...formData, senha: text })}
                  className="flex-1 ml-2 text-sm text-ink p-0"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? <Eye size={16} color="#6c778c" /> : <EyeOff size={16} color="#6c778c" />}
                </TouchableOpacity>
              </View>
              {errors.senha ? <Text className="text-danger text-xs mt-1">{errors.senha}</Text> : null}
            </View>

            {/* Confirmar Senha */}
            <View className="mb-5">
              <Text className="text-xs font-medium text-mute mb-1.5">Confirmar Senha</Text>
              <View className="flex-row items-center rounded-xl border border-rule bg-ground/50 px-3 py-2.5">
                <Lock size={16} color="#6c778c" />
                <TextInput
                  placeholder="Repita sua senha"
                  placeholderTextColor="#6c778c"
                  secureTextEntry={!showConfirmPassword}
                  value={formData.confirmarSenha}
                  onChangeText={(text) => setFormData({ ...formData, confirmarSenha: text })}
                  className="flex-1 ml-2 text-sm text-ink p-0"
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <Eye size={16} color="#6c778c" /> : <EyeOff size={16} color="#6c778c" />}
                </TouchableOpacity>
              </View>
              {errors.confirmarSenha ? <Text className="text-danger text-xs mt-1">{errors.confirmarSenha}</Text> : null}
            </View>

            {/* Botão de Cadastro */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={isSubmitting}
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
              <Text className="text-sm text-mute">Já tem uma conta? </Text>
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
