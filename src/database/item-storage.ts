import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from 'expo-file-system';

const ITEM_STORAGE_KEY = "inventory@items";

export type ItemTypes = {
  id: number;
  setor: string;
  rp: string;
  name: string;
  state: string;
  photoUri: string;
};

async function getItems(): Promise<ItemTypes[]> {
  try {
    const storage = await AsyncStorage.getItem(ITEM_STORAGE_KEY);
    const response = storage ? JSON.parse(storage) : [];

    return response

  } catch (error) {
    throw error;
  }
}


async function saveItem(newItem: ItemTypes): Promise<void> {
  try {
    const storage = await getItems();
    const updated = JSON.stringify([...storage, newItem]);

    await AsyncStorage.setItem(ITEM_STORAGE_KEY, updated);

  } catch (error) {
    throw error;
  }
}


async function deleteItem(id: string): Promise<void> {
  try {
    const storage = await getItems();
    const updated = storage.filter((item) => String(item.id) !== id);

    await AsyncStorage.setItem(ITEM_STORAGE_KEY, JSON.stringify(updated));

  } catch (error) {
    throw error;
  }
}






async function getPhoto(): Promise<ItemTypes[]> {
  try {
    let storedPhotos = await AsyncStorage.getItem(ITEM_STORAGE_KEY);
    let photosArray = storedPhotos ? JSON.parse(storedPhotos) : [];

    return photosArray;
  } catch (error) {
    throw new Error("Could not retrieve photos.");
  }
}

async function savePhoto(photoUri: ItemTypes) {
  try {
    // Salva a URI no AsyncStorage (exemplo: lista de fotos)
    const storagePhotos = await getPhoto();
    const updated = JSON.stringify([...storagePhotos, photoUri]);
  
    await AsyncStorage.setItem(ITEM_STORAGE_KEY, updated);

  } catch (error) {
    throw new Error("Could not save photo.");
  }
}


export const ItemStorage = {
  getItems,
  saveItem,
  deleteItem,
};