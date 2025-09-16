import { StyleSheet } from "react-native";

import { colors } from "@/styles/colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        maxHeight: "100%",
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",

        paddingTop: 16,
        paddingHorizontal: 24,
        marginBottom: 20,
    },

    title: {
        color: colors.gray[200],
        fontSize: 24,
        fontWeight: "600"
    },

    setorSelection: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },

    selectedCategory: {
        color: colors.gray[200],
        fontSize: 22,
        fontWeight: "700",
        textAlign: "center",
        paddingBottom: 4,
    },

    label: {
        color: colors.gray[400],
        fontSize: 16,
        fontWeight: "600",
        paddingHorizontal: 24,
    },
    
    form: {
        flex: 1,
        padding: 24,
        paddingBottom: 6,
        paddingTop: 18,
        gap: 14,

        borderTopColor: colors.gray[800],
        borderTopWidth: 1,
    },

    unitsList: {
        marginBottom: 2,
    },

    option: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    footer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        paddingBottom: 26,

        borderTopColor: colors.gray[800],
        borderTopWidth: 1,
    },




    modalContainer: {
        position: 'absolute',
        width: '100%',
        maxHeight: '85%',
        bottom: 0,
        justifyContent: "flex-end"
    },

    modalContent: {
        backgroundColor: colors.gray[900],
        borderTopWidth: 1,
        //borderTopColor: colors.gray[800],
        paddingBottom: 24,
        padding: 24,

        borderTopLeftRadius: 16,
        borderTopRightRadius: 16
    },

    modalHeader: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 18,
    },

    modalTitleHeader: {
        flex: 1,
        fontSize: 16,
        fontWeight: "500",
        color: colors.gray[400],
    },

    modalDetailsRow: {
        flexDirection: "row",
        gap: 32,
    },
    
    modalDetails: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 10,
    },

    modalLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.gray[200],
    },

    modalValue: {
        fontSize: 16,
        color: colors.gray[400],
        maxWidth: '84%',
    },

    modalItemList: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: "space-between",
        minHeight: 90,

        backgroundColor: colors.gray[800],
        borderRadius: 8,
    },

    modalItemContent: {
        padding: 10,
    },

    modalItemLabelContent: {
        flexDirection: "row",
        gap: 6,
        marginBottom: 2
    },

    modalItemListLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.gray[200],
    },

    modalItemListValue: {
        fontSize: 16,
        maxWidth: 115,
        color: colors.gray[400],
    },

    modalFooter: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "center",
        marginTop: 8,
        marginBottom: 0,

        borderTopColor: colors.gray[600],
        borderTopWidth: 1,
        paddingTop: 16,
        paddingBottom: 6
    },





    modalCaptureContainer: {
        flex: 1,
        backgroundColor: colors.gray[950],
    },

    modalCaptureHeader: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 24,
        paddingVertical: 6
    },

    modalCaptureTitleHeader:{
        flex: 1,
        fontSize: 20,
        fontWeight: "500",
        color: colors.gray[200],
    },

    modalCaptureCameraContent: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalCaptureMessage: {
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
        //paddingTop: 26,
        color: colors.gray[400],
    },

    modalCaptureCamera: {
        width: '100%',
        height: '88%',
    },

    modalCaptureButtonContent: {
        flex: 1,
        backgroundColor: 'transparent',
        width: 100,
        height: 100,
        paddingHorizontal: 34,
        alignItems: 'center',
        justifyContent: 'center',
    },

    modalCaptureButton: {
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.gray[500],
        borderRadius: 50,
        borderColor: colors.gray[200],
        borderWidth: 4,
    },

    modalCaptureButtonPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.gray[900],
        marginHorizontal: 8,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },

    modalCaptureText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.gray[200],
    },

    landscapeMessage: {
        position: 'absolute',
        top: '50%',
        left: '48%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        transform: [{ translateX: -150 }, { translateY: -50 }],
        backgroundColor: colors.green[500],
        padding: 20,
        borderRadius: 10,
        zIndex: 10,
        elevation: 10,
        color: colors.gray[200],
        fontSize: 16,
        fontWeight: '600',
    },

    containerMessagePermission: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 40,
    },

    modalCaptureMessagePermission: {
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
        paddingTop: 26,
        color: colors.gray[400],
        paddingHorizontal: 24,
    },
});