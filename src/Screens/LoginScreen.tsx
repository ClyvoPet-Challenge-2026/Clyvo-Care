import { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Eye, EyeOff } from "lucide-react-native"


interface FormData {
  email: string;
  senha: string;
}

export function LoginScreen() {
  const navigation = useNavigation();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [formData, setFormData] = useState<FormData>({ email: "", senha: "" });
  const [errors, setErrors] = useState({ email: "", senha: "" });
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = { email: "", senha: "" };
    let isValid = true;

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email inválido";
      isValid = false;
    }

    if (formData.senha.length < 6) {
      newErrors.senha = "Senha deve ter mínimo 6 caracteres";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = () => {
    if (validateForm()) {
      navigation.navigate("MainScreen");
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <View className="w-full max-w-xs">
        <Text className="text-neutral-900 text-3xl font-bold text-center mb-8">
          Bem-vindo
        </Text>

        <View className="w-full mb-5">
          <Text className="text-neutral-700 text-sm font-semibold mb-2">
            Email
          </Text>
          <TextInput
            placeholder="seu@email.com"
            placeholderTextColor="#9ca3af"
            className="w-full h-12 bg-neutral-50 border border-neutral-300 rounded-lg px-4 text-neutral-900"
            value={formData.email}
            onChangeText={(text) =>
              setFormData({ ...formData, email: text })
            }
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email ? (
            <Text className="text-red-500 text-xs mt-1">{errors.email}</Text>
          ) : null}
        </View>

        <View className="w-full mb-8">
          <Text className="text-neutral-700 text-sm font-semibold mb-2">
            Senha
          </Text>
          <View className="relative">
            <TextInput
              placeholder="••••••"
              placeholderTextColor="#9ca3af"
              className="w-full h-12 bg-neutral-50 border border-neutral-300 rounded-lg px-4 pr-12 text-neutral-900"
              value={formData.senha}
              onChangeText={(text) =>
                setFormData({ ...formData, senha: text })
              }
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-0 h-12 justify-center"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </TouchableOpacity>
          </View>
          {errors.senha ? (
            <Text className="text-red-500 text-xs mt-1">{errors.senha}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          className="bg-blue-500 rounded-lg p-4 w-full items-center active:bg-blue-600"
        >
          <Text className="text-white text-lg font-semibold">Entrar</Text>
        </TouchableOpacity>

        <View className="flex-row mt-6 items-center justify-center">
          <Text className="text-neutral-600 text-sm">
            Não tem uma conta?{" "}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("RegisterScreen")}
          >
            <Text className="text-blue-500 text-sm font-semibold">
              Registre-se
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
