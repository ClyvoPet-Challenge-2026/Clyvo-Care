import { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Eye, EyeOff } from "lucide-react-native/icons";
import { useAuth } from "../Context/AuthContext";

interface FormData {
  email: string;
  senha: string;
  confirmarSenha: string;
}

export function RegisterScreen() {
  const navigation = useNavigation();
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
      newErrors.senha = "Senha deve ter mínimo 6 caracteres";
      isValid = false;
    }

    if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = "Senhas não conferem";
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
    <View className="flex-1 items-center justify-center bg-white px-6">
      <View className="w-full max-w-xs">
        <Text className="text-neutral-900 text-3xl font-bold text-center mb-8">
          Criar Conta
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

        <View className="w-full mb-5">
          <Text className="text-neutral-700 text-sm font-semibold mb-2">
            Senha
          </Text>
          <TextInput
            placeholder="••••••"
            placeholderTextColor="#9ca3af"
            className="w-full h-12 bg-neutral-50 border border-neutral-300 rounded-lg px-4 text-neutral-900"
            value={formData.senha}
            onChangeText={(text) =>
              setFormData({ ...formData, senha: text })
            }
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-4 mt-10 flex items-center justify-center"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </TouchableOpacity>
          {errors.senha ? (
            <Text className="text-red-500 text-xs mt-1">{errors.senha}</Text>
          ) : null}
        </View>

        <View className="w-full mb-8">
          <Text className="text-neutral-700 text-sm font-semibold mb-2">
            Confirmar Senha
          </Text>
          <TextInput
            placeholder="••••••"
            placeholderTextColor="#9ca3af"
            className="w-full h-12 bg-neutral-50 border border-neutral-300 rounded-lg px-4 text-neutral-900"
            value={formData.confirmarSenha}
            onChangeText={(text) =>
              setFormData({ ...formData, confirmarSenha: text })
            }
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 mt-10 flex items-center justify-center"
            >
              {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </TouchableOpacity>
          {errors.confirmarSenha ? (
            <Text className="text-red-500 text-xs mt-1">
              {errors.confirmarSenha}
            </Text>
          ) : null}
        </View>

        <TouchableOpacity
          onPress={handleRegister}
          className="bg-blue-500 rounded-lg p-4 w-full items-center active:bg-blue-600"
        >
          <Text className="text-white text-lg font-semibold">Registrar</Text>
        </TouchableOpacity>

        <View className="flex-row mt-6 items-center justify-center">
          <Text className="text-neutral-600 text-sm">
            Já tem uma conta?{" "}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("LoginScreen")}
          >
            <Text className="text-blue-500 text-sm font-semibold">
              Faça login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}