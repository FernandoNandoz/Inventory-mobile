import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { styles } from "./styles";  // Importa os estilos definidos no arquivo styles.ts
import { colors } from "@/styles/colors"; // Importa as cores definidas no arquivo colors.ts

type Props = TouchableOpacityProps & {
    titulo: string;  // Título da opção
    iconName: keyof typeof MaterialIcons.glyphMap;  // Nome do ícone da opção
}

export function ItemOption({ titulo, iconName, ...rest }: Props) {
    return (
        <TouchableOpacity 
            style={styles.container}  // Aplica o estilo container
            activeOpacity={0.7}  // Define a opacidade ao pressionar
            {...rest}  // Passa as propriedades restantes
        >
            <MaterialIcons 
                name={iconName}  // Nome do ícone
                size={22}  // Tamanho do ícone
                color={colors.gray[300]}  // Cor do ícone verde escuro
            />
            <Text style={styles.titulo}>
                {titulo}
            </Text>
        </TouchableOpacity>
    );
}