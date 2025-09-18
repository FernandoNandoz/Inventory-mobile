import { useState, useCallback } from "react";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { View, Text, TouchableOpacity, FlatList, Alert, Modal, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { styles } from "./styles";
import { colors } from "@/styles/colors";

import { Input } from "@/components/input";
import { Item } from "@/components/item";
import { Option } from "@/components/option";
import { Divider } from "@/components/divider";

import { useProductsDatabase, ProductDataBase } from "@/database/useProductsDatabase";
import { useItemsDatabase, ItemDataBase } from "@/database/useItemsDatabase";
import { useCategoriesDatabase, CategoryDataBase } from "@/database/useCategoriesDatabase";


export default function Details() {

    const [search, setSearch] = useState("");  // Estado para o texto de busca
    const [item, setItem] = useState<ItemDataBase>({} as ItemDataBase);  // Estado para armazenar o item selecionado
    const [items, setItems] = useState<ItemDataBase[]>([]);  // Estado para a lista de itens
    const [modalVisible, setModalVisible] = useState(false);  // Estado para controlar a visibilidade do modal de detalhes do item
    const [categoryDetails, setCategoryDetails] = useState("");  // Estado para armazenar o nome da categoria do item selecionado
    const [product, setProduct] = useState<ProductDataBase>({} as ProductDataBase);

    const productDatabase = useProductsDatabase(); 
    const itemsDatabase = useItemsDatabase();  // Instância do banco de dados de itens
    const categorieDatabase = useCategoriesDatabase();  // Instância do banco de dados de categorias

    // Pega o ID da categoria a ser editada, se houver
    const { id } = useLocalSearchParams();

    // Função para listar categorias com base no texto de busca
    async function list() {
        try {
            const response = await itemsDatabase.searchByProductId(Number(id), search);
            setItems(response);

        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível carregar os itens.");
        }
    }

    async function loadProduct() {
        const response = await productDatabase.loadProduct(Number(id));
        setProduct(response);
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

    // Chama a função sempre que a tela ganhar foco ou a categoria mudar
    async function handleDetails(selected: ItemDataBase) {    
        setItem(selected);
        setModalVisible(true);
        
        if (selected.category_id) {
            loadCategoryName(selected.category_id);
        } else {
            setCategoryDetails("");
        }
    }

    //
    function handleAdd() {
        router.push({ 
            pathname: "/add" ,
            params: { id, operation: "addItem" }
        });
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

            list();
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


    // Atualiza a lista de categorias sempre que a tela ganha foco ou o texto de busca muda
    useFocusEffect(useCallback(() => {
        loadProduct();
        list();
    }, [search]));


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} >
                    <MaterialIcons name="arrow-back" size={24} color={colors.gray[200]} />
                </TouchableOpacity>
                <Text style={styles.title}>Detalhes produto</Text>
                <TouchableOpacity onPress={handleAdd} >
                    <MaterialIcons name="add" size={26} color={colors.gray[200]} />
                </TouchableOpacity>
            </View>

            <View style={styles.resumeContent}>

                <View style={styles.resumeDetails}>
                    <Text style={styles.label}>Nome:</Text>
                    <Text style={styles.value} numberOfLines={3} ellipsizeMode="tail">{product.name}</Text>
                </View>

                <View style={styles.resumeDetails}>
                    <Text style={styles.label}>Quantidade:</Text>
                    <Text style={styles.value}>{product.quantity}</Text>
                </View>

                <View style={styles.resumeDetails}>
                    <Text style={styles.label}>Observação:</Text>
                    <Text style={styles.value} numberOfLines={3} ellipsizeMode="tail" >{product.observation}</Text>
                </View>

            </View>

            <View style={styles.form}>
                <Input
                    placeholder="Pesquisar pelo RP"
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            <FlatList
                data={items}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item, index }) => (
                    <Item 
                        isOneItem={index === 0 ? true : false}
                        isEndItem={index === items.length - 1 ? true : false}
                        item={String(items.length - index).toString().padStart(2, '0')}
                        name={item.name} 
                        rp={item.rp}
                        onDetails={() => handleDetails(item)} 
                    />
                )}
                ListEmptyComponent={() => (
                    <View style={styles.emptyList}>
                        <Text style={styles.emptyListText}>Nenhum Item Encontrado.</Text>
                    </View>
                )}
                style={styles.itens}
                contentContainerStyle={styles.itensContent}
                showsVerticalScrollIndicator={false}
            />

            

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
                            <Text style={styles.label}>Nome:</Text>
                            <Text style={styles.value}>{item.name}</Text>
                        </View>

                        <View style={styles.modalDetails}>
                            <Text style={styles.label}>RP:</Text>
                            <Text style={styles.value}>{item.rp}</Text>
                        </View>

                        <View style={styles.modalDetails}>
                            <Text style={styles.label}>Estado:</Text>
                            <Text style={styles.value}>{item.state}</Text>
                        </View>

                        <View style={styles.modalDetails}>
                            <Text style={styles.label}>Observação:</Text>
                            <Text style={styles.value} numberOfLines={3} ellipsizeMode="tail" >{item.observation}</Text>
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