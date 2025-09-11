import { StyleSheet } from "react-native";

import { colors } from "@/styles/colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 56,
    },

    title: {
        color: colors.green[900],
        fontSize: 22,
    },

    header: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

        paddingHorizontal: 22,
        marginBottom: 10,
    },

    logo: {
        width: 44,
        height: 40,
    },

    itens: {
        borderTopWidth: 1,
        borderTopColor: colors.gray[600],
    },

    itensContent: {
        gap: 6,
        paddingHorizontal: 15,

        paddingTop: 15,
        paddingBottom: 100,
    },

    modalContainer: {
        flex: 1,
        justifyContent: "flex-end",
    },

    modalContent: {
        backgroundColor: colors.gray[900],
        borderTopWidth: 1,
        borderTopColor: colors.gray[800],
        paddingBottom: 24,
        padding: 24
    },

    modalHeader: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 18,
    },

    modalCategory: {
        flex: 1,
        fontSize: 16,
        fontWeight: "500",
        color: colors.gray[400],
    },

    modalDetailsRow: {
        flexDirection: "row",
        gap: 32,
    },
    
    modalDetails: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 10,
    },
      
    modalImageContent: {
        marginVertical: 8,
        paddingTop: 8,
        borderRadius: 4,
    },

    modalImage: {
        width: "100%",
        height: 100,
        resizeMode: "contain",
    },

    modalLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.gray[200],
    },

    modalValue: {
        fontSize: 16,
        color: colors.gray[400],
    },

    modalDivider: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.gray[200],
        marginTop: 10,
    },

    modalFooter: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        marginTop: 32,

        borderTopColor: colors.gray[600],
        borderTopWidth: 1,
        paddingVertical: 14,
    }
});