import { StyleSheet } from 'react-native';

import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
    containerPrimary: {
        flexDirection: "row",
        gap: 8,
        height: 52,
        width: '100%',
        backgroundColor: colors.green[300],
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },

    containerSecondary: {
        flexDirection: "row",
        gap: 8,
        height: 52,
        width: '100%',
        backgroundColor: colors.gray[900],
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },

    titlePrimary: {
        color: colors.green[900],
        fontSize: 16,
        fontWeight: '600',
    },

    titleSecondary: {
        color: colors.gray[200],
        fontSize: 16,
        fontWeight: '600',
    }
});