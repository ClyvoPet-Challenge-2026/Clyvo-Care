import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { MyPetData } from '../Data/MyPetData';
import { PetSpecieBreedListData } from '../Data/PetSpecieBreedListData';
import { DropdownProps } from '../Types/types';
import { Camera, Image as ImageIcon, Sparkles, ChevronDown, Check, User, Calendar, Tag, Dna } from 'lucide-react-native';
import React, { useState } from 'react';

function Dropdown({ label, value, placeholder = "Selecione", options, onSelect, icon,
}: DropdownProps) {
    const [open, setOpen] = useState(false);

    return (
        <View className="w-full mb-4">
            <Text className="text-xs font-medium text-mute mb-1.5">{label}</Text>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setOpen(!open)}
                className={`w-full min-h-[46px] rounded-xl border px-3.5 py-2.5 flex-row items-center justify-between ${
                    open ? "border-brand bg-paper" : "border-rule bg-ground/50"
                }`}
            >
                <View className="flex-row items-center flex-1 mr-2">
                    {icon && <View className="mr-2.5">{icon}</View>}
                    <Text className={`text-sm ${value ? "text-ink font-medium" : "text-mute"}`}>
                        {value || placeholder}
                    </Text>
                </View>
                <ChevronDown
                    size={16}
                    color="#6c778c"
                    style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}
                />
            </TouchableOpacity>

            {open && (
                <View
                    className="mt-1.5 bg-paper border border-rule-2 rounded-2xl overflow-hidden">
                    <ScrollView nestedScrollEnabled className="max-h-52">
                        {options.map((option, index) => {
                            const isSelected = option === value;
                            return (
                                <TouchableOpacity
                                    key={option}
                                    activeOpacity={0.7}
                                    onPress={() => {
                                        onSelect(option);
                                        setOpen(false);
                                    }}
                                    className={`px-4 py-3 flex-row items-center justify-between ${
                                        isSelected ? "bg-soft/50" : "bg-paper"
                                    } ${index < options.length - 1 ? "border-b border-rule-2/70" : ""}`}
                                >
                                    <Text
                                        className={`text-sm ${
                                            isSelected ? "text-brand font-semibold" : "text-body"
                                        }`}
                                    >
                                        {option}
                                    </Text>
                                    {isSelected && <Check size={16} color="#1f6ae1" />}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
            )}
        </View>
    );
}

export function RegisterPet() {
    const specieOptions = PetSpecieBreedListData.map((item) => item.species);
    const initialSpecie = specieOptions[0] ?? "";
    const initialBreeds = PetSpecieBreedListData.find((item) => item.species === initialSpecie)?.breeds ?? [];
    const [petName, setPetName] = useState("");
    const [petBirthDate, setPetBirthDate] = useState("");
    const [unknownBirthDate, setUnknownBirthDate] = useState(false);
    const [petTutor, setPetTutor] = useState("");
    const [selectedSex, setSelectedSex] = useState("Macho");
    const [selectedSpecie, setSelectedSpecie] = useState(initialSpecie);
    const [selectedBreed, setSelectedBreed] = useState(initialBreeds[0] ?? "");

    const breedOptions =
        PetSpecieBreedListData.find((item) => item.species === selectedSpecie)?.breeds ?? [];

    const selectedPetImage =
        MyPetData.find((pet) => pet.species === selectedSpecie)?.img ?? MyPetData[0]?.img;

    const handleSpecieSelect = (value: string) => {
        setSelectedSpecie(value);
        const nextBreeds =
            PetSpecieBreedListData.find((item) => item.species === value)?.breeds ?? [];
        setSelectedBreed(nextBreeds[0] ?? "");
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 bg-mainBackground" >
            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 24 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Card de Foto e Apresentação do Pet */}
                <View className="bg-paper rounded-3xl p-5 mb-5 border border-rule items-center">
                    <View className="relative">
                        <View className="w-24 h-24 rounded-full bg-soft items-center justify-center overflow-hidden border-2 border-soft shadow-sm">
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
                        <Text className="text-sm font-semibold text-navy">
                            {petName.trim() ? petName : "Nome do Pet"}
                        </Text>
                        <Text className="text-xs text-mute mt-0.5">
                            Padrão: {selectedSpecie || "Geral"} • {selectedBreed || "Raça"}
                        </Text>
                    </View>

                    {/* Botões de Ação de Foto */}
                    <View className="flex-row gap-3 mt-4 w-full justify-center">
                        <TouchableOpacity 
                        activeOpacity={0.8} 
                        className="flex-row items-center justify-center gap-2 bg-lightBlue rounded-xl py-2.5 px-4 flex-1 border border-brand/20" 
                        >
                            <Camera size={16} color="#1f6ae1" />
                            <Text className="text-brand text-xs font-semibold">Tirar Foto</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            className="flex-row items-center justify-center gap-2 bg-ground rounded-xl py-2.5 px-4 flex-1 border border-rule"
                        >
                            <ImageIcon size={16} color="#393f4b" />
                            <Text className="text-body text-xs font-semibold">Galeria</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Card do Formulário de Informações */}
                <View
                    className="bg-paper rounded-3xl p-6 mb-6 border border-rule">
                    <Text className="text-base font-bold text-navy mb-4">
                        Informações do Pet
                    </Text>

                    {/* Input: Nome do Pet */}
                    <View className="mb-4">
                        <Text className="text-xs font-medium text-mute mb-1.5">Nome do Pet</Text>
                        <View className="flex-row items-center rounded-xl border border-rule bg-ground/50 px-3 py-2.5">
                            <Tag size={16} color="#6c778c" />
                            <TextInput
                                placeholder="Ex: Rex, Luna, Thor..."
                                placeholderTextColor="#6c778c"
                                className="flex-1 ml-2 text-sm text-ink p-0"
                                value={petName}
                                onChangeText={setPetName}
                            />
                        </View>
                    </View>

                    {/* Input: Data de Nascimento */}
                    <View className="mb-4">
                        <Text className="text-xs font-medium text-mute mb-1.5">Data de Nascimento</Text>
                        <View className="flex-row items-center gap-2.5">
                            <View
                                className={`flex-1 flex-row items-center rounded-xl border px-3 py-2.5 ${
                                    unknownBirthDate
                                        ? "border-rule bg-ground/30 opacity-60"
                                        : "border-rule bg-ground/50"
                                }`}
                            >
                                <Calendar size={16} color="#6c778c" />
                                <TextInput
                                    placeholder="DD/MM/AAAA"
                                    placeholderTextColor="#6c778c"
                                    className="flex-1 ml-2 text-sm text-ink p-0"
                                    value={unknownBirthDate ? "Não informada" : petBirthDate}
                                    onChangeText={setPetBirthDate}
                                    editable={!unknownBirthDate}
                                />
                            </View>

                            {/* Botão de "Não sei a data" */}
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                    setUnknownBirthDate((prev) => {
                                        const next = !prev;
                                        if (next) {
                                            setPetBirthDate("");
                                        }
                                        return next;
                                    });
                                }}
                                className={`h-[42px] px-3 rounded-xl border flex-row items-center justify-center gap-1.5 ${
                                    unknownBirthDate
                                        ? "bg-brand/10 border-brand"
                                        : "bg-ground/50 border-rule"
                                }`}
                            >
                                <View
                                    className={`w-4 h-4 rounded-md border items-center justify-center ${
                                        unknownBirthDate
                                            ? "border-brand bg-brand"
                                            : "border-mute bg-paper"
                                    }`}
                                >
                                    {unknownBirthDate && <Check size={12} color="#ffffff" />}
                                </View>
                                <Text
                                    className={`text-xs font-medium ${
                                        unknownBirthDate ? "text-brand font-semibold" : "text-soft-ink"
                                    }`}
                                >
                                    Não sei
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Dropdown / Selector: Sexo */}
                    <View className="mb-4">
                        <Text className="text-xs font-medium text-mute mb-1.5">Sexo</Text>
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
                                                ? "bg-brand/10 border-brand"
                                                : "bg-ground/50 border-rule"
                                        }`}
                                    >
                                        <View
                                            className={`w-3.5 h-3.5 rounded-full border items-center justify-center ${
                                                isSelected
                                                    ? "border-brand bg-brand"
                                                    : "border-mute bg-paper"
                                            }`}
                                        >
                                            {isSelected && (
                                                <View className="w-1.5 h-1.5 rounded-full bg-paper" />
                                            )}
                                        </View>
                                        <Text
                                            className={`text-xs font-semibold ${
                                                isSelected ? "text-brand" : "text-body"
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
                        <Text className="text-xs font-medium text-mute mb-1.5">Tutor Responsável</Text>
                        <View className="flex-row items-center rounded-xl border border-rule bg-ground/50 px-3 py-2.5">
                            <User size={16} color="#6c778c" />
                            <TextInput
                                placeholder="Nome do Responsável"
                                placeholderTextColor="#6c778c"
                                className="flex-1 ml-2 text-sm text-ink p-0"
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
                        icon={<Sparkles size={16} color="#6c778c" />}
                    />

                    {/* Dropdown: Raça */}
                    <Dropdown
                        label="Raça"
                        value={selectedBreed}
                        options={breedOptions}
                        onSelect={setSelectedBreed}
                        icon={<Dna size={16} color="#6c778c" />}
                    />

                    {/* Botão de Ação Principal: Cadastrar Pet */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        className="w-full items-center justify-center bg-brand rounded-xl py-3.5 mt-4 shadow-sm">
                        <Text className="text-paper text-sm font-semibold">Cadastrar Pet</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}