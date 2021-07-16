import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import PropTypes from 'prop-types';
import { DEFAULT_COLOR } from '../../constants/styles';
import { NewSurveyContext } from '../../context/NewSurveyContext';
import setMessageByCount from '../../utils/setMessageByCount';

const SurveyQuestionsHeader = ({ collapsedIcon, onPressCollapseButton }) => {
  const [newSurvey] = useContext(NewSurveyContext);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.infoTitle}>SURVEY QUESTIONS</Text>
        <Text style={styles.infoSubtitle}>
          {setMessageByCount('Question', newSurvey.questions.length)}
        </Text>
      </View>
      <View style={styles.toggleBtnContainer}>
        <IconButton color={DEFAULT_COLOR} icon={collapsedIcon} onPress={onPressCollapseButton} />
      </View>
    </View>
  );
};

SurveyQuestionsHeader.propTypes = {
  collapsedIcon: PropTypes.string.isRequired,
  onPressCollapseButton: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toggleBtnContainer: {
    justifyContent: 'center',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
  infoSubtitle: {
    fontSize: 14,
    marginBottom: 10,
  },
});

export default SurveyQuestionsHeader;
