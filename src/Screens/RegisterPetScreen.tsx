import { View, Text, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { MyPetData } from '../Data/MyPetData';
import { PetSpecieBreedListData } from '../Data/PetSpecieBreedListData';
import { Camera, Upload } from 'lucide-react-native';
import React, { useState } from 'react';

interface DropdownProps {
    label: string;
    value: string;
    placeholder?: string;
    options: string[];
    onSelect: (value: string) => void;
}

function Dropdown({
    label,
    value,
    placeholder = "Selecione",
    options,
    onSelect,
}: DropdownProps) {
    const [open, setOpen] = useState(false);

    return (
        <View className="w-full mb-4">
            <Text className="text-neutral-700 text-sm font-semibold mb-2">{label}</Text>
            <TouchableOpacity
                onPress={() => setOpen(!open)}
                className="w-full h-12 bg-neutral-50 border border-neutral-300 rounded-lg px-4 justify-center"
            >
                <Text className={value ? "text-neutral-900" : "text-neutral-400"}>
                    {value || placeholder}
                </Text>
            </TouchableOpacity>
            {open && (
                <View className="mt-2 bg-white border border-neutral-200 rounded-lg overflow-hidden">
                    {options.map((option, index) => (
                        <TouchableOpacity
                            key={option}
                            onPress={() => {
                                onSelect(option);
                                setOpen(false);
                            }}
                            className={`px-4 py-3 ${index < options.length - 1 ? "border-b border-neutral-100" : ""}`}
                        >
                            <Text className="text-neutral-900">{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
}


export function RegisterPet() {
    const specieOptions = PetSpecieBreedListData.map((item) => item.species);
    const initialSpecie = specieOptions[0] ?? "";
    const initialBreeds =
        PetSpecieBreedListData.find((item) => item.species === initialSpecie)?.breeds ?? [];

    const [petName, setPetName] = useState("");
    const [petBirthDate, setPetBirthDate] = useState("");
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
        <View className="flex-1 bg-white">
            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}>
                {/* Título */}
                <View className="w-full items-start mt-6">
                    <Text className="text-2xl font-bold">Novo Pet</Text>
                </View>

                {/* Foto do Pet */}
                <View className="mt-4 items-center justify-center">
                    {selectedPetImage ? (
                        <Image source={selectedPetImage} className="w-24 h-24 rounded-full" resizeMode="cover" />
                    ) : null}
                
                    <View className="flex-row mt-2">
                        <Text className="text-gray-300">Sem Foto</Text>
                        <Text className="text-gray-300"> ° </Text>
                        <Text className="text-gray-300">Usando Padrão de {selectedSpecie || MyPetData[0]?.species}</Text>
                    </View>

                    {/* Campo de Botões */}
                    <View className="flex-row gap-4 mt-4">
                        {/* Botão de Tirar Foto*/}
                        <TouchableOpacity className="flex-row items-center gap-2 bg-lightBlue rounded-full py-3 px-6">
                            <Camera className="w-5 h-5" color="blue" />
                            <Text className="text-blue">Tirar Foto</Text>
                        </TouchableOpacity>
                        {/* Botão de Upload de foto*/}
                        <TouchableOpacity className="flex-row items-center gap-2 bg-lightBlue rounded-full py-3 px-6">
                            <Upload className="w-5 h-5" color="blue" />
                            <Text className="text-blue">Galeria</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Campos de Input */}
                    <View className="w-full mt-6">
                    {/* Input de Nome */}
                    <View className="w-full mb-4">
                        <Text className="text-neutral-700 text-sm font-semibold mb-2">Nome do Pet</Text>
                        <TextInput
                            placeholder="Nome do Pet"
                            placeholderTextColor="#9ca3af"
                            className="w-full h-12 bg-neutral-50 border border-neutral-300 rounded-lg px-4 text-neutral-900"
                            value={petName}
                            onChangeText={setPetName}
                        />
                    </View>
                    {/* Input de data de nascimento */}
                    <View className="w-full mb-4">
                        <Text className="text-neutral-700 text-sm font-semibold mb-2">Data de Nascimento</Text>
                        <TextInput
                            placeholder="DD/MM/AAAA"
                            placeholderTextColor="#9ca3af"
                            className="w-full h-12 bg-neutral-50 border border-neutral-300 rounded-lg px-4 text-neutral-900"
                            value={petBirthDate}
                            onChangeText={setPetBirthDate}
                        />
                    </View>

                    <Dropdown
                        label="Sexo"
                        value={selectedSex}
                        options={["Macho", "Femea"]}
                        onSelect={setSelectedSex}
                    />

                    {/* Input de Responsável */}
                    <View className="w-full mb-4">
                        <Text className="text-neutral-700 text-sm font-semibold mb-2">Responsável</Text>
                        <TextInput
                            placeholder="Nome do Responsável"
                            placeholderTextColor="#9ca3af"
                            className="w-full h-12 bg-neutral-50 border border-neutral-300 rounded-lg px-4 text-neutral-900"
                            value={petTutor}
                            onChangeText={setPetTutor}
                        />
                    </View>

                    <Dropdown
                        label="Especie"
                        value={selectedSpecie}
                        options={specieOptions}
                        onSelect={handleSpecieSelect}
                    />

                    <Dropdown
                        label="Raca"
                        value={selectedBreed}
                        options={breedOptions}
                        onSelect={setSelectedBreed}
                    />

                        {/* Botão de Cadastrar Pet */}
                        <TouchableOpacity className="w-full items-center justify-center bg-blue rounded-lg py-3 mt-4">
                            <Text className="text-white text-sm font-semibold">Cadastrar Pet</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </ScrollView>
        </View>
    );
}