import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { ChevronDown, Check } from "lucide-react-native";
import { useTheme } from "../Context/ThemeContext";
import type { DropdownProps } from "../Types/types";

export function Dropdown({ label, value, placeholder = "Selecione", options, onSelect, icon }: DropdownProps) {
    const [open, setOpen] = useState(false);
    const { isDark } = useTheme();

    return (
        <View className="w-full mb-4">
            <Text className={`text-xs font-medium mb-1.5 ${isDark ? "text-soft-line" : "text-mute"}`}>{label}</Text>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setOpen(!open)}
                className={`w-full min-h-[46px] rounded-xl border px-3.5 py-2.5 flex-row items-center justify-between ${
                    open
                        ? (isDark ? "border-brand bg-navy-2" : "border-brand bg-paper")
                        : (isDark ? "border-white/10 bg-navy-2" : "border-rule bg-ground/50")
                }`}
            >
                <View className="flex-row items-center flex-1 mr-2">
                    {icon && <View className="mr-2.5">{icon}</View>}
                    <Text className={`text-sm ${
                        value
                            ? (isDark ? "text-paper font-medium" : "text-ink font-medium")
                            : (isDark ? "text-soft-line" : "text-mute")
                    }`}>
                        {value || placeholder}
                    </Text>
                </View>
                <ChevronDown
                    size={16}
                    color={isDark ? "#99b6e6" : "#6c778c"}
                    style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}
                />
            </TouchableOpacity>

            {open && (
                <View className={`mt-1.5 border rounded-2xl overflow-hidden max-h-52 ${
                    isDark ? "bg-navy-2 border-white/10" : "bg-paper border-rule-2"
                }`}>
                    <ScrollView nestedScrollEnabled>
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
                                        isSelected
                                            ? (isDark ? "bg-navy" : "bg-soft/50")
                                            : (isDark ? "bg-navy-2" : "bg-paper")
                                    } ${index < options.length - 1 ? (isDark ? "border-b border-white/10" : "border-b border-rule-2/70") : ""}`}
                                >
                                    <Text
                                        className={`text-sm ${
                                            isSelected ? "text-brand font-semibold" : (isDark ? "text-paper" : "text-body")
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
