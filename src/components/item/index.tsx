import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { styles } from "./styles";
import { colors } from "@/styles/colors";

type ItemProps = {
    isOneItem?: boolean;
    isEndItem?: boolean;
    item: string;
    rp: string;
    name: string;
    estado: string;
    onDetails: () => void;
}

export function Item({ isOneItem, isEndItem, item, rp, name, estado, onDetails }: ItemProps) {
    const borderTopLeftRadius = isOneItem ? 10 : 0;
    const borderTopRightRadius = isOneItem ? 10 : 0;
    const borderBottomLeftRadius = isEndItem ? 10 : 0;
    const borderBottomRightRadius = isEndItem ? 10 : 0;

    return (
        <View style={[styles.container, { borderTopLeftRadius, borderTopRightRadius, borderBottomLeftRadius, borderBottomRightRadius }]}>

            <Text style={styles.numberItem}>
                {item}
            </Text>

            <View style={styles.details}>

                <Text style={styles.name} numberOfLines={1}>
                    {name}
                </Text>

                <View style={styles.content}>
                    <View style={styles.rp}>
                        <Text style={styles.titleRP}>
                            RP:
                        </Text>
                        <Text style={styles.contentRP}>
                            {rp}
                        </Text>   
                    </View>

                    <View style={styles.estado}>              
                        <Text style={styles.titleEstado}>
                            Estado:
                        </Text> 
                        <Text style={styles.contentEstado}>
                            {estado}
                        </Text>
                    </View>     
                </View>
            </View>

            <TouchableOpacity onPress={onDetails}>
                <MaterialIcons name="more-horiz" size={24} color={colors.gray[400]} />
            </TouchableOpacity>
        </View>
    )
}

