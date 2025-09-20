import { StyleSheet } from "react-native";

import { colors } from "@/styles/colors";


export const styles = StyleSheet.create({
    container: {
        flex: 1,
        maxHeight: "100%",
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        paddingVertical: 16,
        paddingHorizontal: 24,

        borderBottomColor: colors.gray[800],
        borderBottomWidth: 1,
    },

    title: {
        color: colors.gray[200],
        fontSize: 24,
        fontWeight: "600"
    },

    content: {
        backgroundColor: colors.gray[900],
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 14,
        margin: 15,
        gap: 8
    },

    resumeDetails: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 4
    },

    label: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.gray[200],
    },

    value: {
        fontSize: 16,
        color: colors.gray[400],
        fontWeight: 'bold',
    },

    actionNuvemContent: {
         alignItems: "flex-end", 
         marginTop: 8
    },

    syncDetails: {
        marginBottom: 4,
        marginTop: 18, 
        alignItems: 'flex-start', 
        flexDirection: 'column', 
        gap: 4
    },

    syncDetailsHeader: {
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 8, 
        marginTop: 2
    },

    optionsContent: {
        height: 64, 
        gap: 10, 
        marginTop: 24, 
        marginHorizontal: 20
    }

});