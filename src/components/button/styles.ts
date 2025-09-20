import { StyleSheet } from 'react-native';

import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
    containerDefault: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.gray[400],
        paddingVertical: 12,
        borderRadius: 8,
        gap: 6,
    },

    containerAlpha: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.green[500],
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 8,
    },

    containerPrimary: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.green[500],
        paddingVertical: 12,
        borderRadius: 8,
        gap: 6,
    },

    containerSecondary: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.gray[600],
        paddingVertical: 12,
        borderRadius: 8,
        gap: 6,
    },

    titleDefault: {
        color: colors.green[900],
        fontSize: 16,
        fontWeight: '600',
    },

    titlePrimary: {
        color: colors.gray[100],
        fontSize: 16,
        fontWeight: '600',
    },

    titleSecondary: {
        color: colors.gray[100],
        fontSize: 16,
        fontWeight: '600',
    }
});