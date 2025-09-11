import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

import { styles } from "./styles";
import { colors } from "@/styles/colors";

type ButtonProps = TouchableOpacityProps & {
    title: string;
    icon?: keyof typeof MaterialIcons.glyphMap;
    variant?: "primary" | "secondary";
}

export function Button({ title, icon, variant = "primary", ...rest }: ButtonProps) {
    

    return (
        <TouchableOpacity 
            style={variant === "primary" ? styles.containerPrimary : styles.containerSecondary}
            activeOpacity={0.7}
            {...rest}
        >
            <MaterialIcons 
                name={icon} 
                size={22} 
                color={variant === "primary" ? colors.gray[900] : colors.gray[200]} 
            />
            <Text style={variant === "primary" ? styles.titlePrimary : styles.titleSecondary}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}