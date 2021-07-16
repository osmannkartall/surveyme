import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import {
  DEFAULT_PADDING,
  DEFAULT_COLOR_LIGHT,
  DEFAULT_COLOR_MEDIUM,
  DEFAULT_BORDER_COLOR,
  DEFAULT_COLOR,
} from '../constants/styles';

const Question = ({ number, content, isEditing, children }) => (
  <View style={[styles.container, isEditing ? styles.selectedListItemContainer : null]}>
    <View style={styles.listItem}>
      <View style={styles.listItemContentContainer}>
        <Text style={styles.left}>{`${number}. `}</Text>
        <Text style={styles.listItemTitle}>{content}</Text>
      </View>
    </View>
    <View style={styles.childrenContainer}>{children}</View>
  </View>
);

Question.defaultProps = { isEditing: false };

Question.propTypes = {
  number: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired,
  isEditing: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  selectedListItemContainer: {
    borderWidth: 2,
    borderRadius: 5,
    borderColor: DEFAULT_COLOR,
    marginBottom: 10,
  },
  listItem: {
    borderWidth: 1,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderColor: DEFAULT_COLOR_MEDIUM,
    backgroundColor: DEFAULT_COLOR_LIGHT,
    padding: DEFAULT_PADDING,
  },
  listItemContentContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  listItemTitle: {
    fontSize: 16,
    width: '95%',
  },
  left: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  childrenContainer: {
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: DEFAULT_BORDER_COLOR,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
});

export default Question;
