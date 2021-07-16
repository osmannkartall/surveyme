import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Returns string value corresponding to the given key in async storage.
export default async function getDataString(key) {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null)
      return value;
  } catch (error) {
    Alert.alert('Error', error.message);
  }
  return null;
}
