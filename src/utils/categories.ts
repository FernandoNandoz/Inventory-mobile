import { MaterialIcons } from "@expo/vector-icons";

type Category = {
    id: string;
    name: string;
    icon: keyof typeof MaterialIcons.glyphMap;
};

export const categories: Category[] = [
    { id: "1", name: "CGTI", icon: "category" },
    { id: "2", name: "LAB CVT", icon: "desktop-windows" },
    { id: "3", name: "LAB Puranga", icon: "desktop-windows" },
    { id: "4", name: "LAB GESAC", icon: "desktop-windows" },
    { id: "5", name: "Bibliolan", icon: "menu-book" },
    { id: "6", name: "DE", icon: "person-outline" },
];