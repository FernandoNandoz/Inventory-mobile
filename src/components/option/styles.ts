import { StyleSheet } from "react-native";

import { colors } from "@/styles/colors";

export const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    primaryTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.green[300],
    },

    secondaryTitle: {
        fontSize: 16,
        color: colors.gray[400],
    },

    disabledTitle: {
        fontSize: 16,
        color: colors.gray[800],
    }
});