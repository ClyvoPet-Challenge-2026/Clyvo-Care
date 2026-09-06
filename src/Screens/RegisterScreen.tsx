import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Mail, Lock, Eye, EyeOff } from "lucide-react-native";
import { useAuth } from "../Context/AuthContext";
import { RegisterScreenProps } from "../Types/types";

interface FormData {
  email: string;
  senha: string;
  confirmarSenha: string;
}

export function RegisterScreen({ navigation }: RegisterScreenProps) {
  const { login } = useAuth();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [formData, setFormData] = useState<FormData>({
    email: "",
    senha: "",
    confirmarSenha: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    senha: "",
    confirmarSenha: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors = { email: "", senha: "", confirmarSenha: "" };
    let isValid = true;

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email inválido";
      isValid = false;
    }

    if (formData.senha.length < 6) {
      newErrors.senha = "Senha deve ter no mínimo 6 caracteres";
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
    if (validateForm()) {
      await login();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-blue"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
        className="px-6 py-10"
      >
        <View className="w-full max-w-sm mx-auto">
          {/* Header da Logo e Título */}
          <View className="items-center mb-6">

              <Image
                source={require("../../assets/Logo-ClyvoCare.png")}
                className="w-40 h-40"
                resizeMode="contain"
              />
            <Text className="text-2xl font-bold text-paper">Crie sua conta</Text>
            <Text className="text-xs text-soft opacity-90 mt-1">
              É rápido e gratuito
            </Text>
          </View>

          {/* Card do Formulário */}
          <View
            className="bg-paper rounded-3xl p-6"
            style={{
              shadowColor: "#0c0d10",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.1,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            {/* Campo E-mail */}
            <View className="mb-4">
              <Text className="text-xs font-medium text-mute mb-1.5">
                E-mail
              </Text>
              <View className="flex-row items-center rounded-xl border border-rule bg-ground/50 px-3 py-2.5">
                <Mail size={16} color="#6c778c" />
                <TextInput
                  placeholder="voce@email.com"
                  placeholderTextColor="#6c778c"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) =>
                    setFormData({ ...formData, email: text })
                  }
                  className="flex-1 ml-2 text-sm text-ink p-0"
                />
              </View>
              {errors.email ? (
                <Text className="text-danger text-xs mt-1">{errors.email}</Text>
              ) : null}
            </View>

            {/* Campo Senha */}
            <View className="mb-4">
              <Text className="text-xs font-medium text-mute mb-1.5">Senha</Text>
              <View className="flex-row items-center rounded-xl border border-rule bg-ground/50 px-3 py-2.5">
                <Lock size={16} color="#6c778c" />
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor="#6c778c"
                  secureTextEntry={!showPassword}
                  value={formData.senha}
                  onChangeText={(text) =>
                    setFormData({ ...formData, senha: text })
                  }
                  className="flex-1 ml-2 text-sm text-ink p-0"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  className="pl-2"
                >
                  {showPassword ? (
                    <Eye size={16} color="#6c778c" />
                  ) : (
                    <EyeOff size={16} color="#6c778c" />
                  )}
                </TouchableOpacity>
              </View>
              {errors.senha ? (
                <Text className="text-danger text-xs mt-1">{errors.senha}</Text>
              ) : null}
            </View>

            {/* Campo Confirmar Senha */}
            <View className="mb-5">
              <Text className="text-xs font-medium text-mute mb-1.5">
                Repetir senha
              </Text>
              <View className="flex-row items-center rounded-xl border border-rule bg-ground/50 px-3 py-2.5">
                <Lock size={16} color="#6c778c" />
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor="#6c778c"
                  secureTextEntry={!showConfirmPassword}
                  value={formData.confirmarSenha}
                  onChangeText={(text) =>
                    setFormData({ ...formData, confirmarSenha: text })
                  }
                  className="flex-1 ml-2 text-sm text-ink p-0"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  className="pl-2"
                >
                  {showConfirmPassword ? (
                    <Eye size={16} color="#6c778c" />
                  ) : (
                    <EyeOff size={16} color="#6c778c" />
                  )}
                </TouchableOpacity>
              </View>
              {errors.confirmarSenha ? (
                <Text className="text-danger text-xs mt-1">
                  {errors.confirmarSenha}
                </Text>
              ) : null}
            </View>

            {/* Botão Cadastrar */}
            <TouchableOpacity
              onPress={handleRegister}
              activeOpacity={0.85}
              className="w-full rounded-xl bg-brand py-3.5 items-center justify-center"
              style={{
                shadowColor: "#1f6ae1",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 4,
              }}
            >
              <Text className="text-paper text-base font-semibold">
                Cadastrar
              </Text>
            </TouchableOpacity>

            {/* Link para Login */}
            <View className="flex-row items-center justify-center mt-5">
              <Text className="text-sm text-mute">Já tem conta? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("LoginScreen")}
              >
                <Text className="text-sm text-brand font-semibold">Entrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}