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
        marginBottom: 4,
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

    pendingContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6
    },

    conflictContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8
    },

    syncInfoManualInfoContent: {
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 8, 
        marginBottom: 10, 
        justifyContent: 'center'
    },

    feedbackSync: {
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 8, 
        marginBottom: 10, 
        justifyContent: 'center'
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
        
        gap: 10, 
        marginTop: 0, 
        marginHorizontal: 20,
        marginBottom: 10
    },

    dataSummaryContent: {
        flex: 1,
        marginTop: 10, 
        marginHorizontal: 14,
        gap: 8,
    },
    dataSummaryHeader: {
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 8,
        gap: 8
    },
    dataSummaryDetails: {
        flex: 1,
        gap: 2,
        paddingHorizontal: 8,
    },
    dataSummaryFooter: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        paddingTop: 6, 
        paddingBottom: 16,


        borderTopColor: colors.gray[800], 
        borderTopWidth: 1, 
    }
});