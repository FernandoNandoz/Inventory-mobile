import { StyleSheet } from "react-native";
import { colors } from "@/styles/colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        maxHeight: "100%",
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        paddingVertical: 16,
        paddingHorizontal: 24,
        marginBottom: 30,

        borderBottomColor: colors.gray[800],
        borderBottomWidth: 1,
    },

    title: {
        color: colors.gray[200],
        fontSize: 24,
        fontWeight: "600"
    },

    form: {
        paddingHorizontal: 24,
        marginBottom: 20,
    },

    listContent: {
        flex: 1,
        paddingHorizontal: 24,
    },

    categoryItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,

        borderBottomWidth: 1,
        borderBottomColor: colors.gray[800],
    },

    categoryName: {
        color: colors.gray[400],
        fontSize: 18,
        marginLeft: 12,
    },

    emptyList: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
    },

    emptyListText: {
        color: colors.gray[400],
        fontSize: 16,
    },
});