import { StyleSheet } from "react-native";

import { colors } from "@/styles/colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 12,
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


    /* Estilos para o Modal do Menu */

    modalMenuContainer: {
        flex: 1, // Ocupa toda a tela
        justifyContent: 'flex-start', // Espaço uniforme entre os itens
    },

    modalMenuContent: {
        flex: 1, // Ocupa toda a tela
        gap: 16, // Espaçamento entre os itens
        backgroundColor: colors.gray[900], // Cor de fundo branca
        marginRight: 140, // Margem esquerda

        borderTopRightRadius: 10, // Borda superior esquerda arredondada
        borderBottomRightRadius: 10, // Borda inferior esquerda arredondada
        borderRightWidth: 1, // Largura da borda esquerda
    },

    modalMenuHeaderContainer: {
        gap: 24, // Espaçamento entre os itens
        borderBottomColor: colors.gray[800], // Cor da borda inferior cinza
        borderBottomWidth: 1, // Largura da borda inferior

        padding: 18, // Espaçamento interno
        paddingHorizontal: 22, // Espaçamento interno horizontal
        paddingBottom: 14, // Espaçamento interno inferior
    },

    modalMenuHeader: {
        width: '100%', // Ocupa toda a largura
        flexDirection: 'row', // Direção dos itens em linha
        alignItems: 'center', // Alinha ao centro na vertical
        justifyContent: 'space-between', // Espaço uniforme entre os itens
    },

    modalMenuTitle: {
        fontSize: 20, // Tamanho da fonte
        fontWeight: '600', // Negrito
        color: colors.gray[400], // Cor do texto preta
    },

    modalMenuItens: {
        paddingHorizontal: 14, // Espaçamento interno horizontal
        gap: 12, // Espaçamento entre os itens
    },

    modalMenuItensBottom: {
        marginTop: 'auto', // Empurra para o final
        marginBottom: 14, // Margem inferior
        paddingHorizontal: 14, // Espaçamento interno horizontal
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
        borderRadius: 8,
    },

    modalImage: {
        width: '100%',
        height: 200,
        resizeMode: "contain",
        alignSelf: "center",
        borderRadius: 8,
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
        marginTop: 22,

        borderTopColor: colors.gray[600],
        borderTopWidth: 1,
        paddingVertical: 14,
    }
});