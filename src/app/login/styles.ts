import { StyleSheet } from "react-native" // Importa os componentes Text, View e StyleSheet do React Native

import { colors } from "@/styles/colors" // Importa as cores definidas no arquivo colors.ts

// Exporta os estilos para o componete solicitante
export const styles = StyleSheet.create({

    /* Estilos para o componente View */
    container: { 
        flex: 1, /* ocupa toda a tela */
        paddingTop: 10, /* padding superior */
    },

    /* Estilos Imagem de fundo */
    imageBackground: {
        flex: 1,
    },

    /* Estilos para o componente que recebe a imagem e o titulo */
    hero: {
        alignItems: 'center', /* alinha ao centro na horizontal */
        justifyContent: 'center', /* alinha ao centro na vertical */

        marginTop: 60, /* margem superior */
    },

    /* Estilos logo do onibus */
    logoHero : {
        width: 200, /* largura da imagem */
        height: 200, /* altura da imagem */

        borderRadius: 24, /* borda arredondada */
        
    },

    /* Estilos para o componente Text */
    titulo: {
        fontSize: 36, /* tamanho da fonte */
        fontWeight: 'bold', /* negrito */
        color: colors.green[300], /* cor do texto preta */

        marginTop: 35, /* margem superior */
        marginBottom: 45, /* margem inferior */
    },
    /* Estilos para o componente View que recebe os inputs */
    form: {
        width: '100%', /* largura total */
        paddingHorizontal: 35, /* padding horizontal */
        gap: 16, /* espaço entre os itens */
    },

    /* Estilos para o componente View que recebe os botões */
    buttonsContainer: {
        marginTop: 50,  /* margem superior */
        paddingHorizontal: 100,  /* padding horizontal */
        gap: 14  /* espaço entre os itens */
    }
});