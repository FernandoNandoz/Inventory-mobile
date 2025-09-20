import { useSQLiteContext } from "expo-sqlite";

// Define o tipo SyncLog para representar a estrutura dos logs de sincronização
export type SyncLog = {
  id?: number;
  action: string; // e.g., "connect", "disconnect", "sync", "sync-failed"
  datetime: string;
  user: string;
  status: string; // success | error | pending
  message: string;
};


export function useSyncLogDatabase() {
  
  const database = useSQLiteContext();

  async function addSyncLog(log: Omit<SyncLog, "id">) {
    const statement = await database.prepareAsync(
      "INSERT INTO sync_log (action, datetime, user, status, message) VALUES ($action, $datetime, $user, $status, $message);"
    );
    
    try {
      await statement.executeAsync({
        $action: log.action,
        $datetime: log.datetime,
        $user: log.user,
        $status: log.status,
        $message: log.message,
      });
    } catch (error) {
      return error
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function getLastSyncLog(): Promise<SyncLog | null> {
    const query = "SELECT * FROM sync_log WHERE action = 'sync' OR action = 'sync-failed' ORDER BY datetime DESC LIMIT 1;";
    const response = await database.getAllAsync<SyncLog>(query);
    return response[0] || null;
  }

  async function getLastSyncConnectLog(): Promise<SyncLog | null> {
    const query = "SELECT * FROM sync_log WHERE action = 'connect' OR action = 'disconnect' ORDER BY datetime DESC LIMIT 1;";
    const response = await database.getAllAsync<SyncLog>(query);
    return response[0] || null;
  }

  async function getSyncLogs(limit = 20): Promise<SyncLog[]> {
    const query = `SELECT * FROM sync_log ORDER BY datetime DESC LIMIT ${limit};`;
    return await database.getAllAsync<SyncLog>(query);
  }

  return {
    addSyncLog,
    getLastSyncLog,
    getLastSyncConnectLog,
    getSyncLogs,
  };
}
