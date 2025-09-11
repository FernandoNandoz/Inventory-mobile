import { View, Image, Text } from "react-native";

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
    photoUri: string;
    openCamera: () => void;
    onRemove: (id: number) => void;
    onChange: (data: { rp?: string; state?: string; photoUri?: string }) => void;
};

export function AddUnit({ id, numeroItem, rp, state, photoUri, openCamera, onRemove, onChange  }: AddUnitProps) {

    return (
        <View style={styles.container}>                           
            <Divider text="Item nº" unidade={String(numeroItem)}/>
            
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

            { photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.previewImage} />
            ) : ( 
                <View style={styles.message}>
                    <Text style={styles.messageText}>
                        Nenhuma uma imagem adicionada 🫤.
                    </Text>
                </View>
            )}
        </View>
    );
}

