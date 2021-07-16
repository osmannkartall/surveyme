import React, { memo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Checkbox } from 'react-native-paper';
import ScorePicker from './ScorePicker';
import { DEFAULT_COLOR } from '../constants/styles';
import Question from './Question';

const areEqual = (prevProps, nextProps) => prevProps.selectedScore === nextProps.selectedScore;

const QuestionItem = memo(({
  content,
  selectedScore,
  onSelectScore,
  index,
  disabled,
  readOnly,
}) => (
  <Question number={index + 1} content={content}>
    <ScorePicker
      selectedScore={selectedScore}
      onSelectScore={onSelectScore}
      index={index}
      disabled={disabled}
      readOnly={readOnly}
    />
    <View style={styles.checkBoxContainer}>
      <Checkbox
        status={selectedScore === null ? 'checked' : 'unchecked'}
        onPress={() => onSelectScore(selectedScore === null ? -1 : null, index)}
        color={DEFAULT_COLOR}
        disabled={readOnly}
      />
      <Text style={styles.checkBoxTitle}>No Answer</Text>
    </View>
  </Question>
), areEqual);

const styles = StyleSheet.create({
  checkBoxContainer: {
    flexDirection: 'row',
  },
  checkBoxTitle: {
    fontSize: 14,
    alignSelf: 'center',
  },
});

export default QuestionItem;
