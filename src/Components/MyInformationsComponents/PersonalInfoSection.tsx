import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { User, Mail, Phone, MapPin, ChevronDown, Save, Lock, Check } from "lucide-react-native";
import type { StateApiDTO, CityApiDTO } from "../../Types/types";

interface PersonalInfoSectionProps {
  isDark: boolean;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  handleCancel: () => void;
  formName: string;
  setFormName: (value: string) => void;
  formEmail: string;
  setFormEmail: (value: string) => void;
  formPhone: string;
  setFormPhone: (value: string) => void;
  cityNameText: string;
  openStateDropdown: boolean;
  setOpenStateDropdown: (value: boolean) => void;
  openCityDropdown: boolean;
  setOpenCityDropdown: (value: boolean) => void;
  states: StateApiDTO[];
  selectedStateId: number | null;
  handleStateSelect: (stateId: number) => void;
  cities: CityApiDTO[];
  formCityId: number;
  availableCities: CityApiDTO[];
  setFormCityId: (value: number) => void;
  formPassword: string;
  setFormPassword: (value: string) => void;
  handleSave: () => Promise<void>;
  isSaving: boolean;
}

export function PersonalInfoSection({
  isDark,
  isEditing,
  setIsEditing,
  handleCancel,
  formName,
  setFormName,
  formEmail,
  setFormEmail,
  formPhone,
  setFormPhone,
  cityNameText,
  openStateDropdown,
  setOpenStateDropdown,
  openCityDropdown,
  setOpenCityDropdown,
  states,
  selectedStateId,
  handleStateSelect,
  cities,
  formCityId,
  availableCities,
  setFormCityId,
  formPassword,
  setFormPassword,
  handleSave,
  isSaving,
}: PersonalInfoSectionProps) {
  return (
    <View className={`rounded-3xl p-6 mb-5 border ${
      isDark ? "bg-navy border-white/10" : "bg-paper border-rule"
    }`}>
      <View className="flex-row items-center justify-between mb-4">
        <Text className={`text-base font-bold ${isDark ? "text-paper" : "text-navy"}`}>Informações Pessoais</Text>
        {!isEditing ? (
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            className={`px-3 py-1.5 rounded-lg ${isDark ? "bg-navy-2 border border-white/10" : "bg-lightBlue"}`}
          >
            <Text className={`text-xs font-semibold ${isDark ? "text-soft" : "text-blue"}`}>Editar</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleCancel} className="px-3 py-1.5">
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
            value={formName}
            onChangeText={setFormName}
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
            value={formEmail}
            onChangeText={setFormEmail}
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
          <TextInput
            editable={isEditing}
            value={formPhone}
            onChangeText={setFormPhone}
            placeholder="(00) 00000-0000"
            placeholderTextColor="#6c778c"
            keyboardType="phone-pad"
            className={`flex-1 ml-2 text-sm p-0 ${isDark ? "text-paper" : "text-ink"}`}
          />
        </View>
      </View>

      {/* Campo Cidade e Estado */}
      {!isEditing ? (
        <View className="mb-4">
          <Text className={`text-xs font-medium mb-1.5 ${isDark ? "text-soft-line" : "text-mute"}`}>Cidade e Estado</Text>
          <View className={`flex-row items-center rounded-xl border px-3 py-2.5 ${
            isDark ? "border-white/10 bg-navy-2/60" : "border-rule bg-ground/50"
          }`}>
            <MapPin size={16} color={isDark ? "#99b6e6" : "#6c778c"} />
            <Text className={`flex-1 ml-2 text-sm ${isDark ? "text-paper" : "text-ink"}`}>{cityNameText}</Text>
          </View>
        </View>
      ) : (
        <View className="mb-4">
          {/* Dropdown Estado */}
          <View className="mb-4">
            <Text className={`text-xs font-medium mb-1.5 ${isDark ? "text-soft-line" : "text-mute"}`}>Estado</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setOpenStateDropdown(!openStateDropdown);
                setOpenCityDropdown(false);
              }}
              className={`w-full min-h-[46px] rounded-xl border px-3.5 py-2.5 flex-row items-center justify-between ${
                openStateDropdown
                  ? (isDark ? "border-brand bg-navy-2" : "border-brand bg-paper")
                  : (isDark ? "border-white/10 bg-navy-2" : "border-rule bg-ground/50")
              }`}
            >
              <View className="flex-row items-center flex-1 mr-2">
                <MapPin size={16} color={isDark ? "#99b6e6" : "#6c778c"} className="mr-2.5" />
                <Text className={`text-sm font-medium ml-2 ${isDark ? "text-paper" : "text-ink"}`}>
                  {states.find((s) => s.id === selectedStateId)?.name || "Selecione o Estado"}
                </Text>
              </View>
              <ChevronDown
                size={16}
                color={isDark ? "#99b6e6" : "#6c778c"}
                style={{ transform: [{ rotate: openStateDropdown ? "180deg" : "0deg" }] }}
              />
            </TouchableOpacity>

            {openStateDropdown && (
              <View className={`mt-1.5 border rounded-2xl overflow-hidden max-h-52 ${
                isDark ? "bg-navy-2 border-white/10" : "bg-paper border-rule-2"
              }`}>
                <ScrollView nestedScrollEnabled>
                  {states.map((st, index) => {
                    const isSelected = st.id === selectedStateId;
                    return (
                      <TouchableOpacity
                        key={st.id}
                        activeOpacity={0.7}
                        onPress={() => handleStateSelect(st.id)}
                        className={`px-4 py-3 flex-row items-center justify-between ${
                          isSelected
                            ? (isDark ? "bg-navy" : "bg-soft/50")
                            : (isDark ? "bg-navy-2" : "bg-paper")
                        } ${index < states.length - 1 ? (isDark ? "border-b border-white/10" : "border-b border-rule-2/70") : ""}`}
                      >
                        <Text className={`text-sm ${
                          isSelected ? "text-brand font-semibold" : (isDark ? "text-paper" : "text-body")
                        }`}>
                          {st.name} ({st.uf})
                        </Text>
                        {isSelected && <Check size={16} color="#1f6ae1" />}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Dropdown Cidade */}
          <View className="mb-1">
            <Text className={`text-xs font-medium mb-1.5 ${isDark ? "text-soft-line" : "text-mute"}`}>Cidade</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setOpenCityDropdown(!openCityDropdown);
                setOpenStateDropdown(false);
              }}
              className={`w-full min-h-[46px] rounded-xl border px-3.5 py-2.5 flex-row items-center justify-between ${
                openCityDropdown
                  ? (isDark ? "border-brand bg-navy-2" : "border-brand bg-paper")
                  : (isDark ? "border-white/10 bg-navy-2" : "border-rule bg-ground/50")
              }`}
            >
              <View className="flex-row items-center flex-1 mr-2">
                <MapPin size={16} color={isDark ? "#99b6e6" : "#6c778c"} className="mr-2.5" />
                <Text className={`text-sm font-medium ml-2 ${isDark ? "text-paper" : "text-ink"}`}>
                  {cities.find((c) => c.id === formCityId)?.name || "Selecione a Cidade"}
                </Text>
              </View>
              <ChevronDown
                size={16}
                color={isDark ? "#99b6e6" : "#6c778c"}
                style={{ transform: [{ rotate: openCityDropdown ? "180deg" : "0deg" }] }}
              />
            </TouchableOpacity>

            {openCityDropdown && (
              <View className={`mt-1.5 border rounded-2xl overflow-hidden max-h-52 ${
                isDark ? "bg-navy-2 border-white/10" : "bg-paper border-rule-2"
              }`}>
                <ScrollView nestedScrollEnabled>
                  {availableCities.map((ct, index) => {
                    const isSelected = ct.id === formCityId;
                    return (
                      <TouchableOpacity
                        key={ct.id}
                        activeOpacity={0.7}
                        onPress={() => {
                          setFormCityId(ct.id);
                          setOpenCityDropdown(false);
                        }}
                        className={`px-4 py-3 flex-row items-center justify-between ${
                          isSelected
                            ? (isDark ? "bg-navy" : "bg-soft/50")
                            : (isDark ? "bg-navy-2" : "bg-paper")
                        } ${index < availableCities.length - 1 ? (isDark ? "border-b border-white/10" : "border-b border-rule-2/70") : ""}`}
                      >
                        <Text className={`text-sm ${
                          isSelected ? "text-brand font-semibold" : (isDark ? "text-paper" : "text-body")
                        }`}>
                          {ct.name}
                        </Text>
                        {isSelected && <Check size={16} color="#1f6ae1" />}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Campo Nova Senha (Opcional durante edição) */}
      {isEditing && (
        <View className="mb-4">
          <Text className={`text-xs font-medium mb-1.5 ${isDark ? "text-soft-line" : "text-mute"}`}>Nova Senha (Opcional)</Text>
          <View className={`flex-row items-center rounded-xl border border-brand px-3 py-2.5 ${
            isDark ? "bg-navy-2" : "bg-paper"
          }`}>
            <Lock size={16} color={isDark ? "#99b6e6" : "#6c778c"} />
            <TextInput
              value={formPassword}
              onChangeText={setFormPassword}
              placeholder="Mínimo 8 dígitos (deixe em branco para manter)"
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
          onPress={handleSave}
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
