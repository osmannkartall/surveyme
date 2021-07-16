import React, { useState, useContext, useRef } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import Collapsible from 'react-native-collapsible';
import { sha1 } from 'object-hash';
import { Divider } from 'react-native-paper';
import PropTypes from 'prop-types';
import { DEFAULT_PADDING } from '../../constants/styles';
import { UserContext } from '../../context/UserContext';
import SubmitButton from '../../common/SubmitButton';
import SurveyEditor from './SurveyEditor';
import SurveyQuestions from './SurveyQuestions';
import SurveyQuestionsHeader from './SurveyQuestionsHeader';
import LoadingModal from '../../common/LoadingModal';
import { surveysRef } from '../../configs/firebase';
import { SurveysContext } from '../../context/SurveysContext';
import { NewSurveyContext } from '../../context/NewSurveyContext';
import {
  ADD_SURVEY_SUCCESS,
  ADD_SURVEY,
  INCOMPLETE_QUESTION,
  NO_QUESTION,
} from '../../constants/alerts';
import getCurrentDateTime from '../../utils/getCurrentDateTime';
import showFirebaseError from '../../utils/showFirebaseError';

const SurveyCreator = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [collapsedIcon, setCollapsedIcon] = useState('arrow-up');
  const [user] = useContext(UserContext);
  const [surveys, setSurveys] = useContext(SurveysContext);
  const [newSurvey, setNewSurvey] = useContext(NewSurveyContext);
  const questionRef = useRef(null);
  const { control, handleSubmit, errors, setValue, getValues } = useForm();

  const addSurvey = async (surveyTitle) => {
    try {
      setLoading(true);
      if (user.uid) {
        const data = { title: surveyTitle, questions: newSurvey.questions };
        const privateData = {
          ownerId: user.uid,
          insertDate: getCurrentDateTime(),
          published: newSurvey.visibility === 'published',
        };
        const { id } = await surveysRef.add(privateData);
        const surveyCode = `${user.username}:${id}:${sha1({ ...data, ...privateData })}`;
        const newSurveys = [{ id, surveyCode, ...data, ...privateData }, ...surveys];

        await surveysRef.doc(id).collection('published').doc(surveyCode).set(data);
        setSurveys(newSurveys);
        setNewSurvey({
          questions: [],
          visibility: 'private',
          title: '',
          question: '',
          editedQuestionId: null,
        });
        setValue('surveyTitle', '');
        setValue('question', '');
        Alert.alert('Success', ADD_SURVEY_SUCCESS, [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Surveys'),
          },
        ]);
      }
    } catch (error) {
      showFirebaseError(error);
    } finally {
      setLoading(false);
    }
  };

  const uncollapseWithCheck = () => {
    if (collapsed) {
      setCollapsed(false);
      setCollapsedIcon('arrow-up');
    }
  };

  const onSubmit = (form) => {
    if (newSurvey.questions.length < 1) {
      Alert.alert('Error', NO_QUESTION, [
        {
          text: 'OK',
          onPress: () => {
            uncollapseWithCheck();
            questionRef.current.focus();
          },
        },
      ]);
    } else if (form.question.replace(/\n+/g, '').trim() !== '') {
      Alert.alert('Warning', INCOMPLETE_QUESTION, [
        {
          text: 'Cancel',
          onPress: () => {
            uncollapseWithCheck();
            questionRef.current.focus();
          },
        },
        {
          text: 'OK',
          onPress: () => addSurvey(form.surveyTitle),
        },
      ]);
    } else {
      Alert.alert('Warning', ADD_SURVEY, [
        { text: 'Cancel' },
        {
          text: 'OK',
          onPress: () => addSurvey(form.surveyTitle),
        },
      ]);
    }
  };

  const onError = () => uncollapseWithCheck();

  const setQuestionRef = (e) => {
    questionRef.current = e;
  };

  const toggleCollapsing = () => {
    setCollapsed(!collapsed);
    if (collapsedIcon === 'arrow-down')
      setCollapsedIcon('arrow-up');
    else
      setCollapsedIcon('arrow-down');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Collapsible collapsed={collapsed}>
          <SurveyEditor
            control={control}
            errors={errors}
            setQuestionRef={setQuestionRef}
            getValues={getValues}
            setValue={setValue}
            navigation={navigation}
          />
        </Collapsible>
        <SurveyQuestionsHeader
          collapsedIcon={collapsedIcon}
          onPressCollapseButton={toggleCollapsing}
        />
        <SurveyQuestions
          uncollapseWithCheck={uncollapseWithCheck}
          setValue={setValue}
          questionRef={questionRef}
        />
      </View>
      <Divider />
      <SubmitButton title="SUBMIT" onPress={handleSubmit(onSubmit, onError)} disabled={loading} />
      <LoadingModal visible={loading} />
    </View>
  );
};

SurveyCreator.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  topContainer: {
    paddingHorizontal: DEFAULT_PADDING,
    flex: 1,
  },
});

export default SurveyCreator;
