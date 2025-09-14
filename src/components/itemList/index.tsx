import { View, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { styles } from "./styles";
import { colors } from "@/styles/colors";

import { Option } from "@/components/option";

type ItemListProps = TouchableOpacityProps & {
    name: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    variant?: "primary" | "secondary";
    onEdit: () => void;
    onDelete: () => void;
}

export function ItemList({ name, icon, variant = "primary", onEdit, onDelete, ...rest }: ItemListProps) {
    return (
        <View style={styles.container} {...rest}>
            <View style={styles.item}>
                <MaterialIcons name={icon} size={24} color={colors.gray[200]} />
            </View>
            <View style={styles.itemContent}>
                <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail" >{name}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Option icon="edit" variant={variant} onPress={onEdit} />
                <Option icon="delete" variant={variant} onPress={onDelete} />
            </View>
        </View>
    );
}