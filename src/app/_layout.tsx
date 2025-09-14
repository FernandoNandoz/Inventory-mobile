import { Stack } from "expo-router" // importa o estilo de rotas em pilha
import { SafeAreaView } from 'react-native-safe-area-context'; // importa o SafeAreaView para lidar com áreas seguras em dispositivos
import { SQLiteProvider } from "expo-sqlite";
import { initializeDatabase } from "@/database/initializeDatabase";

import { colors } from "@/styles/colors" // importa as cores do arquivo de estilos

// Componente de Layout
export default function Layout() {
    const backgroundColor = colors.gray[950]

    return (
        <SQLiteProvider databaseName="inventoryDatabase.db" onInit={initializeDatabase}>
            <SafeAreaView style={{ flex: 1, backgroundColor }}>
                <Stack
                    initialRouteName="home/index" // Define a rota inicial como index
                    screenOptions={{ 
                        headerShown: false, // Oculta o cabeçalho
                        contentStyle: { backgroundColor }, // Estilo do conteúdo
                        animation: 'slide_from_right', // Tipo de animação ao navegar para uma nova tela
                        animationDuration: 0, // Duração da animação em milissegundos
                    }}>
                </Stack>
            </SafeAreaView>
        </SQLiteProvider>
    )
}