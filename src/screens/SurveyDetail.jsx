import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, Text, Alert, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Clipboard from 'expo-clipboard';
import { Divider, Button, List } from 'react-native-paper';
import { submissionsRef, surveysRef } from '../configs/firebase';
import {
  DEFAULT_BORDER_COLOR,
  DEFAULT_COLOR,
  DEFAULT_GRAY,
  REMOVE_COLOR,
} from '../constants/styles';
import LoadingModal from '../common/LoadingModal';
import { SurveysContext } from '../context/SurveysContext';
import { UserContext } from '../context/UserContext';
import {
  PUBLISH_SURVEY,
  DELETE_SURVEY,
  DELETE_SURVEY_SUCCESS,
  PUBLISH_SURVEY_SUCCESS,
} from '../constants/alerts';
import sortBy from '../utils/sortBy';
import setMessageByCount from '../utils/setMessageByCount';
import showFirebaseError from '../utils/showFirebaseError';

const SurveyDetail = ({ navigation, route }) => {
  const { surveyId } = route.params;
  const [selectedSurvey, setSelectedSurvey] = useState({});
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [copiedText, setCopiedText] = useState('COPY');
  const [surveys, setSurveys] = useContext(SurveysContext);
  const [user] = useContext(UserContext);

  // Get the data of selected survey.
  useEffect(() => {
    let mounted = true;

    if (mounted) {
      const index = surveys.findIndex((e) => e.id === surveyId);

      if (index !== -1) {
        setSelectedSurvey(surveys[index]);
        navigation.setOptions({ headerTitle: surveys[index].title });
      }
    }

    return function cleanup() {
      mounted = false;
    };
  }, [surveyId]);

  // Get submissions for the selected survey.
  useEffect(() => {
    let unsubscribe;

    if (surveyId) {
      unsubscribe = submissionsRef.where('surveyId', '==', surveyId).onSnapshot((snapshot) => {
        if (removing) {
          unsubscribe();
        } else {
          const submissionsData = [];

          snapshot.forEach((doc) => submissionsData.push({ id: doc.id, ...doc.data() }));
          sortBy(submissionsData, 'insertDate');
          setSubmissions(submissionsData);
          setLoading(false);
        }
      },
      (error) => {
        showFirebaseError(error);
        setLoading(false);
      });
    } else {
      Alert('Error', 'Cannot identify the survey.');
    }

    return function cleanup() {
      unsubscribe();
    };
  }, [removing]);

  const onPressCopy = () => {
    Clipboard.setString(selectedSurvey.surveyCode);
    setCopiedText('COPIED!');
  };

  useEffect(() => {
    let timeout;
    if (copiedText !== 'COPY')
      timeout = setTimeout(() => setCopiedText('COPY'), 1000);
    return function cleanup() {
      clearTimeout(timeout);
    };
  }, [copiedText]);

  const publishSurvey = async () => {
    if (user.uid) {
      const index = surveys.findIndex((e) => e.id === surveyId);

      setLoading(true);
      if (index !== -1) {
        try {
          const updatedSurveys = [...surveys];
          const survey = { ...updatedSurveys[index] };

          await surveysRef.doc(survey.id).update({ published: true });
          survey.published = true;
          updatedSurveys[index] = survey;
          setSurveys(updatedSurveys);
          // Hide publish button.
          setSelectedSurvey({ ...selectedSurvey, published: true });
          Alert.alert('Success', PUBLISH_SURVEY_SUCCESS);
        } catch (error) {
          showFirebaseError(error);
        }
      }
      setLoading(false);
    }
  };

  const onPressPublish = () => {
    Alert.alert('Warning', PUBLISH_SURVEY, [
      { text: 'Cancel' },
      {
        text: 'OK',
        onPress: () => publishSurvey(),
      },
    ]);
  };

  const removePublished = async () => {
    await surveysRef.doc(surveyId).collection('published').doc(selectedSurvey.surveyCode).delete();
  };

  const removeSubmissions = async () => {
    const snapshot = await submissionsRef.where('surveyId', '==', surveyId).get();
    snapshot.forEach(async (doc) => {
      await doc.ref.delete();
    });
  };

  const removeSurvey = async () => {
    await surveysRef.doc(surveyId).delete();

    if (user.uid) {
      const index = surveys.findIndex((e) => e.id === surveyId);

      if (index !== -1) {
        const newSurveys = [...surveys];

        newSurveys.splice(index, 1);
        setSurveys(newSurveys);
        Alert.alert('Success', DELETE_SURVEY_SUCCESS, [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Surveys'),
          },
        ]);
      }
    }
  };

  const remove = async () => {
    try {
      setLoading(true);
      setRemoving(true);
      for (const f of [removePublished, removeSubmissions, removeSurvey])
        await f();
    } catch (error) {
      showFirebaseError(error);
      setLoading(false);
    }
  };

  const onPressRemove = () => {
    Alert.alert('Warning', DELETE_SURVEY, [
      { text: 'Cancel' },
      {
        text: 'OK',
        onPress: () => remove(),
      },
    ]);
  };

  const getNumAnswered = (scores) => {
    if (scores) {
      return scores.reduce(
        (numAnswered, currentScore) => numAnswered + (currentScore != null ? 1 : 0),
        0,
      );
    }
    return 0;
  };

  const SubmissionItem = ({ item, onPress }) => {
    const title = `Answered: ${getNumAnswered(item.scores)}/${item.scores.length}\n`
                  + `Submitted on ${item.insertDate.split(' ')[0]}`;

    return (
      <View>
        <List.Item
          title={title}
          titleNumberOfLines={2}
          left={() => <List.Icon icon="clipboard-check-outline" size={24} color={DEFAULT_COLOR} />}
          onPress={onPress}
        />
        <Divider />
      </View>
    );
  };

  const onPressSubmissionItem = (submissionId) => {
    const index = submissions.findIndex((e) => e.id === submissionId);

    if (index !== -1) {
      navigation.navigate('Submission', {
        surveyTitle: selectedSurvey.title,
        questions: selectedSurvey.questions,
        scores: submissions[index].scores,
      });
    }
  };

  const renderItem = ({ item }) => (
    <SubmissionItem item={item} onPress={() => onPressSubmissionItem(item.id)} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.topViewContainer}>
        <View style={styles.topView}>
          <Text style={styles.surveyCodeTitle}>Survey Code</Text>
          <Button
            style={styles.copyButtonStyle}
            mode="text"
            onPress={onPressCopy}
            disabled={loading}
          >
            {copiedText}
          </Button>
        </View>
        <Text style={styles.surveyCode}>{selectedSurvey.surveyCode}</Text>
        <View style={styles.btnContainer}>
          <Button
            icon="account-question"
            mode="contained"
            onPress={() => {
              navigation.navigate('ShowQuestions', {
                questions: selectedSurvey.questions,
                surveyTitle: selectedSurvey.title,
              });
            }}
            color={DEFAULT_COLOR}
            disabled={loading}
          >
            SHOW QUESTIONS
          </Button>
        </View>
        {!selectedSurvey.published && (
          <View style={styles.btnContainer}>
            <Button icon="publish" mode="contained" onPress={onPressPublish} disabled={loading}>
              PUBLISH
            </Button>
          </View>
        )}
        <View style={styles.btnContainer}>
          <Button
            icon="delete"
            mode="contained"
            onPress={onPressRemove}
            color={REMOVE_COLOR}
            disabled={loading}
          >
            REMOVE
          </Button>
        </View>
      </View>
      {submissions.length > 0 && !removing ? (
        <>
          <Text style={styles.surveyCodeTitle}>
            {setMessageByCount('Submission', submissions.length)}
          </Text>
          <FlatList
            scrollEnabled
            scrollEventThrottle={16}
            data={submissions}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </>
      ) : null}
      <LoadingModal visible={loading} />
    </View>
  );
};

SurveyDetail.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      surveyId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  topViewContainer: {
    margin: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: DEFAULT_BORDER_COLOR,
    padding: 10,
  },
  surveyCodeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  surveyCode: {
    fontSize: 16,
    color: DEFAULT_GRAY,
  },
  copyButtonStyle: {
    height: 30,
    alignSelf: 'center',
  },
  btnContainer: {
    marginVertical: 10,
    height: 30,
  },
});

export default SurveyDetail;
