import { Text, Pressable, PressableProps } from "react-native"; // Alterado de View para Pressable
import { MaterialIcons } from "@expo/vector-icons"; // Alterado de Ionicons para MaterialIcons

import { styles } from "./styles";  // Novo arquivo styles.ts
import { colors } from "@/styles/colors";  // Novo arquivo colors.ts

// Definindo as props do componente Category
type CategoryProps = PressableProps & {
    name: string;
    isSelected: boolean;
    icon: keyof typeof MaterialIcons.glyphMap;
}

// Componente Category
export function Category({ name, icon, isSelected, ...rest }: CategoryProps) {
    const color = isSelected ? colors.green[300] : colors.gray[400];

    return (
        <Pressable style={styles.container} {...rest}>
            <MaterialIcons name={icon} size={20} color={color} />
            <Text style={[styles.name, { color }]}>{name}</Text>
        </Pressable>
    );
}