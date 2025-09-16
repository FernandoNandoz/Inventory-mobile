import { useState, useCallback, useRef, useEffect } from "react";
import { Accelerometer } from 'expo-sensors';
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { View, Text, Image, TouchableOpacity, FlatList, Modal, Alert } from "react-native";
import { CameraView, useCameraPermissions, CameraCapturedPicture } from 'expo-camera';
import * as FileSystem from 'expo-file-system/legacy'

import { MaterialIcons } from "@expo/vector-icons";

import { styles } from "./styles";
import { colors } from "@/styles/colors";

import { Categories } from "@/components/categories";
import { Input } from "@/components/input";
import { Divider } from "@/components/divider"
import { AddUnit } from "@/components/addUnit";
import { Option } from "@/components/option";
import { categories } from "@/utils/categories";

import { useItemsDatabase, ItemDataBase } from "@/database/useItemsDatabase";
import { useCategoriesDatabase } from "@/database/useCategoriesDatabase";


// Hook para detectar orientação baseada no acelerômetro
function useLandscapeDetection() {
    const [isLandscape, setIsLandscape] = useState(true); // padrão: true para não bloquear

    useEffect(() => {
        let subscription = Accelerometer.addListener(({ x, y }) => {
            // Se |x| > |y|, está em paisagem
            setIsLandscape(Math.abs(x) > Math.abs(y));
        });
        Accelerometer.setUpdateInterval(300); // Atualiza a cada 300ms
        return () => subscription && subscription.remove();
    }, []);
    return isLandscape;
}


