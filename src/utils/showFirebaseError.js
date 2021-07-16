import { Alert } from 'react-native';

export default function showFirebaseError(error) {
  if (error.code && error.message)
    Alert.alert(error.code, error.message);
}
