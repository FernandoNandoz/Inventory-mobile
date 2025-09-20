import { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import { styles } from "./styles";
import { colors } from "@/styles/colors";

import { Button } from "@/components/button";
import { Option } from "@/components/option";

import { useSyncLogDatabase, SyncLog } from "@/database/useSyncLogDatabase";
import { useUsersDatabase, UserDataBase } from "@/database/useUsersDatabase";
import { useCategoriesDatabase, CategoryDataBase } from "@/database/useCategoriesDatabase";
import { useProductsDatabase, ProductDataBase } from "@/database/useProductsDatabase";
import { useItemsDatabase, ItemDataBase } from "@/database/useItemsDatabase";

import { SyncService } from "@/services/SyncService";


export default function Sync() {
    // Estados para controle de conexão e sincronização
    
    const [isConnected, setIsConnected] = useState(false); // Simula estado de conexão
    const [loading, setLoading] = useState(false); // Simula loading ao conectar/desconectar  
    const [syncing, setSyncing] = useState(false);  // Simula estado de sincronização
    const [syncFeedback, setSyncFeedback] = useState<null | { type: 'success' | 'error', message: string }>(null); // Feedback após sincronização
    const [pendingCount, setPendingCount] = useState<number>(0); // Quantidade de itens pendentes
    const [hasConflict, setHasConflict] = useState(false); // Buscar quantidade de itens pendentes (state = 'pendente') e conflitos (state = 'conflito')
    const [lastSync, setLastSync] = useState<SyncLog | null>(null); // Estado para última sincronização real
    const [isPending, setIsPending] = useState(false);  // Estado para indicar se há dados pendentes

    // Estados para dados locais

    const [users, setUsers] = useState<UserDataBase[]>([])  // Estado para usuários
    const [categories, setCategories] = useState<CategoryDataBase[]>([])  // Estado para categorias
    const [products, setProducts] = useState<ProductDataBase[]>([]) // Estado para produtos
    const [items, setItems] = useState<ItemDataBase[]>([])  // Estado para itens

    // Instâncias dos bancos de dados
    
    const syncLogDatabase = useSyncLogDatabase();  // Funções para logs de sincronização 
    const usersDatabase = useUsersDatabase(); // Função para buscar usuários no banco de dados
    const categoryDatabase = useCategoriesDatabase(); // Função para buscar categorias no banco de dados
    const productDatabase = useProductsDatabase(); // Função para buscar produtos no banco de dados
    const itemDatabase = useItemsDatabase(); // Função para buscar itens no banco de dados 
    
    const { userId, userName, level } = useLocalSearchParams(); // Parâmetro de rota (ID do usuário logado - mock)


    // Função para buscar todos os dados a sincronizar
    async function getAllSyncData() {
        const responseUsers = await usersDatabase.getAllSync(); // Busca todos os usuários
        const responseCategory = await categoryDatabase.getAllSync(); // Busca todas as categorias
        const responseProduct = await productDatabase.getAllProductsSync();  // Busca todos os produtos
        const responsItem = await itemDatabase.getAllItemsSync();  // Busca todos os itens

        // Atualiza estados com os dados buscados

        setUsers(responseUsers) // Atualiza estado com usuários
        setCategories(responseCategory) // Atualiza estado com categorias
        setProducts(responseProduct)  // Atualiza estado com produtos
        setItems(responsItem) // Atualiza estado com itens

        // Define se há dados pendentes
        if (responseUsers.length > 0 || responseCategory.length > 0 || responseProduct.length > 0 || responsItem.length > 0) {
            setIsPending(true)
        }
    }
    
    // Função para obter informações de status formatadas
    const getStatusInfo =  useCallback((status: string) => {
        switch (status) {
            case 'success':
                return { label: 'Sucesso', color: colors.green[500], icon: 'check-circle' };
            case 'error':
                return { label: 'Erro', color: colors.red[500], icon: 'error' };
            case 'pending':
                return { label: 'Pendente', color: colors.gray[400], icon: 'hourglass-empty' };
            default:
                return { label: 'Desconhecido', color: colors.gray[400], icon: 'help-outline' };
        }
    }, []);

    // Função mock para conectar/desconectar
    const handleConnectToggle = () => {
        setLoading(true); // Inicia loading

        // Altera estado de conexão real
        SyncService.setUserConnection(!isConnected, String(userId)).then((success) => {

            console.log('Alteração de estado de conexão:', success); // Loga o resultado

            // Se a alteração foi bem-sucedida, atualiza o estado de conexão
            if (success) {
                setIsConnected(!isConnected); // Altera estado de conexão real
            } else {
                alert('Falha ao alterar estado de conexão. Tente novamente.');
            }
            setLoading(false); // Finaliza loading
        });

        /*/ Simula processo de conexão/desconexão com timeout
        setTimeout(() => {
            // Verifica conexão real
            SyncService.checkConnection().then((connected) => {
                console.log('Conexão verificada:', connected);
                setIsConnected(connected); // Atualiza estado de conexão real
                setLoading(false); // Finaliza loading
            });
        }, 1000); // Simula tempo de conexão*/
    };

    // Função para buscar o último log de sincronização
    const checkInitialConnection = useCallback(async () => {
        setLoading(true);

        const connected = await SyncService.checkConnection(String(userId));

        setIsConnected(connected);
        setLoading(false);

        console.log('Conexão inicial verificada:', connected);
    }, []);

    // Função mock para sincronização manual
    const handleManualSync = useCallback(async () => {
        setSyncing(true); // Inicia sincronização
        setSyncFeedback(null);  // Limpa feedback anterior

        // Simula processo de sincronização com timeout
        setTimeout(async () => {

            // Simula sucesso ou erro aleatório
            const isSuccess = Math.random() > 0.3; // 70% de chance de sucesso
            const action = isSuccess ? 'sync' : 'sync-failed'; // Ação baseada no resultado
            const now = new Date();  // Data/hora atual
            const datetime = now.toISOString().replace('T', ' ').substring(0, 19);  // Formata como "YYYY-MM-DD HH:MM:SS"
            const user = String(userName); // Substitua pelo usuário logado real se disponível
            
            let status = isSuccess ? 'success' : 'error';  // Status baseado no resultado
            let message = isSuccess ? 'Sincronização realizada com sucesso!' : 'Falha ao sincronizar. Tente novamente.';  // Mensagem baseada no resultado
            
            // Registra log real
            await syncLogDatabase.addSyncLog({ action, datetime, user, status, message }); 
            setSyncFeedback({ type: status as 'success' | 'error', message }); // Define feedback para o usuário
            
            // Atualiza última sincronização
            setLastSync({ action, datetime, user, status, message });

            // Atualiza pendentes e conflitos
            if (isSuccess) {
                setPendingCount(0); // Limpa pendentes em caso de sucesso
                setHasConflict(false); // Limpa conflitos em caso de sucesso
            }
            setSyncing(false); // Finaliza sincronização
        }, 1800);

    }, []);

    const handleManualGetSync = useCallback(async () => {
        setSyncing(true);
        setSyncFeedback(null);  // Limpa feedback anterior

        SyncService.get("Products").then((response) => {
            console.log("Resposta do get sync:", response);
        });

        // Simula processo de sincronização com timeout
        setTimeout(async () => {
            // Simula sucesso ou erro aleatório
            const isSuccess = Math.random() > 0.3; // 70% de chance de sucesso
            const action = isSuccess ? 'get-sync' : 'get-sync-failed'; // Ação baseada no resultado
            const now = new Date();  // Data/hora atual
            const datetime = now.toISOString().replace('T', ' ').substring(0, 19);  // Formata como "YYYY-MM-DD HH:MM:SS"
            const user = String(userName); // Substitua pelo usuário logado real se disponível
            let status = isSuccess ? 'success' : 'error';  // Status baseado no resultado
            let message = isSuccess ? 'Sincronização realizada com sucesso!' : 'Falha ao sincronizar. Tente novamente.';  // Mensagem baseada no resultado
            
            // Registra log real
            await syncLogDatabase.addSyncLog({ action, datetime, user, status, message }); 
            
            setSyncFeedback({ type: status as 'success' | 'error', message });
            
            // Atualiza última sincronização
            setLastSync({ action, datetime, user, status, message });
            setSyncing(false);
        }, 1800);

    }, []);

    // Função para buscar o último log de sincronização
    const fetchLastSync =  useCallback(async () => {
        const log = await syncLogDatabase.getLastSyncLog();
        setLastSync(log); // Atualiza com o último log encontrado
    }, []);

    // Função para buscar itens pendentes e com conflito
    const fetchPendingAndConflict =  useCallback(async () => {
        try {
            const allItems = await itemDatabase.searchByProductId(0, "");  // Busca todos os itens (mock)
            const pendentes = allItems.filter((item: any) => item.state === 'pendente');  // Filtra itens pendentes
            const conflitos = allItems.filter((item: any) => item.state === 'conflito');  // Filtra itens com conflito
            
            setPendingCount(pendentes.length);  // Atualiza contagem de pendentes
            setHasConflict(conflitos.length > 0);  // Atualiza estado de conflito
        } catch (e) {
        setPendingCount(0);  // Em caso de erro, assume 0 pendentes
            setHasConflict(false);  // Em caso de erro, assume sem conflitos
        }
    }, []);

    // useEffect para buscar dados iniciais ao montar o componente e ao mudar o estado de sincronização    
    useFocusEffect(
        useCallback(() => {
            
            checkInitialConnection(); // Verifica conexão inicial

            // Chama a função para buscar todos os dados a sincronizar
            getAllSyncData()

            // Chama a função para buscar o último log
            fetchLastSync();

            // Chama a função para buscar pendentes e conflitos
            fetchPendingAndConflict();
        }, [syncing, userId]))

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={24} color={colors.gray[200]} />
                </TouchableOpacity>
                <Text style={styles.title}>Sincronizar dados</Text>
            </View>

            <View style={styles.content}>

                {/* Quantidade de dados a sincronizar */}
                <View style={styles.resumeDetails}> 
                    <Text style={styles.label}>Dados a sincronizar:</Text>
                    <Text style={[styles.value, { color: pendingCount > 0 ? colors.green[500] : colors.gray[400] }]}> 
                        {pendingCount} registro{pendingCount === 1 ? '' : 's'}
                    </Text>
                </View>

                {/* Aviso de dados pendentes */}
                {pendingCount > 0 && (
                    <View style={styles.pendingContent}>
                        <MaterialIcons name="warning" size={18} color={colors.orange[500]} />
                        <Text style={{ color: colors.orange[500], fontWeight: 'bold' }}>
                            Há dados pendentes de sincronização!
                        </Text>
                    </View>
                )}

                {/* Aviso de conflito e botão de forçar sincronização */}
                {hasConflict && (
                    <View style={styles.conflictContent}>
                        <MaterialIcons name="error-outline" size={20} color={colors.red[500]} />

                        <Text style={{ color: colors.red[500], fontWeight: 'bold' }}>
                            Conflito detectado!
                        </Text>

                        <TouchableOpacity
                            style={{
                                marginLeft: 8,
                                backgroundColor: colors.red[500],
                                borderRadius: 6,
                                paddingVertical: 4,
                                paddingHorizontal: 10,
                            }}
                            onPress={() => {
                                setSyncFeedback(null);
                                setSyncing(true);
                                setTimeout(() => {
                                    setSyncFeedback({ type: 'success', message: 'Sincronização forçada realizada!' });
                                    setSyncing(false);
                                    setHasConflict(false);
                                    setPendingCount(0);
                                }, 1500);
                            }}
                            disabled={syncing}
                        >
                            <Text style={{ color: colors.gray[100], fontWeight: 'bold', fontSize: 14 }}>
                                Forçar sincronização
                            </Text>
                        
                        </TouchableOpacity>
                    </View>
                )}

                {/* Feedback de sincronização manual */}
                {syncing && (
                    <View style={styles.syncInfoManualInfoContent}>
                        <ActivityIndicator size="small" color={colors.green[500]} />
                        <Text style={[styles.value, { color: colors.green[500], fontWeight: 'bold' }]}>
                            Sincronizando...
                        </Text>
                    </View>
                )}

                {syncFeedback && (
                    <View style={styles.feedbackSync}>
                        <MaterialIcons
                            name={syncFeedback.type === 'success' ? 'check-circle' : 'error'}
                            size={20}
                            color={syncFeedback.type === 'success' ? colors.green[500] : colors.red[500]}
                        />
                        <Text style={{ color: syncFeedback.type === 'success' ? colors.green[500] : colors.red[500], fontWeight: 'bold' }}>
                            {syncFeedback.message}
                        </Text>
                    </View>
                )}


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
                        name={loading
                                ? (isConnected ? "Desconectando..." : "Conectando...")
                                : (isConnected ? "Desconectar" : "Conectar à nuvem")
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
                    <Text style={styles.label}>Última sincronização:</Text>
                    
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
                            Nenhuma sincronização registrada.
                        </Text>
                    )}
                </View>

            </View>

            {/* Resumo dos dados locais */}
            <View style={styles.dataSummaryContent}>
                <View style={styles.dataSummaryHeader}>
                    <Text style={styles.label}>Resumo dos dados pendentes:</Text>
                    <MaterialIcons name="storage" size={20} color={colors.gray[200]} />
                </View>
                <View style={styles.dataSummaryDetails}> 

                    <FlatList
                        data={products} // Mostra apenas os 3 primeiros produtos
                        keyExtractor={(item) => item.id.toString()}  // Usa o ID do produto como chave única
                        renderItem={({ item }) => {
                            const category = categories.find(cat => cat.id === item.category_id);
                            const categoryName = category ? category.name : 'Categoria não encontrada';
                            
                            return (
                            <View style={{ flex: 1, flexDirection: 'row', paddingVertical: 2, gap: 6 }}>
                                <Text style={[styles.value, { width: "30%", color: colors.gray[400] }]} numberOfLines={1} ellipsizeMode="tail">
                                    {categoryName}
                                </Text>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={[styles.value, { color: colors.gray[400] }]} numberOfLines={1} ellipsizeMode="tail">
                                        {item.name}
                                    </Text>
                                    <Text style={[styles.value, { color: colors.gray[400] }]}>
                                        Qtd: {item.quantity}
                                    </Text>
                                </View>
                            </View>
                        )}}
                        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.gray[800], marginVertical: 2 }} />}
                        ListEmptyComponent={() => (
                            <Text style={[styles.value, { color: colors.gray[400], fontStyle: 'italic' }]}>
                                Nenhum item pendente.
                            </Text>
                        )}
                        showsVerticalScrollIndicator={false}
                        style={{ flex: 1 }} 
                        nestedScrollEnabled
                    />

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopColor: colors.gray[800], borderTopWidth: 1, paddingTop: 6, paddingBottom: 16 }}>
                        <Text style={[styles.value, { color: colors.gray[400] }]}> 
                            Total geral: {products.length} item{products.length === 1 ? '' : 's'}
                            , {categories.length} categoria{categories.length === 1 ? '' : 's'} e {users.length} usuário{users.length === 1 ? '' : 's'}.
                        </Text>

                        <Option 
                            name="Ver todos"
                            icon="arrow-forward"
                        />
                    </View>

                </View>
            </View>

            {/* Ações principais */}
            <View style={[styles.optionsContent, level === 'admin' ? { height: 170 } : { height: 110 }]}>
                <Button 
                    variant="primary"
                    name={syncing ? 'Sincronizando...' : 'Sincronizar agora'}
                    icon="sync"
                    onPress={handleManualSync}
                    disabled={syncing}
                />

                <Button 
                    variant="secondary"
                    name="Histórico"
                    icon="history"
                    onPress={() => handleManualGetSync()}
                />

                { level === 'admin' && (
                    <Button 
                        name="Gerenciamento de conexões global"
                        icon="settings"
                        onPress={() => router.push({ 
                            pathname: './configSync', 
                            params: { 
                                userId, 
                                userName, 
                                level 
                            } 
                        })}
                    />
                )}
            </View>
        </View>
    );
}