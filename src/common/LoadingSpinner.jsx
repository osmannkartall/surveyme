import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { DEFAULT_COLOR, DEFAULT_PADDING } from '../constants/styles';

const LoadingSpinner = () => (
  <View style={styles.container}>
    <ActivityIndicator size={70} color={DEFAULT_COLOR} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: DEFAULT_PADDING,
    alignItems: 'center',
  },
});

export default LoadingSpinner;
