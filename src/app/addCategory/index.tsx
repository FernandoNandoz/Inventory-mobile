import { useState, useMemo, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import { styles } from "./styles";
import { colors } from "@/styles/colors";

import { Input } from "@/components/input";
import { Divider } from "@/components/divider";
import { Option } from "@/components/option";
import { materialIconNames } from "@/utils/materialIconNames";

import { useCategoriesDatabase } from "@/database/useCategoriesDatabase";


export default function AddCategory() {
    const [setor, setSetor] = useState("");
    const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [isUpdate, setIsUpdate] = useState(false);

    // Pega o ID da categoria a ser editada, se houver
    const { id } = useLocalSearchParams();

    // Instância do banco de dados de categorias
    const categorieDatabase = useCategoriesDatabase();

    // Filtra os ícones conforme o texto digitado
    const filteredIcons = useMemo(() => {
        if (!search.trim()) return materialIconNames;
        return materialIconNames.filter((name) => name.toLowerCase().includes(search.toLowerCase()));
    }, [search]);


    // Função para carregar os dados da categoria a ser editada
    async function loadCategoryData(idCategory: number) {

        const { name, icon } = await categorieDatabase.searchByID(idCategory);

        setSetor(name);
        setSelectedIcon(icon);
        setSearch(icon);
        setIsUpdate(true);   
    }

    // Função para adicionar uma nova categoria
    async function handleAddCategory() {
        // Validações simples
        if (!setor.trim()) {
            return alert("Digite um nome para a categoria.");
        }
        if (!selectedIcon) {
            return alert("Selecione um ícone para a categoria.");
        }

        // Adiciona a nova categoria ao banco de dados
        const response = await categorieDatabase.create({
            name: setor,
            icon: selectedIcon as keyof typeof MaterialIcons.glyphMap,
        });

        Alert.alert("Cadastro de Setor", "Setor adicionado com sucesso!" + response.insertId);
        router.back();
    }

    // Função para atualizar uma categoria existente
    async function handleUpdateCategory() {        
        // Validações simples
        if (!setor.trim()) {
            return alert("Digite um nome para a categoria.");
        }
        if (!selectedIcon) {
            return alert("Selecione um ícone para a categoria.");
        }

        const idString = Array.isArray(id) ? id[0] : id; // Garante que id é string
        const idNumber = parseInt(idString); // Converte para número

        if (isNaN(idNumber)) {
            return alert("ID inválido.");
        }

        console.log("Atualizando categoria com ID:", idNumber);

        // Adiciona a nova categoria ao banco de dados
        await categorieDatabase.update({
            id: idNumber, // Substitua pelo ID real da categoria que você deseja atualizar
            name: setor,
            icon: selectedIcon as keyof typeof MaterialIcons.glyphMap,
        });

        Alert.alert("Cadastro de Setor", "Setor atualizada com sucesso!");
        router.back();
    }

    // Função para finalizar o cadastro ou atualização
    function handleSave() {
        if (isUpdate) {
            handleUpdateCategory();
        } else {
            handleAddCategory();
        }
    }


    // Limpa o ícone selecionado se ele não estiver mais na lista filtrada
    useEffect(() => {
        // Limpa o ícone selecionado se ele não estiver mais na lista filtrada
        if (selectedIcon && !filteredIcons.includes(selectedIcon)) {
            setSelectedIcon(null);
        }

        // Se houver um ID, carrega os dados da categoria para edição
        if (id && !isUpdate) {
            loadCategoryData(Number(id));
        }

    }, [filteredIcons, selectedIcon, id]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Nova Categoria</Text>
                <TouchableOpacity onPress={() => { router.back() }}>
                    <MaterialIcons name="arrow-back" size={26} color={colors.gray[400]} />
                </TouchableOpacity>
            </View>

            <View style={styles.form}>
                <Input 
                    placeholder="Nome da Setor"
                    value={setor}
                    onChangeText={setSetor}
                />

                {selectedIcon ? 
                    <>
                        <View style={styles.setorSelection}>
                            <Text style={styles.iconSelected}>Icone selecionado: </Text>
                            <MaterialIcons 
                                name={selectedIcon as any} 
                                size={32}
                                color={colors.gray[400]}
                            />
                        </View>
                    </>
                : null }

                <Divider text="Escolha um Icone" />

                <View style={styles.iconList}> 
                    <Input
                        placeholder="Buscar ícone pelo nome..."
                        value={search}
                        onChangeText={setSearch}
                        autoCorrect={false}
                    />

                    <FlatList
                        data={filteredIcons}
                        keyExtractor={(item) => item}
                        numColumns={2}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[styles.iconOption, selectedIcon === item && { borderColor: colors.green[300], borderWidth: 2 }]}
                                onPress={() => setSelectedIcon(item)}
                            >
                                <MaterialIcons 
                                    name={item as any} 
                                    size={28} 
                                    color={selectedIcon === item ? colors.green[300] : colors.gray[400]} 
                                />

                                <Text style={styles.iconOptionText}>
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={{ gap: 8 }}
                        columnWrapperStyle={{ gap: 8 }}
                        style={styles.itensContent}
                    />
                </View>
            </View>

            <View style={styles.footer}>
                <Option 
                    name={isUpdate ? "Salvar alterações" : "Salvar Cadastro"} 
                    icon={isUpdate ? "edit" : "save"} 
                    onPress={handleSave}/>
            </View>
            
        </View>
    );
}
