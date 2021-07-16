import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Button } from 'react-native-paper';
import { DEFAULT_PADDING, WHITE } from '../constants/styles';

const SubmitButton = ({ title, onPress, disabled }) => (
  <View style={styles.container}>
    <Button mode="contained" disabled={disabled} onPress={onPress} style={styles.btn}>
      {title}
    </Button>
  </View>
);

SubmitButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    paddingHorizontal: DEFAULT_PADDING,
  },
  btn: {
    marginBottom: 10,
    marginTop: 10,
  },
});

export default SubmitButton;
