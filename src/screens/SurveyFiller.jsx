import React, { useContext, useState } from 'react';
import { FlatList, View, StyleSheet, Text, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { DEFAULT_PADDING } from '../constants/styles';
import SubmitButton from '../common/SubmitButton';
import { submissionsRef } from '../configs/firebase';
import { UserContext } from '../context/UserContext';
import { AnonymousUserContext } from '../context/AnonymousUserContext';
import LoadingModal from '../common/LoadingModal';
import QuestionHeader from '../common/QuestionHeader';
import QuestionItem from '../common/QuestionItem';
import { SUBMISSION_SUCCESS, UNFILLED_QUESTION, SUBMISSION } from '../constants/alerts';
import storeAsyncData from '../utils/storeAsyncData';
import getAsyncData from '../utils/getAsyncData';
import setMessageByCount from '../utils/setMessageByCount';
import getCurrentDateTime from '../utils/getCurrentDateTime';
import showFirebaseError from '../utils/showFirebaseError';

const SurveyFiller = ({ navigation, route }) => {
  const { questions, surveyTitle, surveyId, surveyCode } = route.params;
  const warningTitle = 'Please provide a score for each question or mark as No Answer.';
  const infoTitle = setMessageByCount('Question', questions.length);
  const [loading, setLoading] = useState(false);
  const [scores, setScores] = useState(new Array(questions.length).fill(-1));
  const [user] = useContext(UserContext);
  const [, setAnonymousUser] = useContext(AnonymousUserContext);

  const onPressSubmitButton = () => {
    // Check unfilled questions.
    const unfilledQuestions = [];

    scores.forEach((score, idx) => {
      if (score === -1)
        unfilledQuestions.push(idx + 1);
    });
    if (unfilledQuestions.length > 0) {
      Alert.alert('Error', UNFILLED_QUESTION + unfilledQuestions);
    } else {
      const submission = {
        scores,
        surveyId,
        insertDate: getCurrentDateTime(),
      };

      Alert.alert('Warning', SUBMISSION, [
        { text: 'Cancel' },
        {
          text: 'OK',
          onPress: async () => {
            try {
              setLoading(true);
              await submissionsRef.add(submission);
              Alert.alert('Success', SUBMISSION_SUCCESS, [
                {
                  text: 'OK',
                  onPress: async () => {
                    const surveyCodes = await getAsyncData('surveyCodes');

                    if (!surveyCodes) {
                      await storeAsyncData('surveyCodes', [surveyCode]);
                    } else {
                      surveyCodes.push(surveyCode);
                      await storeAsyncData('surveyCodes', surveyCodes);
                    }

                    if (user.isLoggedIn)
                      navigation.navigate('Surveys');
                    else
                      setAnonymousUser(null);
                  },
                },
              ]);
            } catch (error) {
              showFirebaseError(error);
              setLoading(false);
            }
          },
        },
      ]);
    }
  };

  const onSelectScore = (newValue, i) => {
    setScores((prevState) => prevState.map((item, idx) => (idx === i ? newValue : item)));
  };

  const renderItem = ({ item, index }) => (
    <QuestionItem
      content={item.content}
      selectedScore={scores[index]}
      onSelectScore={onSelectScore}
      index={index}
      disabled={scores[index] === null}
    />
  );

  const QuestionsHeaderComponent = () => (
    <QuestionHeader surveyTitle={surveyTitle} infoTitle={infoTitle}>
      <Text style={styles.infoTitle}>{warningTitle}</Text>
    </QuestionHeader>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
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
      <SubmitButton title="SUBMIT" onPress={onPressSubmitButton} disabled={loading} />
      <LoadingModal visible={loading} />
    </View>
  );
};

SurveyFiller.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      questions: PropTypes.arrayOf(PropTypes.object).isRequired,
      surveyTitle: PropTypes.string.isRequired,
      surveyId: PropTypes.string.isRequired,
      surveyCode: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  topContainer: {
    flex: 1,
    paddingHorizontal: DEFAULT_PADDING,
  },
  infoTitle: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
    paddingHorizontal: 20,
  },
});

export default SurveyFiller;
