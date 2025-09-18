import { useState, useCallback } from "react";
import { Route, router, useFocusEffect } from "expo-router";
import { View, Text, Image, TouchableOpacity, FlatList, Modal, Alert, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ScreenOrientation from 'expo-screen-orientation';

import { styles } from "./styles";
import { colors } from "@/styles/colors";

import { Categories } from "@/components/categories";
import { Product } from "@/components/product";
import { ItemOption } from "@/components/itemOption";
import { Option } from "@/components/option";

import { useProductsDatabase, ProductDataBase } from "@/database/useProductsDatabase"
import { useItemsDatabase } from "@/database/useItemsDatabase";
import { useCategoriesDatabase } from "@/database/useCategoriesDatabase";


export default function Home() {
    const [category, setCategory] = useState("Todos");  // Estado para armazenar a categoria selecionada
    const [products, setProducts] = useState<ProductDataBase[]>([]);  // Estado para armazenar a lista de produtos
    const [isMenuVisible, setIsMenuVisible] = useState(false) // Estado para controlar a visibilidade do menu
    const [idCategory, setIdCategory] = useState(0);  // Estado para armazenar o ID da categoria selecionada
    const [modalVisible, setModalVisible] = useState(false);  // Estado para controlar a visibilidade do modal de detalhes do item
    const [categoryDetails, setCategoryDetails] = useState("");  // Estado para armazenar o nome da categoria do item selecionado
    const [product, setProduct] = useState<ProductDataBase>({} as ProductDataBase);  // Estado para armazenar o item selecionado no modal


    const productsDatabase = useProductsDatabase(); // Hook para acessar o banco de dados de produtos
    const itemsDatabase = useItemsDatabase();  // Hook para acessar o banco de dados de itens
    const categorieDatabase = useCategoriesDatabase();  // Hook para acessar o banco de dados de categorias
    

    // Função para atualizar a categoria selecionada
    // Atualiza a categoria selecionada
    const dataCategory = useCallback((id: number, category: string) => {
        setIdCategory(id)
        setCategory(category)
    },[])

    // Função para buscar o nome da categoria e salvar no estado
    const loadCategoryName = useCallback(async (idCategory: number) => {
        const result = await categorieDatabase.searchByID(idCategory);
        if (!result) {
            setCategoryDetails("Categoria não encontrada");
            return;
        }
        setCategoryDetails(result.name);
    }, [categorieDatabase]);

    // Função para navegar para as opções do menu
    function openOptions(route: string) { 
        setIsMenuVisible(false);
        router.navigate(route as Route);
    }

    // Função para buscar os products do armazenamento
    async function handleGetProducts() {
        try {
            const response = await productsDatabase.searchByCategoryId(idCategory);
            setProducts(response);

        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível carregar os produtos.");
        }
    }

    // Função para navegar até a tela de edição de categoria
    function handleEditItem(idProduct: number) {          
        setModalVisible(false)

        const id = idProduct;
        
        // Navega para a tela de edição, passando o id da categoria como parâmetro
        router.push({
            pathname: './add',
            params: { id }
        });
    }

    // Função para remover o item
    async function itemRemove(id: number) {
        try {
            // Remove o item do banco de dados
            await productsDatabase.remove(id)  // Remove o produto
            await itemsDatabase.remove(id);  // Remove os itens relacionados ao produto

            // Atualiza a lista de produtos exibida
            handleGetProducts();

            setModalVisible(false); // Fecha o modal de detalhes do item

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

    async function handleModal(selected: ProductDataBase) {
        setProduct(selected);
        setModalVisible(true);
        
        if (selected.category_id) {
            loadCategoryName(selected.category_id);
        } else {
            setCategoryDetails("");
        }
    }
    
    // Chama a função sempre que a tela ganhar foco ou a categoria mudar
    async function handleDetails(idProduct: number) {     
        
        setModalVisible(false)
        
        // Navega para a tela de edição, passando o id da categoria como parâmetro
        router.push({
            pathname: './details',
            params: { id: idProduct }
        });    
    }

    
    // Função para abrir o modal com os detalhes do item
    useFocusEffect(
        useCallback(() => {
            ScreenOrientation.unlockAsync();
            handleGetProducts();
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
                data={products}
                keyExtractor={item => String(item.id)}
                renderItem={({ item, index }) => (
                    <Product
                        isOneItem={index === 0 ? true : false}
                        isEndItem={index === products.length - 1 ? true : false}
                        item={String(products.length - index).toString().padStart(2, '0')}
                        name={item.name} 
                        quantity={item.quantity}
                        onDetails={() => handleModal(item)} 
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
                            <Text style={styles.modalValue}>{product.name}</Text>
                        </View>

                        <View style={styles.modalDetails}>
                            <Text style={styles.modalLabel}>Quantidade:</Text>
                            <Text style={styles.modalValue}>{product.quantity}</Text>
                        </View>

                        <View style={styles.modalDetails}>
                            <Text style={styles.modalLabel}>Observação:</Text>
                            <Text style={styles.modalValue} numberOfLines={3} ellipsizeMode="tail" >{product.observation}</Text>
                        </View>

                        <View style={{ marginTop: 8 }}>
                            <ItemOption 
                                titulo="Mais detalhes" 
                                iconName="arrow-forward"
                                center={true}
                                onPress={() => { handleDetails(product.id) }}
                            />
                        </View>

                        <View style={styles.modalFooter}>
                            <Option 
                                name="Editar produto"
                                icon="edit"
                                onPress={() => handleEditItem(product.id)}
                            />
                            <Option 
                                name="Excluir produto"
                                icon="delete"
                                variant="secondary"
                                onPress={() => handleDeleteItem(product.id)}
                            />
                        </View>

                    </View>
                </View>

            </Modal>

        </View>
    );
}