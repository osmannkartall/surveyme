import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const HeaderGroup = ({ title, children }) => {
  const appTitle = 'SurveyMe';

  return (
    <View style={styles.topContainer}>
      <Text style={styles.appTitle}>{appTitle}</Text>
      <Text style={styles.topTitle}>{title}</Text>
      {children}
    </View>
  );
};

HeaderGroup.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
};

const styles = StyleSheet.create({
  topContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  appTitle: {
    fontWeight: 'bold',
    fontSize: 30,
    marginBottom: 10,
  },
  topTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
});

export default HeaderGroup;
