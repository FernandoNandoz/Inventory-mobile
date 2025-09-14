import { StyleSheet } from "react-native";
import { colors } from "@/styles/colors";

export const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[800],
    },

    item: {
        padding: 8,
    },

    itemContent: {
        flex: 1,
        marginLeft: 12,
    },
    itemName: {
        color: colors.gray[400],
        fontSize: 16,
    },
});