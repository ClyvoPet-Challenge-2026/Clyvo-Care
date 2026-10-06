import { TextInput } from "react-native";
import { formatCpf, formatPhone } from "../Utils/formatters";
import type { FormattedTextInputProps } from "../Types/types";

export function FormattedTextInput({ format, value, onChangeText, ...props }: FormattedTextInputProps) {
  const formatter = format === "cpf" ? formatCpf : formatPhone;

  return (
    <TextInput
      {...props}
      value={formatter(value)}
      onChangeText={(text) => onChangeText(formatter(text))}
      keyboardType={format === "cpf" ? "numeric" : "phone-pad"}
      maxLength={format === "cpf" ? 14 : 15}
    />
  );
}
