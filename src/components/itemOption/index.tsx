import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { styles } from "./styles";  // Importa os estilos definidos no arquivo styles.ts
import { colors } from "@/styles/colors"; // Importa as cores definidas no arquivo colors.ts

type Props = TouchableOpacityProps & {
    titulo: string;  // Título da opção
    center?: boolean;
    iconName: keyof typeof MaterialIcons.glyphMap;  // Nome do ícone da opção
}

export function ItemOption({ titulo, iconName, center, ...rest }: Props) {
    const alignItems = center ? 'center' : 'flex-start';
    const justifyContent = center ? 'center' : 'flex-start';
    const paddingVertical = center ? 8 : 15;
    const size = center ? 20 : 22;
    const fontSize = center ? 16 : 18;
    const color = center ? colors.gray[300] : colors.gray[400]

    return (
        <TouchableOpacity 
            style={[styles.container, { alignItems, justifyContent, paddingVertical }]}  // Aplica o estilo container
            activeOpacity={0.7}  // Define a opacidade ao pressionar
            {...rest}  // Passa as propriedades restantes
        >
            <MaterialIcons 
                name={iconName}  // Nome do ícone
                size={size}  // Tamanho do ícone
                color={colors.gray[300]}  // Cor do ícone verde escuro
            />
            <Text style={[styles.titulo, { fontSize, color }]}>
                {titulo}
            </Text>
        </TouchableOpacity>
    );
}