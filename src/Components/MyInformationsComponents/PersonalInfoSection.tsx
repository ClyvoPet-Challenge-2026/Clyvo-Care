import { FormattedTextInput } from "../FormattedTextInput";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { User, Mail, Phone, Save, Lock } from "lucide-react-native";
import type { PersonalInfoSectionProps } from "../../Types/types";


export function PersonalInfoSection({ isDark, form, children }: PersonalInfoSectionProps) {
  const { values, updateField, isEditing, isSaving, startEditing, cancel, save } = form;
  return (
    <View className={`rounded-3xl p-6 mb-5 border ${
      isDark ? "bg-navy border-white/10" : "bg-paper border-rule"
    }`}>
      <View className="flex-row items-center justify-between mb-4">
        <Text className={`text-base font-bold ${isDark ? "text-paper" : "text-navy"}`}>Informações Pessoais</Text>
        {!isEditing ? (
          <TouchableOpacity
            onPress={startEditing}
            className={`px-3 py-1.5 rounded-lg ${isDark ? "bg-navy-2 border border-white/10" : "bg-lightBlue"}`}
          >
            <Text className={`text-xs font-semibold ${isDark ? "text-soft" : "text-blue"}`}>Editar</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={cancel} className="px-3 py-1.5">
            <Text className={`text-xs font-semibold ${isDark ? "text-soft-line" : "text-mute"}`}>Cancelar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Campo Nome */}
      <View className="mb-4">
        <Text className={`text-xs font-medium mb-1.5 ${isDark ? "text-soft-line" : "text-mute"}`}>Nome Completo</Text>
        <View
          className={`flex-row items-center rounded-xl border px-3 py-2.5 ${
            isEditing
              ? (isDark ? "border-brand bg-navy-2" : "border-brand bg-paper")
              : (isDark ? "border-white/10 bg-navy-2/60" : "border-rule bg-ground/50")
          }`}
        >
          <User size={16} color={isDark ? "#99b6e6" : "#6c778c"} />
          <TextInput
            editable={isEditing}
            value={values.name}
            onChangeText={(value) => updateField("name", value)}
            placeholder="Seu nome completo"
            placeholderTextColor="#6c778c"
            className={`flex-1 ml-2 text-sm p-0 ${isDark ? "text-paper" : "text-ink"}`}
          />
        </View>
      </View>

      {/* Campo E-mail Registrado */}
      <View className="mb-4">
        <Text className={`text-xs font-medium mb-1.5 ${isDark ? "text-soft-line" : "text-mute"}`}>E-mail Registrado</Text>
        <View
          className={`flex-row items-center rounded-xl border px-3 py-2.5 ${
            isEditing
              ? (isDark ? "border-brand bg-navy-2" : "border-brand bg-paper")
              : (isDark ? "border-white/10 bg-navy-2/60" : "border-rule bg-ground/50")
          }`}
        >
          <Mail size={16} color={isDark ? "#99b6e6" : "#6c778c"} />
          <TextInput
            editable={isEditing}
            value={values.email}
            onChangeText={(value) => updateField("email", value)}
            placeholder="seu.email@exemplo.com"
            placeholderTextColor="#6c778c"
            keyboardType="email-address"
            autoCapitalize="none"
            className={`flex-1 ml-2 text-sm p-0 ${isDark ? "text-paper" : "text-ink"}`}
          />
        </View>
      </View>

      {/* Campo Telefone */}
      <View className="mb-4">
        <Text className={`text-xs font-medium mb-1.5 ${isDark ? "text-soft-line" : "text-mute"}`}>Telefone / WhatsApp</Text>
        <View
          className={`flex-row items-center rounded-xl border px-3 py-2.5 ${
            isEditing
              ? (isDark ? "border-brand bg-navy-2" : "border-brand bg-paper")
              : (isDark ? "border-white/10 bg-navy-2/60" : "border-rule bg-ground/50")
          }`}
        >
          <Phone size={16} color={isDark ? "#99b6e6" : "#6c778c"} />
          <FormattedTextInput
            format="phone"
            editable={isEditing}
            value={values.phone}
            onChangeText={(value) => updateField("phone", value)}
            placeholder="(00) 00000-0000"
            placeholderTextColor="#6c778c"
            className={`flex-1 ml-2 text-sm p-0 ${isDark ? "text-paper" : "text-ink"}`}
          />
        </View>
      </View>

      {children}

      {/* Senha exigida pelo contrato de edição */}
      {isEditing && (
        <View className="mb-4">
          <Text className={`text-xs font-medium mb-1.5 ${isDark ? "text-soft-line" : "text-mute"}`}>Senha para salvar</Text>
          <View className={`flex-row items-center rounded-xl border border-brand px-3 py-2.5 ${
            isDark ? "bg-navy-2" : "bg-paper"
          }`}>
            <Lock size={16} color={isDark ? "#99b6e6" : "#6c778c"} />
            <TextInput
              value={values.password}
              onChangeText={(value) => updateField("password", value)}
              placeholder="Senha de acesso após salvar (8 a 100 caracteres)"
              placeholderTextColor="#6c778c"
              secureTextEntry
              className={`flex-1 ml-2 text-sm p-0 ${isDark ? "text-paper" : "text-ink"}`}
            />
          </View>
        </View>
      )}

      {/* Botão Salvar com TanStack Query Mutation */}
      {isEditing && (
        <TouchableOpacity
          onPress={save}
          disabled={isSaving}
          activeOpacity={0.85}
          className="w-full rounded-xl bg-brand py-3.5 items-center justify-center flex-row gap-2 mt-2"
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <Save size={16} color="#ffffff" />
              <Text className="text-paper text-base font-semibold">Salvar Alterações</Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}
