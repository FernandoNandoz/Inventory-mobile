import * as FileSystem from "expo-file-system/legacy";

/**
 * Converte um arquivo local (URI) para string base64.
 * @param uri Caminho do arquivo local
 * @returns Base64 ou null se não existir
 */
export async function uriToBase64(uri?: string): Promise<string | null> {
  if (!uri) return null;
  return await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
}
