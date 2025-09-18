import { StyleSheet } from "react-native";

import { colors } from "@/styles/colors"; // Importa as cores definidas no arquivo colors.ts

export const styles = StyleSheet.create({
    
    // Estilo do container da opção
    container: {
        flexDirection: 'row',  // Direção dos itens em linha
        width: '100%',  // Largura total
        gap: 14,  // Espaçamento entre os itens

        alignItems: 'center',  // Alinha os itens ao centro na vertical
        justifyContent: 'center',
        
        paddingVertical: 15,  // Espaçamento interno
        paddingHorizontal: 18,  // Espaçamento interno à esquerda    
        
        borderColor: colors.gray[800],  // Cor da borda cinza
        borderWidth: 1,  // Largura da borda

        borderRadius: 8,  // Borda arredondada
    },

    titulo: {
        color: colors.gray[400],  // Cor do texto verde escuro
        fontSize: 18,  // Tamanho da fonte
        fontWeight: 'bold',  // Negrito
    },
});