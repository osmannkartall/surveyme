import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';
import { DEFAULT_COLOR } from '../constants/styles';

const QuestionHeader = ({ surveyTitle, infoTitle, children }) => (
  <View style={styles.infoContainer}>
    <Icon name="clipboard-list-outline" size={60} color={DEFAULT_COLOR} />
    <Text style={styles.surveyTitle}>{surveyTitle}</Text>
    <Text style={styles.infoTitle}>{infoTitle}</Text>
    {children}
  </View>
);

QuestionHeader.propTypes = {
  surveyTitle: PropTypes.string.isRequired,
  infoTitle: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  surveyTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoContainer: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  infoTitle: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
  },
});

export default QuestionHeader;
