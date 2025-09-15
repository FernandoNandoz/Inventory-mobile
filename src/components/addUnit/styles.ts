import { StyleSheet } from 'react-native';

import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
    container: {
        gap: 10,      
    },

    imageRP: {
        width: '100%',
        height: 100,
        resizeMode: "contain",
        alignSelf: "center",
        borderRadius: 8,
    },

    options: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        marginTop: 6,
        marginBottom: 10,
    },

    previewImage: {
        width: '100%',
        height: 200,
        resizeMode: "contain",
        alignSelf: "center",
        borderRadius: 8,
    },

    message: {
        width: '100%',
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        fontSize: 14,
        color: colors.gray[400]
    },

    messageText: {
        fontSize: 14,
        color: colors.gray[400]
    }

});

