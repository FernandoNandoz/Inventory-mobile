import { StyleSheet } from "react-native";

import { colors } from "@/styles/colors";

export const styles = StyleSheet.create({
    container: {
        height: 56,
        width: "100%",
        padding: 10,
        fontSize: 16,
        
        backgroundColor: colors.gray[900],
        color: colors.gray[100],

        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.gray[800],
    }
});