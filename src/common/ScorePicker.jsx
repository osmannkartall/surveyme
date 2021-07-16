import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import PropTypes from 'prop-types';
import { BLACK, DEFAULT_COLOR, MEDIUM_GRAY } from '../constants/styles';

const ScoreButton = ({ onPress, title, pressed, disabled, readOnly }) => (
  <Pressable
    disabled={disabled || readOnly}
    onPress={onPress}
    style={!pressed || disabled ? styles.btnContainer : styles.selectedBtnContainer}
  >
    <Text style={styles.btnTitle}>{title}</Text>
  </Pressable>
);

const numButtons = 11;

const ScorePicker = ({ selectedScore, onSelectScore, index, disabled, readOnly }) => (
  <View style={styles.container}>
    {Array.from(Array(numButtons).keys()).map((score) => (
      <ScoreButton
        key={score}
        title={score.toString()}
        onPress={() => (score !== selectedScore ? onSelectScore(score, index) : {})}
        disabled={disabled}
        readOnly={readOnly}
        pressed={selectedScore === score}
      />
    ))}
  </View>
);

ScorePicker.defaultProps = {
  disabled: undefined,
  readOnly: false,
  onSelectScore: () => {},
  selectedScore: null, // No Answer
  index: 0,
};

ScorePicker.propTypes = {
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  selectedScore: PropTypes.number,
  onSelectScore: PropTypes.func,
  index: PropTypes.number,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
  btnContainer: {
    width: 26,
    height: 26,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: MEDIUM_GRAY,
    justifyContent: 'center',
  },
  selectedBtnContainer: {
    width: 26,
    height: 28,
    borderRadius: 3,
    borderWidth: 3,
    borderColor: DEFAULT_COLOR,
    justifyContent: 'center',
  },
  btnTitle: {
    fontSize: 14,
    color: BLACK,
    alignSelf: 'center',
  },
});

export default ScorePicker;
