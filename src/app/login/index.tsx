import { useState } from "react" // Importa o React e o hook useState
import { View, Text, Image, Alert } from "react-native" // Importa os componentes Text, View e StyleSheet do React Native
import { router } from "expo-router" // Importa o roteador do Expo Router

import { styles } from "./styles" // Importa os estilos definidos no arquivo styles.ts

import { Button } from "@/components/button" // Importa o componente Button
import { Input } from "@/components/input" // Importa o componente Input

import { useUsersDatabase } from "@/database/useUsersDatabase" // Importa o hook para acessar o banco de dados de usuários


// Componente funcional padrão do React Native
export default function Index() {
    const [username, setUsername] = useState("FERNANDO") // Estado para armazenar o nome de usuário
    const [password, setPassword] = useState("MrBaam") // Estado para armazenar a senha

    const usersDatabase = useUsersDatabase(); // Instancia o banco de dados de usuários

    // Função para lidar com o login
    async function handleLogin() {

        const user = await usersDatabase.getUser(username.trim()) // Busca o usuário "admin" no banco de dados

        if (user && user.password === password.trim()) { // Verifica se o usuário existe e se a senha está correta
            
            console.log("Usuário encontrado:", user) // Loga os dados do usuário encontrado
            router.push({
                pathname: './home',
                params: { userId: user.id, userName: user.username, level: user.access_level } // Passa o ID do usuário como parâmetro
            }) // Navega para a tela de home
        } else {
            console.log("Usuário não encontrado") // Loga que o usuário não foi encontrado

            Alert.alert("Erro", "Usuário ou senha incorretos") // Mostra um alerta de erro
        }
    }


    // Retorna a estrutura do componente
    return (
        /* Componente View com estilo container */
        <View style={styles.container}> 

            <View style={styles.hero}>
                <Image 
                    source={require("@/assets/logoLarge.png")} // Imagem do logo
                    style={styles.logoHero} // Aplica o estilo logo
                    resizeMode="contain" // Define o modo de redimensionamento da imagem
                />

                <Text style={styles.titulo}>
                    Inventory
                </Text>
            </View>

            <View style={styles.form}>
                <Input 
                    placeholder="Usuário" 
                    keyboardType="default" 
                    autoCapitalize="characters" 
                    onChangeText={text => setUsername(text.toUpperCase())}
                    value={username}
                    
                />
                <Input 
                    placeholder="Senha" 
                    secureTextEntry={true}
                    autoCapitalize="none"
                    onChangeText={setPassword}
                    value={password} 
                />
            </View>

            <View style={styles.buttonsContainer}>
                <Button name="Entrar" variant="primary" onPress={handleLogin} />
            </View>

        </View>
    )
}