import { useState, useCallback } from "react";
import { Route, router, useFocusEffect } from "expo-router";
import { View, Text, Image, TouchableOpacity, FlatList, Modal, Alert, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ScreenOrientation from 'expo-screen-orientation';

import { styles } from "./styles";
import { colors } from "@/styles/colors";

import { Categories } from "@/components/categories";
import { Item } from "@/components/item";
import { ItemOption } from "@/components/itemOption";
import { Option } from "@/components/option";

import { useItemsDatabase, ItemDataBase } from "@/database/useItemsDatabase";
import { useCategoriesDatabase } from "@/database/useCategoriesDatabase";
import { Divider } from "@/components/divider";

export default function Home() {
    const [category, setCategory] = useState("Todos");  // Estado para armazenar a categoria selecionada
    const [item, setItem] = useState<ItemDataBase>({} as ItemDataBase);  // Estado para armazenar o item selecionado
    const [items, setItems] = useState<ItemDataBase[]>([]);  // Estado para armazenar a lista de itens
    const [modalVisible, setModalVisible] = useState(false);  // Estado para controlar a visibilidade do modal de detalhes do item
    const [isMenuVisible, setIsMenuVisible] = useState(false) // Estado para controlar a visibilidade do menu
    const [idCategory, setIdCategory] = useState(0);  // Estado para armazenar o ID da categoria selecionada
    const [categoryDetails, setCategoryDetails] = useState("");  // Estado para armazenar o nome da categoria do item selecionado

    const itemsDatabase = useItemsDatabase(); // Hook para acessar o banco de dados de itens
    const categorieDatabase = useCategoriesDatabase();  // Hook para acessar o banco de dados de categorias
    

    // Função para atualizar a categoria selecionada
    // Atualiza a categoria selecionada
    const dataCategory = useCallback((id: number, category: string) => {
        setIdCategory(id)
        setCategory(category)
    },[])

    // Função para navegar para as opções do menu
    function openOptions(route: string) { 
        setIsMenuVisible(false);
        router.navigate(route as Route);
    }

    // Função para buscar o nome da categoria e salvar no estado
    const loadCategoryName = useCallback(async (idCategory: number) => {
        const result = await categorieDatabase.searchByID(idCategory);
        if (!result) {
            setCategoryDetails("Categoria não encontrada");
            return;
        }
        setCategoryDetails(result.name);
    }, [categorieDatabase]);


    // Função para buscar os itens do armazenamento
    async function handleGetItems() {
        try {
            const response = await itemsDatabase.searchByCategoryId(idCategory);            
            setItems(response);

        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível carregar os itens.");
        }
    }
    
    // Chama a função sempre que a tela ganhar foco ou a categoria mudar
    function handleDatais(selected: ItemDataBase) {
        setModalVisible(true);
        setItem(selected);
        if (selected.category_id) {
            loadCategoryName(selected.category_id);
        } else {
            setCategoryDetails("");
        }
    }

    // Função para navegar até a tela de edição de categoria
    function handleEditItem(id: number) {        
        
        setModalVisible(false)
        
        // Navega para a tela de edição, passando o id da categoria como parâmetro
        router.push({
            pathname: './add',
            params: { id }
        });
    }
    
    // Função para remover o item
    async function itemRemove(id: number) {
        try {
            await itemsDatabase.remove(id)

            handleGetItems();
            setModalVisible(false);

        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível excluir o item.");
        }
    }

    // Função para confirmar a exclusão do item
    async function handleDeleteItem(id: number) {
        Alert.alert("Excluir Item", "Tem certeza que deseja excluir este item?", [
            {
                text: "Cancelar",
                style: "cancel"
            },
            {   
                text: "Excluir",
                style: "destructive",
                onPress: () => itemRemove(id)
            }
        ]);

    }
    
    // Função para abrir o modal com os detalhes do item
    useFocusEffect(
        useCallback(() => {
            ScreenOrientation.unlockAsync();
            handleGetItems();
    }, [category, idCategory]));


    return (
        <View style={styles.container}>
            <View style={styles.header}>                
                <TouchableOpacity onPress={() => (setIsMenuVisible(true))}>
                    <MaterialIcons name="menu" size={30} color={colors.green[300]} />
                </TouchableOpacity>
                
                <Pressable onPress={() => {setCategory("Todos"); setIdCategory(0)}}>
                    <Image source={require("@/assets/logo.png")} style={styles.logo} />
                </Pressable>

                <TouchableOpacity onPress={() => router.navigate("./add")}>
                    <MaterialIcons name="add" size={30} color={colors.green[300]} />
                </TouchableOpacity>
                
            </View>

            <Categories onChange={(data) => dataCategory(data.id, data.category)} selected={category} home={true} />

            <FlatList
                data={items}
                keyExtractor={item => String(item.id)}
                renderItem={({ item, index }) => (
                    <Item 
                        isOneItem={index === 0 ? true : false}
                        isEndItem={index === items.length - 1 ? true : false}
                        item={String(items.length - index).toString().padStart(2, '0')}
                        rp={item.rp} 
                        name={item.name} 
                        estado={item.state}
                        onDetails={() => handleDatais(item)} 
                    />
                )}
                style={styles.itens}
                contentContainerStyle={styles.itensContent}
                showsVerticalScrollIndicator={false}
            />


            {/* Modal do Menu */}

            <Modal transparent visible={isMenuVisible} >
                <View style={styles.modalMenuContainer}>
                    <View style={styles.modalMenuContent}>
                        <View style={styles.modalMenuHeaderContainer}>
                            <View style={styles.modalMenuHeader}>
                                <TouchableOpacity onPress={() => { setIsMenuVisible(false) }}>
                                    <MaterialIcons name="menu-open" size={30} color={colors.green[300]} />
                                </TouchableOpacity>

                                <Text style={[styles.modalMenuTitle, { color: colors.green[300] }]}>Menu</Text>
                            </View>
                            
                            <Text style={styles.modalMenuTitle}>Inventory</Text>
                        </View>

                        <View style={styles.modalMenuItens}>
                            <ItemOption 
                                titulo="Setores" 
                                iconName="filter-list"
                                onPress={() => { openOptions("./categories") }}
                            />
                            <ItemOption 
                                titulo="Sincronizar" 
                                iconName="sync"
                                onPress={() => { console.log("Navegar para o perfil...") }}
                            />
                            <ItemOption 
                                titulo="Configurações" 
                                iconName="settings"
                                onPress={() => { console.log("Navegar para as configurações...") }}
                            />
                            <ItemOption 
                                titulo="Sobre"
                                iconName="info"
                                onPress={() => { console.log("Navegar para a tela Sobre...") }}
                            />

                        </View>

                        <View style={styles.modalMenuItensBottom}>
                            <ItemOption 
                                titulo="Sair"
                                iconName="logout"
                                onPress={() => { console.log("Fazer logout...") }}
                            />
                        </View>
                    </View>
                </View>
            </Modal>


            {/* Modal de Detalhes do Item */}

            <Modal transparent visible={modalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalCategory}>{categoryDetails}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <MaterialIcons name="close" size={24} color={colors.gray[400]} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalDetails}>
                            <Text style={styles.modalLabel}>Nome:</Text>
                            <Text style={styles.modalValue}>{item.name}</Text>
                        </View>

                        <View style={styles.modalDetails}>
                            <Text style={styles.modalLabel}>RP:</Text>
                            <Text style={styles.modalValue}>{item.rp}</Text>
                        </View>

                        <View style={styles.modalDetails}>
                            <Text style={styles.modalLabel}>Estado:</Text>
                            <Text style={styles.modalValue}>{item.state}</Text>
                        </View>

                        <View style={styles.modalDetails}>
                            <Text style={styles.modalLabel}>Observação:</Text>
                            <Text style={styles.modalValue} numberOfLines={3} ellipsizeMode="tail" >{item.observation}</Text>
                        </View>

                        <Divider text="Foto do equipamento" mVertical={10}/>
                        
                        <View style={styles.modalImageContent}>
                            <Image 
                                source={{ uri: item.photoUri ? item.photoUri : require('@/assets/logo.png') }} 
                                style={styles.modalImage} 
                                resizeMode="contain"
                            />
                        </View>

                        <Divider text="Foto do RP do equipamento" mVertical={10}/>
                        
                        <View style={styles.modalImageContent}>
                            <Image 
                                source={{ uri: item.photoRpUri ? item.photoRpUri : require('@/assets/logo.png') }} 
                                style={styles.modalImage} 
                                resizeMode="contain"
                            />
                        </View>

                        <View style={styles.modalFooter}>
                            <Option 
                                name="Editar Item"
                                icon="edit"
                                onPress={() => handleEditItem(item.id)}
                            />
                            <Option 
                                name="Excluir Item"
                                icon="delete"
                                variant="secondary"
                                onPress={() => handleDeleteItem(item.id)}
                            />
                        </View>

                    </View>
                </View>

            </Modal>

        </View>
    );
}