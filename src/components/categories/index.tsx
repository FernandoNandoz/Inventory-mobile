import { FlatList } from "react-native";

import { styles } from "./styles";

import { Category } from "@/components/category";
import { categories } from "@/utils/categories";

type CategoriesProps = {
    selected?: string;
    onChange: (categoryId: string) => void;
}

export function Categories( { selected, onChange }: CategoriesProps ) {
    return (
        <FlatList 
            data={categories}
            keyExtractor={ (item) => item.id }
            renderItem={ ({ item }) => (
                <Category 
                    name={item.name}
                    icon={item.icon}
                    isSelected={ item.name === selected }
                    onPress={() => onChange(item.name)}
                /> 
            )}
            horizontal
            style={styles.container}
            contentContainerStyle={styles.content}
            showsHorizontalScrollIndicator={false}
        />
    );
}