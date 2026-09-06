import { TouchableOpacity } from "react-native";
import { Moon, Sun } from "lucide-react-native";
import { useTheme } from "../Context/ThemeContext";

export const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      activeOpacity={0.7}
      className="flex h-9 w-9 items-center justify-center rounded-xl bg-soft border border-rule"
      accessibilityLabel="Mudar tema"
    >
      {theme === "light" ? (
        <Moon size={18} color="#1f6ae1" />
      ) : (
        <Sun size={18} color="#1f6ae1" />
      )}
    </TouchableOpacity>
  );
};

export default ThemeToggleButton;