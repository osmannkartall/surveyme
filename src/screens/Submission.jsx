import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { DEFAULT_PADDING } from '../constants/styles';
import QuestionItem from '../common/QuestionItem';
import QuestionHeader from '../common/QuestionHeader';
import setMessageByCount from '../utils/setMessageByCount';

const Submission = ({ route }) => {
  const { questions, scores, surveyTitle } = route.params;
  const infoTitle = setMessageByCount('Question', questions.length);

  const renderItem = ({ item, index }) => (
    <QuestionItem
      content={item.content}
      selectedScore={scores[index]}
      index={index}
      disabled={scores[index] === null}
      readOnly
    />
  );

  const QuestionsHeaderComponent = () => (
    <QuestionHeader surveyTitle={surveyTitle} infoTitle={infoTitle} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        scrollEnabled
        scrollEventThrottle={16}
        data={questions}
        extraData={scores}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={QuestionsHeaderComponent}
      />
    </View>
  );
};

Submission.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      questions: PropTypes.arrayOf(PropTypes.object).isRequired,
      scores: PropTypes.arrayOf(PropTypes.number).isRequired,
      surveyTitle: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: DEFAULT_PADDING,
    justifyContent: 'center',
  },
});

export default Submission;
