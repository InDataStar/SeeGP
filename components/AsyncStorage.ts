import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadFiltersFromStorage = async (): Promise<Record<string, string[]> | null> => {
  try {
    const json = await AsyncStorage.getItem('appFilters');
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
};

export const saveFiltersToStorage = async (filters: Record<string, string[]>) => {
  try {
    await AsyncStorage.setItem('appFilters', JSON.stringify(filters));
  } catch {
    // Handle error
  }
};

export const clearFiltersFromStorage = async () => {
  try {
    await AsyncStorage.removeItem('appFilters');
  } catch {
    // Handle error
  }
};
