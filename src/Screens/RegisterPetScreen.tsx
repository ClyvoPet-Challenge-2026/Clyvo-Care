import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Camera, Image as ImageIcon, Sparkles, Check, User, Calendar, Tag, Dna } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../Types/types';
import { useTheme } from '../Context/ThemeContext';
import { usePetForm } from '../Hooks/usePetForm';
import { Dropdown } from '../Components/Dropdown';

export function RegisterPet() {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<RootStackParamList, 'RegisterPet'>>();
    const { isDark } = useTheme();
    const {
        isEditing,
        isSaving,
        petName,
        setPetName,
        petBirthDate,
        setPetBirthDate,
        unknownBirthDate,
        toggleUnknownBirthDate,
        petTutor,
        setPetTutor,
        selectedSex,
        setSelectedSex,
        selectedSpecie,
        selectedBreed,
        setSelectedBreed,
        specieOptions,
        breedOptions,
        selectedPetImage,
        handleSpecieSelect,
        handleSavePet,
    } = usePetForm({
        petToEdit: route.params?.petToEdit,
        onSuccess: () => navigation.goBack(),
    });

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
                {/* Card de Foto e Apresentação do Pet */}
                <View className={`rounded-3xl p-5 mb-5 border items-center ${
                    isDark ? "bg-navy border-white/10" : "bg-paper border-rule"
                }`}>
                    <View className="relative">
                        <View className={`w-24 h-24 rounded-full items-center justify-center overflow-hidden border-2 shadow-sm ${
                            isDark ? "bg-navy-2 border-white/10" : "bg-soft border-soft"
                        }`}>
                            {selectedPetImage ? (
                                <Image
                                    source={selectedPetImage}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            ) : (
                                <Sparkles size={32} color="#1f6ae1" />
                            )}
                        </View>
                    </View>

                    <View className="items-center mt-3">
                        <Text className={`text-sm font-semibold ${isDark ? "text-paper" : "text-navy"}`}>
                            {petName.trim() ? petName : "Nome do Pet"}
                        </Text>
                        <Text className={`text-xs mt-0.5 ${isDark ? "text-soft-line" : "text-mute"}`}>
                            Padrão: {selectedSpecie || "Geral"} • {selectedBreed || "Raça"}
                        </Text>
                    </View>

                    {/* Botões de Ação de Foto */}
                    <View className="flex-row gap-3 mt-4 w-full justify-center">
                        <TouchableOpacity 
                            activeOpacity={0.8} 
                            className={`flex-row items-center justify-center gap-2 rounded-xl py-2.5 px-4 flex-1 border ${
                                isDark ? "bg-navy-2 border-white/10" : "bg-lightBlue border-brand/20"
                            }`}
                        >
                            <Camera size={16} color="#1f6ae1" />
                            <Text className="text-brand text-xs font-semibold">Tirar Foto</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            className={`flex-row items-center justify-center gap-2 rounded-xl py-2.5 px-4 flex-1 border ${
                                isDark ? "bg-navy-2 border-white/10" : "bg-ground border-rule"
                            }`}
                        >
                            <ImageIcon size={16} color={isDark ? "#99b6e6" : "#6c778c"} />
                            <Text className={`text-xs font-semibold ${isDark ? "text-soft" : "text-soft-ink"}`}>Galeria</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Card de Formulário */}
                <View className={`rounded-3xl p-5 border ${
                    isDark ? "bg-navy border-white/10" : "bg-paper border-rule"
                }`}>
                    <Text className={`text-base font-bold mb-4 ${isDark ? "text-paper" : "text-navy"}`}>
                        {isEditing ? "Editar Informações do Pet" : "Informações do Pet"}
                    </Text>

                    {/* Input: Nome do Pet */}
                    <View className="mb-4">
                        <Text className={`text-xs font-medium mb-1.5 ${isDark ? "text-soft-line" : "text-mute"}`}>Nome do Pet</Text>
                        <View className={`flex-row items-center rounded-xl border px-3 py-2.5 ${
                            isDark ? "border-white/10 bg-navy-2" : "border-rule bg-ground/50"
                        }`}>
                            <Tag size={16} color={isDark ? "#99b6e6" : "#6c778c"} />
                            <TextInput
                                placeholder="Nome do seu pet"
                                placeholderTextColor="#6c778c"
                                className={`flex-1 ml-2 text-sm p-0 ${isDark ? "text-paper" : "text-ink"}`}
                                value={petName}
                                onChangeText={setPetName}
                            />
                        </View>
                    </View>

                    {/* Input: Data de Nascimento */}
                    <View className="mb-4">
                        <Text className={`text-xs font-medium mb-1.5 ${isDark ? "text-soft-line" : "text-mute"}`}>Data de Nascimento</Text>
                        <View className="flex-row items-center gap-2.5">
                            <View
                                className={`flex-1 flex-row items-center rounded-xl border px-3 py-2.5 ${
                                    unknownBirthDate
                                        ? (isDark ? "border-white/5 bg-navy-2/40 opacity-50" : "border-rule bg-ground/30 opacity-60")
                                        : (isDark ? "border-white/10 bg-navy-2" : "border-rule bg-ground/50")
                                }`}
                            >
                                <Calendar size={16} color={isDark ? "#99b6e6" : "#6c778c"} />
                                <TextInput
                                    placeholder="DD/MM/AAAA"
                                    placeholderTextColor="#6c778c"
                                    className={`flex-1 ml-2 text-sm p-0 ${isDark ? "text-paper" : "text-ink"}`}
                                    value={unknownBirthDate ? "Não informada" : petBirthDate}
                                    onChangeText={setPetBirthDate}
                                    editable={!unknownBirthDate}
                                />
                            </View>

                            {/* Botão de "Não sei a data" */}
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={toggleUnknownBirthDate}
                                className={`h-[42px] px-3 rounded-xl border flex-row items-center justify-center gap-1.5 ${
                                    unknownBirthDate
                                        ? "bg-brand/20 border-brand"
                                        : (isDark ? "bg-navy-2 border-white/10" : "bg-ground/50 border-rule")
                                }`}
                            >
                                <View
                                    className={`w-4 h-4 rounded-md border items-center justify-center ${
                                        unknownBirthDate
                                            ? "border-brand bg-brand"
                                            : (isDark ? "border-soft-line bg-navy" : "border-mute bg-paper")
                                    }`}
                                >
                                    {unknownBirthDate && <Check size={12} color="#ffffff" />}
                                </View>
                                <Text
                                    className={`text-xs font-medium ${
                                        unknownBirthDate
                                            ? "text-brand font-semibold"
                                            : (isDark ? "text-soft" : "text-soft-ink")
                                    }`}
                                >
                                    Não sei
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Selector: Sexo */}
                    <View className="mb-4">
                        <Text className={`text-xs font-medium mb-1.5 ${isDark ? "text-soft-line" : "text-mute"}`}>Sexo</Text>
                        <View className="flex-row gap-3">
                            {["Macho", "Femea"].map((sex) => {
                                const isSelected = selectedSex === sex;
                                return (
                                    <TouchableOpacity
                                        key={sex}
                                        activeOpacity={0.8}
                                        onPress={() => setSelectedSex(sex)}
                                        className={`flex-1 py-2.5 px-3 rounded-xl border items-center justify-center flex-row gap-2 ${
                                            isSelected
                                                ? "bg-brand/20 border-brand"
                                                : (isDark ? "bg-navy-2 border-white/10" : "bg-ground/50 border-rule")
                                        }`}
                                    >
                                        <View
                                            className={`w-3.5 h-3.5 rounded-full border items-center justify-center ${
                                                isSelected
                                                    ? "border-brand bg-brand"
                                                    : (isDark ? "border-soft-line bg-navy" : "border-mute bg-paper")
                                            }`}
                                        >
                                            {isSelected && (
                                                <View className="w-1.5 h-1.5 rounded-full bg-paper" />
                                            )}
                                        </View>
                                        <Text
                                            className={`text-xs font-semibold ${
                                                isSelected ? "text-brand" : (isDark ? "text-soft" : "text-body")
                                            }`}
                                        >
                                            {sex}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Input: Tutor Responsável */}
                    <View className="mb-4">
                        <Text className={`text-xs font-medium mb-1.5 ${isDark ? "text-soft-line" : "text-mute"}`}>Tutor Responsável</Text>
                        <View className={`flex-row items-center rounded-xl border px-3 py-2.5 ${
                            isDark ? "border-white/10 bg-navy-2" : "border-rule bg-ground/50"
                        }`}>
                            <User size={16} color={isDark ? "#99b6e6" : "#6c778c"} />
                            <TextInput
                                placeholder="Nome do Responsável"
                                placeholderTextColor="#6c778c"
                                className={`flex-1 ml-2 text-sm p-0 ${isDark ? "text-paper" : "text-ink"}`}
                                value={petTutor}
                                onChangeText={setPetTutor}
                            />
                        </View>
                    </View>

                    {/* Dropdown: Espécie */}
                    <Dropdown
                        label="Espécie"
                        value={selectedSpecie}
                        options={specieOptions}
                        onSelect={handleSpecieSelect}
                        icon={<Sparkles size={16} color={isDark ? "#99b6e6" : "#6c778c"} />}
                    />

                    {/* Dropdown: Raça */}
                    <Dropdown
                        label="Raça"
                        value={selectedBreed}
                        options={breedOptions}
                        onSelect={setSelectedBreed}
                        icon={<Dna size={16} color={isDark ? "#99b6e6" : "#6c778c"} />}
                    />

                    {/* Botão de Ação Principal */}
                    <TouchableOpacity
                        onPress={handleSavePet}
                        disabled={isSaving}
                        activeOpacity={0.8}
                        className="w-full items-center justify-center bg-brand rounded-xl py-3.5 mt-4 shadow-sm"
                    >
                        {isSaving ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text className="text-paper text-sm font-semibold">
                                {isEditing ? "Salvar Alterações" : "Cadastrar Pet"}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
