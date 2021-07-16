import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Stores given object or string in async storage.
export default async function storeAsyncData(key, value) {
  try {
    let valueArg = value;
    if (typeof (valueArg) === 'object')
      valueArg = JSON.stringify(value);
    await AsyncStorage.setItem(key, valueArg);
  } catch (error) {
    Alert.alert('Error', error.message);
  }
}
