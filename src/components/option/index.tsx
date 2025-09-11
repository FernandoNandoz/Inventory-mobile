import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { styles } from "./styles";
import { colors } from "@/styles/colors";

type Props = TouchableOpacityProps & {
    name: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    variant?: "primary" | "secondary" | "permission";
    isEnabled?: boolean;
}

export function Option({ name, icon, variant = "primary", isEnabled = true, ...rest }: Props) {
    const disabledOption = isEnabled === false ? true : false;
    const colorIcon = variant === "primary" || variant === "permission" ? colors.green[300] : colors.gray[400]
    const colorText = variant === "primary" || variant === "permission" ? styles.primaryTitle : styles.secondaryTitle
    
    const borderColor = variant === "permission"  ? colors.green[300] : colors.gray[400]
    const borderWidth = variant === "permission" ? 1 : 0
    const borderRadius = variant === "permission" ? 8 : 0
    const paddingVertical = variant === "permission" ? 12 : 0
    const paddingHorizontal = variant === "permission" ? 24 : 0
    
    return (
        <TouchableOpacity style={[styles.container, { borderColor, borderWidth, borderRadius, paddingHorizontal, paddingVertical }]} disabled={disabledOption} {...rest}>
            <MaterialIcons 
                name={icon} 
                size={22} 
                color={isEnabled === true ? colorIcon : colors.gray[800]} 
            />

            <Text style={isEnabled === true ? colorText : styles.disabledTitle}>
                {name}
            </Text>
        </TouchableOpacity>
    );
}