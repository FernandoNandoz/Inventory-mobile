import { useState, useEffect } from "react";
import { FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { styles } from "./styles";

import { Category } from "@/components/category";

import { useCategoriesDatabase, CategoryDataBase } from "@/database/useCategoriesDatabase";

type CategoriesProps = {
    selected?: string;
    onChange: (data: { id: number, category: string}) => void;
}

export function Categories( { selected, onChange }: CategoriesProps ) {
    const [categories, setCategories] = useState<CategoryDataBase[]>([]); // Estado para armazenar as categorias

    const categorieDatabase = useCategoriesDatabase();  // Instância do banco de dados de categorias

    // Função para listar as categorias do banco de dados
    async function list() {
        try {
            const response = await categorieDatabase.list(); 
            setCategories(response);
        } catch (error) {
            throw error;
        }
    }

    // Chama a função quando o componente for montado ou quando a lista de categorias mudar
    useEffect(() => {
        list();
    }, [categories]);

    return (
        <FlatList 
            data={categories}
            keyExtractor={ (item) => String(item.id) }
            renderItem={ ({ item }) => (
                <Category 
                    name={item.name}
                    icon={item.icon} 
                    isSelected={ item.name === selected }
                    onPress={() => onChange({ id: item.id, category: item.name })}
                /> 
            )}
            horizontal
            style={styles.container}
            contentContainerStyle={styles.content}
            showsHorizontalScrollIndicator={false}
        />
    );
}