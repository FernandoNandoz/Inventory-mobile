import { StyleSheet } from "react-native";

import { colors } from "@/styles/colors";

export const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        gap: 12,

        backgroundColor: colors.gray[900],

        paddingVertical: 16,
        //borderRadius: 8,
        paddingHorizontal: 16,
    },

    details: {
        flex: 1,
    },

    content: {
        flexDirection: "row",
        alignItems: "center",
    },

    numberItem: {
        color: colors.gray[400],
        fontSize: 16,
        fontWeight: "500",
        alignItems: "center",

        marginRight: 2,
    },

    name: {
        color: colors.gray[100],
        fontSize: 16,
        fontWeight: "600",
    },

    rp: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 70,
    },

    titleRP: {
        color: colors.gray[400],
        fontSize: 14,
        fontWeight: "900",
        marginRight: 4,
    },

    contentRP: {
        color: colors.gray[400],
        fontSize: 14,
        fontWeight: "500",
    },

    estado: {
        flexDirection: "row",
        alignItems: "center",
    },

    titleEstado: {
        color: colors.gray[400],
        fontSize: 14,
        fontWeight: "900",
        marginRight: 4,
    },

    contentEstado: {
        color: colors.gray[400],
        fontSize: 14,
        fontWeight: "500",
    },

});
