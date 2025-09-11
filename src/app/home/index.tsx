import { useState, useCallback } from "react";
import { router, useFocusEffect } from "expo-router";
import { View, Text, Image, TouchableOpacity, FlatList, Modal, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ScreenOrientation from 'expo-screen-orientation';

import { styles } from "./styles";
import { colors } from "@/styles/colors";

import { Categories } from "@/components/categories";
import { Item } from "@/components/item";
import { Option } from "@/components/option";
import { categories } from "@/utils/categories";
import { ItemStorage, ItemTypes } from "@/database/item-storage";


export default function Home() {
    const [category, setCategory] = useState(categories[0].name);
    const [item, setItem] = useState<ItemTypes>({} as ItemTypes);
    const [items, setItems] = useState<ItemTypes[]>([]);
    const [modalVisible, setModalVisible] = useState(false);

    
    
    // Função para buscar os itens do armazenamento
    async  function handleGetItems() {
        try {
            const response = await ItemStorage.getItems();
            const filteredItems = response.filter((items) => items.setor === category);
            
            setItems(filteredItems);
            
        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível carregar os itens.");
        }
    }
    
    // Chama a função sempre que a tela ganhar foco ou a categoria mudar
    function handleDatais(selected: ItemTypes) {
        setModalVisible(true)
        setItem(selected);
    }

    // Função para remover o item
    async function itemRemove() {
        try {
            await ItemStorage.deleteItem(String(item.id));

            handleGetItems();
            setModalVisible(false);

        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível excluir o item.");
        }
    }

    // Função para confirmar a exclusão do item
    async function handleDeleteItem() {
        Alert.alert("Excluir Item", "Tem certeza que deseja excluir este item?", [
            {
                text: "Cancelar",
                style: "cancel"
            },
            {   
                text: "Excluir",
                style: "destructive",
                onPress: itemRemove
            }
        ]);

    }
    
    // Função para abrir o modal com os detalhes do item
    useFocusEffect(
        useCallback(() => {
            ScreenOrientation.unlockAsync();
            handleGetItems();
    }, [category]));


    return (
        <View style={styles.container}>
            <View style={styles.header}>                
                <Image source={require("@/assets/logo.png")} style={styles.logo} />

                <TouchableOpacity onPress={() => router.navigate("./add")}>
                    <MaterialIcons name="add" size={30} color={colors.green[300]} />
                </TouchableOpacity>
            </View>

            <Categories onChange={setCategory} selected={category} />

            <FlatList
                data={items}
                keyExtractor={item => String(item.id)}
                renderItem={({ item }) => (
                    <Item 
                        isOneItem={"01" === "01" ? true : false}
                        isEndItem={"06" === "06" ? true : false}
                        item={"01"}
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


            <Modal transparent visible={modalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalCategory}>{item.setor}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <MaterialIcons name="close" size={22} color={colors.gray[400]} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalDetailsRow}>
                            <View style={styles.modalDetails}>
                                <Text style={styles.modalLabel}>Item:</Text>
                                <Text style={styles.modalValue}>01</Text>
                            </View>

                            <View style={styles.modalDetails}>
                                <Text style={styles.modalLabel}>RP:</Text>
                                <Text style={styles.modalValue}>{item.rp}</Text>
                            </View>
                        </View>

                        <View style={styles.modalDetails}>
                            <Text style={styles.modalLabel}>Nome:</Text>
                            <Text style={styles.modalValue}>{item.name}</Text>
                        </View>

                        <View style={styles.modalDetails}>
                            <Text style={styles.modalLabel}>Estado:</Text>
                            <Text style={styles.modalValue}>{item.state}</Text>
                        </View>

                        <Text style={styles.modalDivider}>Registro RP:</Text>
                        
                        <View style={styles.modalImageContent}>
                            <Image 
                                source={require("@/assets/logo.png")} 
                                style={styles.modalImage} 
                                resizeMode="contain"
                            />
                        </View>

                        <View style={styles.modalFooter}>
                            <Option 
                                name="Editar Item"
                                icon="edit"
                                onPress={() => console.log('Editar Item')}
                            />
                            <Option 
                                name="Excluir Item"
                                icon="delete"
                                variant="secondary"
                                onPress={handleDeleteItem}
                            />
                        </View>

                    </View>
                </View>

            </Modal>

        </View>
    );
}