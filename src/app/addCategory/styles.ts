import { StyleSheet } from "react-native";
import { colors } from "@/styles/colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22,
        backgroundColor: colors.gray[950],
        marginBottom: 28,
    },

    header: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 32,
        paddingHorizontal: 22,

        borderBottomColor: colors.gray[800],
        borderBottomWidth: 1,
        paddingBottom: 18,
    },

    title: {
        color: colors.green[300],
        fontSize: 22,
        fontWeight: "bold",
    },

    form: {
        flex: 1,
        gap: 10,
        width: "100%",
        paddingHorizontal: 22,
        marginBottom: 22,
        marginTop: 10,
    },

    iconList: {
        flex: 1,
        gap: 8,
        marginTop: 10,
    },

    setorSelection: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginTop: 12,
    },

    iconSelected: {
        color: colors.gray[400],
        fontSize: 16,
        fontWeight: "bold",
    },

    iconOption: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingVertical: 10,
        paddingHorizontal: 18,

        borderColor: colors.gray[800],
        borderWidth: 1,
        borderRadius: 8,
    },

    iconOptionText: {
        color: colors.gray[400],
        fontSize: 16,
        fontWeight: "bold",
        maxWidth: '80%',
    },

    itensContent: {
        maxWidth: '100%', 
        borderRadius: 8,
        marginTop: 10,
    },

    footer: {
        width: "100%",

        justifyContent: "center",
        alignItems: "center",

        paddingHorizontal: 22,
        paddingVertical: 12,

        borderTopColor: colors.gray[800],
        borderTopWidth: 1,
    },
});