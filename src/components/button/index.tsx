import { Text, TouchableOpacity, TouchableOpacityProps, ActivityIndicator } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

import { styles } from "./styles";
import { colors } from "@/styles/colors";

type ButtonProps = TouchableOpacityProps & {
    name: string;
    icon?: keyof typeof MaterialIcons.glyphMap;
    variant?: "default" | "alpha" | "primary" | "secondary";
    isConnected? : boolean;
    loading?: boolean;
    syncing?: boolean;
}

export function Button({ name, icon, variant = "default", isConnected, loading, syncing, ...rest }: ButtonProps) {
    const text = variant === "default" ? styles.titleDefault : variant === "primary" ? styles.titlePrimary : styles.titleSecondary
    const colorIcon = variant === "default" ? colors.gray[900] : colors.gray[100]
    const styleIcon = variant === "alpha" ? { marginRight: 6 } : { marginRight: 0 }
    const opacity = variant === "alpha" && loading ? 0.7 : 1
    const backgroundColor = variant === "alpha" && isConnected ? colors.red[500] : colors.green[500]
    const container = (
        variant === "default" ? styles.containerDefault : 
        variant === "primary" ? styles.containerPrimary : 
        variant === "secondary" ? styles.containerSecondary : 
        [ styles.containerAlpha, {
            opacity, backgroundColor
        }
    ])

    return (
        <TouchableOpacity 
            style={container}
            activeOpacity={0.7}
            {...rest}
        >
            {syncing ? (
                <ActivityIndicator size="small" color={colors.gray[100]} style={{ marginRight: 4 }} />
            ) : (
                <MaterialIcons name={icon} size={20} color={colorIcon} style={styleIcon} />
            )}
            <Text style={text}>
                {name}
            </Text>
        </TouchableOpacity>
    );
}