import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Returns object value corresponding to the given key in async storage.
export default async function getAsyncData(key) {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null)
      return JSON.parse(value);
  } catch (error) {
    Alert.alert('Error', error.message);
  }
  return null;
}
