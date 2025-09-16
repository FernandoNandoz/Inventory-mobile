import { useCallback, useState } from "react";
import { View, Image, Text } from "react-native";
import { useFocusEffect } from "expo-router";

import { styles } from "./styles";

import { Input } from "@/components/input";
import { Divider } from "@/components/divider"
import { Option } from "@/components/option";

// Propriedade tipadas
type AddUnitProps = {
    id: number;
    numeroItem: number;
    rp: string;
    state: string;
    observation: string,
    photoUri: string;
    photoRpUri: string,
    category_id: number,
    openCamera: () => void;
    onRemove: (id: number) => void;
    onChange: (data: { rp?: string; state?: string; observation?: string; photoUri?: string; photoRpUri?: string; category_id?: number }) => void;
};

export function AddUnit({ id, numeroItem, rp, state, observation, photoUri, photoRpUri, category_id, openCamera, onRemove, onChange  }: AddUnitProps) {
    const [isVisible, setIsVisible] = useState(true)
    const [isVisibleRpUri, setIsVisibleRpUri] = useState(true)

    function visiblePhotoUri() {
        if (isVisible) {
            setIsVisible(false)
        } else {
            setIsVisible(true)
        }
    }

    function visiblePhotoRpUri() {
        if (isVisibleRpUri) {
            setIsVisibleRpUri(false)
        } else {
            setIsVisibleRpUri(true)
        }
    }

    useFocusEffect(
        useCallback(() => {
            if (category_id){
                onChange({ category_id })
            }
    }, []));

    return (
        <View style={styles.container}>                           
            <Divider text="Item nº" unidade={String(numeroItem)} mVertical={8}/>
            
            <Input 
                placeholder="Nº do RP" 
                value={rp}
                onChangeText={(text) => onChange({ rp: text })} 
                autoCorrect={false}
            />

            <Input 
                placeholder="Estado do item." 
                value={state}
                onChangeText={(text) => onChange({ state: text })} 
                autoCorrect={false} 
            />

            <Input 
                placeholder="Observação (Opcional)" 
                value={observation}
                onChangeText={(text) => onChange({ observation: text })} 
                autoCorrect={false} 
            />
            
            <View style={styles.options}>
                <Option 
                    name="Capturar foto" 
                    icon="photo-camera" 
                    variant="primary" 
                    onPress={openCamera} 
                />
                <Option 
                    name="Deletar item" 
                    icon="delete" 
                    variant="secondary" 
                    onPress={() => onRemove(id)} 
                />
            </View>

            { photoUri && photoRpUri ? (
                <View style={{ gap: 10, marginBottom: isVisible || isVisibleRpUri ? 18 : 0 }}>
                    <Divider text="Foto do equipamento" options state={isVisible} onPress={visiblePhotoUri} />
                    
                    { isVisible ? (
                        <Image source={{ uri: photoUri }} style={styles.previewImage} />
                    ) : (
                        <Text style={[styles.messageText, {  textAlign: 'center' } ]}>
                            👻
                        </Text>
                    ) }
                    
                    <Divider text="Foto do RP" options state={isVisibleRpUri} onPress={visiblePhotoRpUri} />
                    
                    { isVisibleRpUri ? (
                        <Image source={{ uri: photoRpUri }} style={[styles.previewImage, { display: isVisibleRpUri ? "flex" : "none" }]} />
                    ) : (
                        <Text style={[styles.messageText, {  textAlign: 'center' } ]}>
                            👻
                        </Text>
                    ) }
                    
                </View>
            ) : ( 
                <View style={[styles.message, { marginVertical: 26 }]}>
                    <Text style={styles.messageText}>
                        Nenhuma uma imagem adicionada 🫤.
                    </Text>
                </View>
            )}
        </View>
    );
}