export default function Add() {
    // Hook 
    const isLandscape = useLandscapeDetection();  // Hook para detectar orientação

    // Estados
    const [openModalFinish, setOpenModalFinish] = useState(false);  // Estado para abrir/fechar o modal de finalizar cadastro
    const [openCapture, setOpenCapture] = useState(false);  // Estado para abrir/fechar o modal da câmera
    const [isEnabled, setIsEnabled] = useState(false);  // Estado para habilitar/desabilitar o botão de adicionar item
    const [isEnabledFinalCad, setIsEnabledFinalCad] = useState(false);  // Estado para habilitar/desabilitar o botão de finalizar cadastro
    const [idCategory, setIdCategory] = useState(0) 
    const [category, setCategory] = useState("");  // Categoria selecionada
    const [nomeItem, setNomeItem] = useState("");  // Nome do item
    const [itemsAdded, setItemsAdded] = useState<ItemDataBase[]>([]);  // Array de itens adicionados
    const [isEditing, setIsEditing] = useState(false); // Estado para verificar se está editando um item existente

    // Câmera
    const cameraRef = useRef<any>(null);  // Referência para a câmera
    const [permission, requestPermission] = useCameraPermissions();  // Permissões da câmera
    const [isPreview, setIsPreview] = useState(false);  // Estado para mostrar o preview da foto
    const [photoUri, setPhotoUri] = useState('');  // URI da foto capturada
    const [photoRpUri, setPhotoRpUri] = useState(''); 
    const [isPhotoRp, setIsPhotoRp] = useState(false);
    const [photosCaptured, setPhotosCaptured] = useState(false);
    const [canTakePicture, setCanTakePicture] = useState(true); // Controle para evitar race condition entre confirmação e nova foto

    // Instância do banco de dados de categorias
    const itemsDatabase = useItemsDatabase();
    const categorieDatabase = useCategoriesDatabase();  // Instância do banco de dados de categorias

    // Pega o ID da categoria a ser editada, se houver
    const { id } = useLocalSearchParams();

    // Função para buscar o nome da categoria pelo ID
    async function getCategory(id: number) {
        const response = await categorieDatabase.searchByID(id)

        return response.name
    }

    // Carrega os dados do item a ser editado
    async function loadItemData() {
        const response = await itemsDatabase.loadItem(Number(id))

        setNomeItem(response.name)
        setIdCategory(response.category_id)        
        setCategory(await getCategory(response.category_id))
        setItemsAdded([response])

        setIsEnabled(true)
        setIsEnabledFinalCad(true)
        setIsEditing(true)
    }

    // Função para atualizar a categoria selecionada
    // Atualiza a categoria selecionada
    const dataCategory = useCallback((id: number, category: string) => {
        setIdCategory(id)
        setCategory(category)
    },[])

    // Adiciona um novo item ao array de items
    const handleAddItem = useCallback(() => {
        // Se não houver items adicionados, o nome do item é obrigatório
        if (itemsAdded.length === 0 && nomeItem.trim() === "") {
            Alert.alert('Atenção', 'Informe o nome do item antes de adicionar novas unidades de item.');
            return;
        }
        // Valida o último item adicionado
        if (itemsAdded.length > 0) {
            const lastItemsAdded = itemsAdded[0];
            if (!lastItemsAdded.rp?.trim() || !lastItemsAdded.state?.trim() || !lastItemsAdded.photoUri?.trim() || !lastItemsAdded.photoRpUri?.trim()) {
                Alert.alert('Atenção', 'Preencha todos os campos obrigatórios (Nº do RP, Estado do item e anexe uma foto) antes de adicionar um novo item.');
                return;
            }

            setIsEnabledFinalCad(true); // Habilita o botão de finalizar cadastro
        }

        setItemsAdded(prev => [
            {
                id: Date.now() + Math.floor(Math.random() * 1000),
                rp: '',
                state: '',
                observation: '',
                photoUri: '',
                photoRpUri: '',
                setor: category,
                name: nomeItem,
                category_id: idCategory
            },
            ...prev
        ]);

    }, [itemsAdded, nomeItem, category]);

    // Remove um item do array de items pelo ID
    const handleRemoveUnit = useCallback((id: number) => {
        setItemsAdded((prev) => prev.filter((unit) => unit.id !== id));
    }, []);

    // Atualiza os dados de um item específico no array de items
    const handleUpdateUnit = useCallback((id: number, data: { rp?: string; state?: string; observation?: string; photoUri?: string; photoRpUri?: string; category_id?: number }) => {
        setItemsAdded(prev => prev.map(unit => {
            if (unit.id !== id) return unit;
            return {
                ...unit,
                rp: data.rp !== undefined ? data.rp : unit.rp,
                state: data.state !== undefined ? data.state : unit.state,
                observation: data.observation !== undefined ? data.observation : unit.observation,
                photoUri: data.photoUri !== undefined ? data.photoUri : unit.photoUri,
                photoRpUri: data.photoRpUri !== undefined ? data.photoRpUri : unit.photoRpUri,
                category_id: data.category_id !== undefined ? data.category_id : unit.category_id
            };
        }));
    }, []);


    // Salva o item no armazenamento
    // Salva todos os itens adicionados
    const handleSaveItem = useCallback(async () => {
        // Valida os dados antes de salvar
        try {

            // Valida todos os itens
            for (const item of itemsAdded) {
                // Cada item deve ter RP, estado e foto
                if (!item.rp?.trim() || !item.state?.trim() || !item.photoUri?.trim() || !item.photoRpUri?.trim() || !item.category_id) {
                    return Alert.alert('Atenção', 'Preencha todos os campos obrigatórios de cada unidade antes de salvar.');
                }
            }

            // Salva cada item
            for (const item of itemsAdded) {

                // Salva no banco de dados 
                const response = await itemsDatabase.create({
                    rp: item.rp,
                    name: item.name,
                    state: item.state,
                    observation: item.observation,
                    photoUri: item.photoUri,
                    photoRpUri: item.photoRpUri,
                    category_id: item.category_id
                });
            }

            // Reseta os estados após salvar
            Alert.alert("Sucesso", "Itens salvos com sucesso!", [
                { text: "Ok", onPress: () => router.back() },
            ]);

        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível adicionar os itens.");
        }
    }, [category, nomeItem, itemsAdded]); // Adicionadas dependências category, nomeItem e itemsAdded:  category, nomeItem, itemsAdded


    // Salva as edições de um item existente
    const handleEditItem = useCallback(async () => {
        // Valida os dados antes de salvar
        try {

            // Valida todos os itens
            for (const item of itemsAdded) {
                // Cada item deve ter RP, estado e foto
                if (!item.rp?.trim() || !item.state?.trim() || !item.photoUri?.trim() || !item.photoRpUri?.trim() || !item.category_id) {
                    return Alert.alert('Atenção', 'Preencha todos os campos obrigatórios de cada unidade antes de salvar.');
                }
            }

            // Salva no banco de dados 
            await itemsDatabase.update({
                id: itemsAdded[0].id,
                rp: itemsAdded[0].rp,
                name: nomeItem,
                state: itemsAdded[0].state,
                observation: itemsAdded[0].observation,
                photoUri: itemsAdded[0].photoUri,
                photoRpUri: itemsAdded[0].photoRpUri,
                category_id: itemsAdded[0].category_id
            });

            // Reseta os estados após salvar
            Alert.alert("Sucesso", "Alterações salvas com sucesso!", [
                { text: "Ok", onPress: () => router.back() },
            ]);

        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível adicionar os itens.");
        }
    }, [category, nomeItem, itemsAdded]); // Adicionadas dependências category, nomeItem e itemsAdded:  category, nomeItem, itemsAdded


    // Função para abrir o modal de finalizar cadastro

    // Abre o Modal de finalizar cadastro
    const openFinishiCad = useCallback(() => {
        setOpenModalFinish(true); // Abre o modal da câmera
    }, []);




    // Função para a câmera

    // Abre o Modal da Camera
    // Corrige: openCamera só abre modal, permissões são tratadas no render
    const openCamera = useCallback(() => {
        setOpenCapture(true); // Abre o modal da câmera
        setIsPhotoRp(false);
        setPhotosCaptured(false);
    }, []);

    // Função para tirar a foto
    const takePicture = useCallback(async () => {
        if (!canTakePicture) return;

        setCanTakePicture(false);

        try {
            // Verifica se o dispositivo está em modo paisagem
            if (!isLandscape) {
                Alert.alert('Atenção', 'Vire o aparelho para o modo paisagem para tirar a foto.');
                setCanTakePicture(true);
                return;
            }

            // Verifica se a câmera está pronta e a referência existe
            if (cameraRef.current) {
                let photo: CameraCapturedPicture = await cameraRef.current.takePictureAsync(); // Captura a foto 

                if (!isPhotoRp) {
                    setPhotoUri(photo.uri); // Salva a URI da foto rotacionada no estado
                } else {
                    setPhotoRpUri(photo.uri)
                    console.log("Salvou aqui: " + photo.uri)
                }

                setIsPreview(true); // Mostra o preview da foto

                // Pausa a pré-visualização da câmera para economizar recursos
                if (cameraRef.current.pausePreview) {
                    cameraRef.current.pausePreview();
                }

                photo.uri = '' // Limpa a URI temporariamente
                setCanTakePicture(false);

                // Permite tirar nova foto após um pequeno delay para evitar múltiplas capturas acidentais
                setTimeout(() => {
                    setCanTakePicture(true);
                }, 1000); // 1 segundo de delay
                
            }
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível capturar a foto.');
            console.error(error);
        }
    }, [isLandscape, isPhotoRp, canTakePicture]);

    // Função para refazer a foto
    const handleRetake = useCallback(() => {
        setIsPreview(false); // Esconde o preview da foto
        
        // Retoma a pré-visualização da câmera
        if (cameraRef.current && cameraRef.current.resumePreview) {
            cameraRef.current.resumePreview();
        }
    }, []);

    // Função para salvar a foto na pasta da categoria
    const handleSave = useCallback(async () => {
        // Se não houver foto, retorna
        if (!photoUri || !photoRpUri) return;

        const listUri = [photoUri, photoRpUri]
        let listNewPath = []

        // Cria a pasta da categoria se não existir e move a foto para lá
        try {
            // Garante que o nome da pasta seja seguro
            const categoryDir = FileSystem.documentDirectory + category.replace(/[^a-zA-Z0-9_-]/g, '_') + '/';
            const dirInfo = await FileSystem.getInfoAsync(categoryDir);

            // Cria a pasta se não existir
            if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(categoryDir, { intermediates: true });
            }

            for (const item of listUri) {

                // Gera um nome de arquivo único e seguro
                const safeTimestamp = Date.now();
                const fileName = `photo_${safeTimestamp}.jpg`;
                const newPath = categoryDir + fileName;
                const photoInfo = await FileSystem.getInfoAsync(item);

                // Verifica se o arquivo da foto existe antes de mover
                if (!photoInfo.exists) {
                    Alert.alert('Erro', 'A foto não foi encontrada no armazenamento temporário.');
                    return;
                }

                // Move a foto para a pasta da categoria
                await FileSystem.moveAsync({ from: item, to: newPath });

                listNewPath.push(newPath)
            }
            
            // Atualiza o último item adicionado com o caminho da foto
            if (itemsAdded.length > 0) { 
                handleUpdateUnit(itemsAdded[0].id, { photoUri: listNewPath[0], photoRpUri: listNewPath[1] });                    
                
                setIsPhotoRp(false)
            }
            
            // Reseta estados e fecha o modal
            setPhotoUri('');
            setPhotoRpUri('');
            setIsPreview(false);
            setPhotosCaptured(false);
            setIsEnabledFinalCad(true); // Habilita o botão de finalizar cadastro
            setOpenCapture(false);            
            
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível salvar a foto.');
            console.error(error);
        }
    }, [photoUri, photoRpUri, category, itemsAdded, handleUpdateUnit]); // Adicionada dependência handleUpdateUnit

    // Efeito para habilitar/desabilitar o botão de adicionar item
    useFocusEffect(
        useCallback(() => {
            // Habilita o botão de adicionar item apenas se uma categoria for selecionada
            setIsEnabled(category !== "" ? true : false);

            if (id && !isEditing) {
                loadItemData()
            }
    }, [category, id]));
    

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} >
                    <MaterialIcons name="arrow-back" size={24} color={colors.gray[200]} />
                </TouchableOpacity>
                <Text style={styles.title}>{!isEditing ? "Novo item" : "Editar item"}</Text>
            </View>
            <Text style={styles.label}>Selecione um setor:</Text>

            <Categories onChange={(data) => dataCategory(data.id, data.category)} selected={category} />

            <View style={styles.form}>
                
                {category ? 
                    <>
                        <View style={styles.setorSelection}>
                            {(() => {
                                const selectedCategory = categories.find(cat => cat.name === category);
                                return (
                                    <MaterialIcons 
                                        name={selectedCategory ? selectedCategory.icon : "help-outline"}
                                        size={24}
                                        color={colors.gray[200]}
                                    />
                                );
                            })()}
                            <Text style={styles.selectedCategory}>{category}</Text> 
                        </View>
                    </>
                : null }

                <Input 
                    placeholder="Informe o nome do item" 
                    value={nomeItem}
                    onChangeText={setNomeItem} 
                    autoCorrect={false} 
                    isEnabled={isEnabled}
                />
                
                <View style={styles.option}>
                    <Option 
                        name="Adicionar item"
                        icon="add"
                        variant="secondary"
                        onPress={handleAddItem}
                        isEnabled={isEnabled && !isEditing}
                    />
                </View>

                <FlatList 
                    data={itemsAdded}
                    keyExtractor={item => String(item.id)}
                    renderItem={({ item, index }) => (
                        <AddUnit 
                            id={item.id}
                            numeroItem={itemsAdded.length - index}
                            rp={item.rp}
                            state={item.state}
                            observation={item.observation}
                            photoUri={item.photoUri}
                            photoRpUri={item.photoRpUri}
                            category_id={idCategory}
                            openCamera={openCamera}
                            onChange={(data) => handleUpdateUnit(item.id, data)}
                            onRemove={handleRemoveUnit}
                        />
                    )}
                    style={styles.unitsList}
                    showsVerticalScrollIndicator={false}
                />
            </View>
            <View style={styles.footer}>
                <Option 
                    name={!isEditing ? "Finalizar cadastro" : "Salvar edição"}
                    icon={!isEditing ? "arrow-forward": "edit"}
                    onPress={openFinishiCad}
                    isEnabled={isEnabledFinalCad}
                />
            </View>
            

            {/* Modal de resumo dinâmico (pode ser controlado por um estado, aqui mantido oculto) */}
            <Modal transparent visible={openModalFinish} animationType="slide" style={{ flex: 1 }}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitleHeader}>Resumo do cadastro</Text>
                            <TouchableOpacity onPress={() => setOpenModalFinish(false)}>
                                <MaterialIcons name="close" size={22} color={colors.gray[400]} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalDetailsRow}>
                            <View style={styles.modalDetails}>
                                <Text style={styles.modalLabel}>Nº de itens:</Text>
                                <Text style={styles.modalValue}>{itemsAdded.length}</Text>
                            </View>
                            <View style={styles.modalDetails}>
                                <Text style={styles.modalLabel}>Setor:</Text>
                                <Text style={styles.modalValue}>{category}</Text>
                            </View>
                        </View>
                        <View style={styles.modalDetails}>
                            <Text style={styles.modalLabel}>Nome:</Text>
                            <Text style={styles.modalValue} numberOfLines={3}>{nomeItem}</Text>
                        </View>

                        <Divider text="Itens cadastrados" />

                        <FlatList 
                            data={itemsAdded}
                            keyExtractor={item => String(item.id)}
                            renderItem={({ item }) => (
                                <View style={styles.modalItemList}>
                                    <View style={styles.modalItemContent}>
                                        <View style={styles.modalItemLabelContent}>
                                            <Text style={styles.modalItemListLabel}>RP:</Text>
                                            <Text style={styles.modalItemListValue}>{item.rp}</Text>
                                        </View>
                                            <Text style={styles.modalItemListLabel}>Estado:</Text>
                                            <Text style={[styles.modalItemListValue, { maxWidth: 145, } ]} ellipsizeMode="tail">{item.state}</Text>
                                    </View>
                                    { item.photoUri ? <Image source={{ uri: item.photoUri }} style={{ width: 180, maxWidth: 180, height: "auto", borderTopRightRadius: 8, borderBottomRightRadius: 8 }} /> : null } 
                                </View>
                            )}
                            style={{ maxHeight: '80%' }}
                        />
                        <View style={styles.modalFooter}>
                            <Option 
                                name="Salvar cadastro"
                                icon="save"
                                onPress={isEditing ? handleEditItem : handleSaveItem}
                            />
                        </View>
                    </View>
                </View>
            </Modal>


            {/* Modal da câmera */}
            <Modal visible={openCapture} animationType="slide">
                <View style={styles.modalCaptureContainer}> 
                    <View style={styles.modalCaptureHeader}>
                        <Text style={styles.modalCaptureTitleHeader}>Pré-vizualização (Preview)</Text>
                        <TouchableOpacity onPress={() => setOpenCapture(false)}>
                            <MaterialIcons name="close" size={24} color={colors.gray[200]} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.modalCaptureCameraContent}>
                        {/* Permissão da câmera */}
                        {!permission ? (
                            <View />
                        ) : !permission.granted ? (
                            <View style={styles.containerMessagePermission}>
                                <Text style={styles.modalCaptureMessagePermission}>É necessário permitir o acesso à câmera para continuar</Text>
                                <Option onPress={requestPermission} name="Permitir acesso a câmera" icon="camera-alt" variant="permission" />
                            </View>

                        ) : isPreview && photoUri ? (
                            <View style={{ width: '100%', height: '100%', gap: 12, paddingTop: 8 }}>

                                <Divider text="Foto do Equipamento" mVertical={10} />
                                
                                <Image source={{ uri: photoUri }} style={{ resizeMode: 'contain', width: '100%', height: 220, borderRadius: 12 }} />

                                { !isPhotoRp ? (
                                    <View style={{ alignItems: 'center', paddingHorizontal: 34, gap: 20, marginBottom: 8  }}>
                                        <Text style={styles.modalCaptureMessage}>Confirme se a foto está nítida e legível.</Text>

                                        <View style={{ flexDirection: 'row' }}>
                                            <TouchableOpacity style={[styles.modalCaptureButtonPreview, { paddingVertical: 8 }]} onPress={handleRetake}>
                                                <MaterialIcons name="refresh" size={26} color={colors.gray[200]} />
                                                <Text style={styles.modalCaptureText}>Tirar outra</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[styles.modalCaptureButtonPreview, { paddingVertical: 8 }]} onPress={() => {setIsPhotoRp(true)}}>
                                                <MaterialIcons name="check" size={26} color={colors.green[300]} />
                                                <Text style={[styles.modalCaptureText, { color: colors.green[300] } ]}>Confirmar</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ) : (
                                   null 
                                )}
                                

                                <Divider text="Capturar foto do RP" mVertical={10} />


                                {/* Se houver foto do RP, mostra o preview e o botão para refazer */}
                                { isPhotoRp && photoRpUri ? (
                                    <View style={{ flex: 1, gap: 20 }}>
                                        <Image source={{ uri: photoRpUri }} style={{ resizeMode: 'contain', width: '100%', height: 220, borderRadius: 12 }} />
                                        
                                        { !photosCaptured ? (
                                            <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 34, gap: 16, marginBottom: 8 }}>
                                                <Text style={styles.modalCaptureMessage}>Confirme se a foto está nítida e legível.</Text>

                                                <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 34, paddingTop: 10 }}>  
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <TouchableOpacity style={[styles.modalCaptureButtonPreview, { paddingVertical: 8 }]} onPress={handleRetake}>
                                                            <MaterialIcons name="refresh" size={26} color={colors.gray[200]} />
                                                            <Text style={styles.modalCaptureText}>Tirar outra</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={[styles.modalCaptureButtonPreview, { paddingVertical: 8 }]} onPress={() => setPhotosCaptured(true)}>
                                                            <MaterialIcons name="check" size={26} color={colors.green[300]} />
                                                            <Text style={[styles.modalCaptureText, { color: colors.green[300] } ]}>Confirmar</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        ) : (
                                            <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 34, gap: 16, marginBottom: 8 }}>
                                                <Text style={styles.modalCaptureMessage}>Agora é so salvar... 😎✨</Text>
                                            </View>
                                        ) }
                                        
                                    </View>
                                ) : (
                                    //Se não houver foto do RP, mostra o botão para capturar                
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 12 }}>
                                        { isPhotoRp && photoUri ? (
                                            <Option 
                                                name="Capturar foto do RP" 
                                                icon="photo-camera" 
                                                variant="primary" 
                                                onPress={() => setIsPreview(false)} 
                                            />
                                        ) : (
                                            <Text style={styles.modalCaptureMessage}>.</Text>
                                        ) }
                                    </View>
                                    
                                ) }

                                {/* Exibe o botão de salvar apenas se ambas as fotos estiverem capturadas */}
                                { photoUri && photoRpUri && photosCaptured ? (
                                    <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 16, paddingBottom: 26, borderTopColor: colors.gray[800],  borderTopWidth: 1, }}>
                                        <Option 
                                            name="Salvar imagem"
                                            icon="save"
                                            onPress={handleSave}
                                        />
                                    </View>
                                ) : null }
                            </View>
                        ) : (
                            <>
                                { isLandscape ? null : <Text style={styles.landscapeMessage}>Vire o aparelho para o modo paisagem</Text>}
                                <CameraView
                                    ref={cameraRef}
                                    style={[styles.modalCaptureCamera, { borderColor: isLandscape ? 'green' : 'red', borderWidth: 3 }]}
                                    facing='back'
                                    onCameraReady={() => console.log('Camera ready!')}
                                    ratio='16:9'
                                    autofocus="on"
                                    
                                />
                                <View style={styles.modalCaptureButtonContent}>
                                    <TouchableOpacity style={styles.modalCaptureButton} onPress={takePicture} />
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>


        </View>
    );
}