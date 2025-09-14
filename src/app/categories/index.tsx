import { useState, useCallback } from "react";
import { router, useFocusEffect } from "expo-router";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { styles } from "./styles";
import { colors } from "@/styles/colors";

import { Input } from "@/components/input";
import { ItemList } from "@/components/itemList";

import { useCategoriesDatabase, CategoryDataBase } from "@/database/useCategoriesDatabase";

export default function Categories() {

    const [search, setSearch] = useState("");  // Estado para o texto de busca
    const [categories, setCategories] = useState<CategoryDataBase[]>([]);  // Estado para a lista de categorias

    const categorieDatabase = useCategoriesDatabase();  // Instância do banco de dados de categorias

    // Função para listar categorias com base no texto de busca
    async function list() {
        const response = await categorieDatabase.searchByName(search);
        setCategories(response);
    }

    // Função para navegar até a tela de edição de categoria
    function handleEditCategory(id: number) {
        // Navega para a tela de edição, passando o id da categoria como parâmetro
        router.push({
            pathname: './addCategory',
            params: { id }
        });
    }

    // Função para deletar uma categoria
    async function handleDeleteCategory(id: number) {
        try {
            Alert.alert("Deletando", "Tem certeza que deseja deletar esta setor?", [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Sim",
                    style: "destructive",

                    onPress: async () => {
                        await categorieDatabase.remove(id);
                        await list(); // Atualiza a lista após a exclusão
                    }
                }
            ]);
           
        } catch (error) {
            console.error("Erro ao deletar setor:", error);
            Alert.alert("Erro ao deletar setor. Tente novamente.");
            return;
        } 
    }

    // Atualiza a lista de categorias sempre que a tela ganha foco ou o texto de busca muda
    useFocusEffect(useCallback(() => {
        list();
    }, [search]));


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} >
                    <MaterialIcons name="arrow-back" size={24} color={colors.gray[200]} />
                </TouchableOpacity>
                <Text style={styles.title}>Setores</Text>
                <TouchableOpacity onPress={() => router.push("/addCategory")} >
                    <MaterialIcons name="add" size={24} color={colors.gray[200]} />
                </TouchableOpacity>
            </View>

            <View style={styles.form}>
                <Input
                    placeholder="Nome da Setor"
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            <View style={styles.listContent}>
                <FlatList
                    data={categories}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <ItemList 
                            name={item.name}
                            icon={item.icon as keyof typeof MaterialIcons.glyphMap}
                            variant="secondary"
                            onEdit={() => { handleEditCategory(item.id) }}
                            onDelete={() => { handleDeleteCategory(item.id) }}
                        />
                    )}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyList}>
                            <Text style={styles.emptyListText}>Nenhum setor cadastrado.</Text>
                        </View>
                    )}
                />
            </View>

        </View> 
    );
}