import { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import { styles } from "./styles";
import { colors } from "@/styles/colors";

import { Button } from "@/components/button";

import { useSyncLogDatabase, SyncLog } from "@/database/useSyncLogDatabase";

import { SyncService } from "@/services/SyncService";

export default function ConfigSync() {
    const [isChecking, setIsChecking] = useState(false); // Simula estado de verificação
    const [isConnected, setIsConnected] = useState(false); // Simula estado de conexão
    const [loading, setLoading] = useState(false); // Simula loading ao conectar/desconectar  
    const [syncing, setSyncing] = useState(false);  // Simula estado de sincronização
    const [lastSync, setLastSync] = useState<SyncLog | null>(null); // Estado para última sincronização real

    const syncLogDatabase = useSyncLogDatabase();  // Instância do banco de dados de logs de sincronização

    const { userId, userName, level } = useLocalSearchParams(); // Obtém parâmetros da rota

    // Função para carregar a última sincronização do banco de dados
    const loadInitial = useCallback(async () => {
        const response = await syncLogDatabase.getLastSyncConnectLog();
        setLastSync(response)

        console.log('Último log de conexão carregado:', response);
    }, [isConnected])
    
    // Função para alternar estado de conexão
    // Aqui, você pode chamar SyncService.setBackendConnection ou setUserConnection conforme necessário
    const handleConnectToggle = async () => {
        setLoading(true); // Inicia loading

        const admin = level === 'admin' ? true : false; // Verifica se é admin

        // Altera estado de conexão global (admin) - ajuste conforme necessário
        SyncService.setBackendConnection(!isConnected, admin).then((success) => {
            console.log('Alteração de estado de conexão:', success); // Loga o resultado
            
            // Se a alteração foi bem-sucedida, atualiza o estado de conexão
            if (success) {
                setIsConnected(!isConnected); // Altera estado de conexão real
            } else {
                Alert.alert("Falha na conexão", 'Falha ao alterar estado de conexão. Tente novamente.');
            }
            setLoading(false); // Finaliza loading
        });


        // Registra log real
        await syncLogDatabase.addSyncLog({ 
            action: isConnected ? "disconnect" : "connect",
            datetime: new Date().toISOString().replace('T', ' ').substring(0, 19),
            user: String(userName),
            status: isConnected ? "error" : "success", // Se estava conectado, agora é erro (desconectou), e vice-versa
            message: (
                isConnected ? 
                `Desconectado manualmente por: ${userName}, Level: ${level}` : 
                `Conectado manualmente por: ${userName}, Level: ${level}`
            )
        });

        loadInitial(); // Recarrega a última sincronização
    };

    // Função para verificar estado de conexão inicial (simulado)
    const checkInitialConnection = useCallback(async () => {
        setIsChecking(true);
        setLoading(true);

        const admin = level === 'admin' ? true : false; // Verifica se é admin

        const connected = await SyncService.checkConnection(undefined, admin); // Verifica conexão global (admin)
        setIsConnected(connected);
        setIsChecking(false);
        setLoading(false);

        console.log('Estado de conexão inicial:', connected); // Loga o estado inicial
    }, []);

    // Função para obter informações de status formatadas
    const getStatusInfo =  useCallback((status: string) => {
        switch (status) {
            case 'success':
                return { label: 'Sucesso', color: colors.green[500], icon: 'check-circle' };
            case 'error':
                return { label: 'Disconnect', color: colors.red[500], icon: 'error' };
            case 'pending':
                return { label: 'Pendente', color: colors.gray[400], icon: 'hourglass-empty' };
            default:
                return { label: 'Desconhecido', color: colors.gray[400], icon: 'help-outline' };
        }
    }, []);

    // Verifica estado de conexão inicial (simulado)
    useEffect(() => {
        loadInitial();

        checkInitialConnection();
    }, []);
    

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={24} color={colors.gray[200]} />
                </TouchableOpacity>
                <Text style={styles.title}>Configurações globais</Text>
            </View>

            <View style={styles.content}>

                {/* Status de conexão */}

                <View style={styles.resumeDetails}>
                    <Text style={styles.label}>Status de conexão:</Text>
                    <MaterialIcons
                        name={isConnected ? "cloud-done" : "cloud-off"}
                        size={22}
                        color={isConnected ? colors.green[500] : colors.red[500]}
                        style={{ marginRight: 4 }}
                    />
                    <Text style={[styles.value, { color: isConnected ? colors.green[500] : colors.red[500], fontWeight: "bold" }]}> 
                        {isConnected ? "Conectado à nuvem" : "Desconectado"}
                    </Text>
                </View>


                {/* Botão de conectar/edit/desconect a Nuvem */}

                <View style={styles.actionNuvemContent}>
                    <Button 
                        variant="alpha"
                        name={isChecking ? (
                                "Verificando conexão..."
                            ) : (loading && !isChecking
                                ? (isConnected ? "Desconectando..." : "Conectando...")
                                : (isConnected ? "Desconectar" : "Conectar à nuvem"))
                            }
                        icon={isConnected ? "cloud-off" : "cloud-queue"}
                        isConnected={isConnected}
                        loading={loading}
                        onPress={handleConnectToggle}
                        disabled={loading}
                    />
                </View>



                {/* Informações da última sincronização */}
                <View style={styles.syncDetails}> 
                    <Text style={styles.label}>Última conexão:</Text>
                    
                    {lastSync ? (
                        <>
                            <View style={styles.syncDetailsHeader}>
                                <MaterialIcons
                                    name={getStatusInfo(lastSync.status).icon as any}
                                    size={20}
                                    color={getStatusInfo(lastSync.status).color}
                                    style={{ marginRight: 2 }}
                                />
                                <Text style={[styles.value, { color: getStatusInfo(lastSync.status).color, fontWeight: 'bold', marginBottom: 4 }]}> 
                                    {getStatusInfo(lastSync.status).label}
                                </Text>
                            </View>

                            <View style={[{flexDirection: 'row', gap: 4, marginTop: 2 }]}>
                                <Text style={[styles.value, { fontWeight: 'bold' }]}>
                                    Data/hora:
                                </Text>  
                                <Text style={[styles.value, { fontWeight: 'bold' }]}>
                                    {lastSync.datetime}
                                </Text>
                            </View>

                            <View style={[{flexDirection: 'row', gap: 4, marginTop: 2 }]}>
                                <Text style={[styles.value, { fontWeight: 'bold' }]}>
                                    Usuário:
                                </Text>
                                <Text style={[styles.value, { fontWeight: 'bold' }]}>
                                    {lastSync.user}
                                </Text>
                            </View>

                            {lastSync.message && (
                                <View style={[{ gap: 4, marginTop: 2, overflow: "hidden" }]}>
                                    <Text style={[styles.value, { fontWeight: 'bold' }]}>
                                        Mensagem:
                                    </Text> 
                                    <Text style={[styles.value, { fontWeight: 'bold' }]} numberOfLines={3} ellipsizeMode="tail">
                                        {lastSync.message}
                                    </Text>
                                </View>
                            )}
                        </>
                    ) : (
                        <Text style={[styles.value, { marginTop: 2 }]}>
                            Nenhuma registro encontrado.
                        </Text>
                    )}
                </View>

            </View>

            {/* Ações principais */}
            <View style={styles.optionsContent}>
                <Button 
                    variant="primary"
                    name={isChecking ? "Verificando..." : "Atualizar estado de conexão"}
                    icon="sync"
                    onPress={checkInitialConnection}
                    disabled={syncing}
                />
            </View>
        </View>
    );
}