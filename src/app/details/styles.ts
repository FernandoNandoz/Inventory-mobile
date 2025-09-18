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

        borderBottomColor: colors.gray[800],
        borderBottomWidth: 1,
    },

    title: {
        color: colors.gray[200],
        fontSize: 24,
        fontWeight: "600"
    },

    resumeContent: {
        backgroundColor: colors.gray[900],
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 14,
        margin: 15,
        gap: 8
    },

    resumeDetails: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    label: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.gray[200],
    },

    value: {
        fontSize: 16,
        color: colors.gray[400],
    },

    form: {
        paddingHorizontal: 15,
        marginVertical: 8,
    },

    itens: {
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: colors.gray[800],
    },

    listContent: {
        flex: 1,
        paddingHorizontal: 24,
    },

    itensContent: {
        gap: 6,
        paddingHorizontal: 15,

        paddingTop: 15,
        paddingBottom: 100,
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



    /* Estilos para o Modal de Detalhes do Item */

    modalContainer: {
        flex: 1,
        justifyContent: "flex-end",
    },

    modalContent: {
        backgroundColor: colors.gray[900],
        borderTopWidth: 1,
        borderTopColor: colors.gray[800],
        paddingBottom: 24,
        padding: 24,
        borderRadius: 14,
    },

    modalHeader: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 18,
    },

    modalCategory: {
        flex: 1,
        fontSize: 18,
        fontWeight: "600",
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
        borderRadius: 8,
    },

    modalImage: {
        width: '100%',
        height: 200,
        resizeMode: "contain",
        alignSelf: "center",
        borderRadius: 8,
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
        marginTop: 22,

        borderTopColor: colors.gray[600],
        borderTopWidth: 1,
        paddingVertical: 14,
    }
});