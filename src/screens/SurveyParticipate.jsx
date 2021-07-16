import React, { useContext, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { View, Text, StyleSheet, Alert, Keyboard } from 'react-native';
import { Button, TextInput, HelperText } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LoadingModal from '../common/LoadingModal';
import { surveysRef } from '../configs/firebase';
import { DEFAULT_COLOR, DEFAULT_PADDING } from '../constants/styles';
import { AnonymousUserContext } from '../context/AnonymousUserContext';
import { UserContext } from '../context/UserContext';
import {
  INVALID_CODE,
  NOT_PUBLISHED,
  NO_SURVEY,
  OWNED_SURVEY,
  PARTICIPATED,
} from '../constants/alerts';
import { SURVEY_CODE_FORMAT } from '../constants/validations';
import getAsyncData from '../utils/getAsyncData';
import showFirebaseError from '../utils/showFirebaseError';

const SurveyParticipate = ({ navigation }) => {
  const title = 'Enter a Survey Code';
  const [loading, setLoading] = useState(false);
  const [, setAnonymousUser] = useContext(AnonymousUserContext);
  const [user] = useContext(UserContext);
  const surveyCodeRef = useRef();
  const { control, handleSubmit, errors } = useForm();

  const getPublishedData = async (surveyId, surveyCode) => {
    try {
      const doc = await surveysRef.doc(surveyId).collection('published').doc(surveyCode).get();

      if (doc.exists) {
        setLoading(false);
        navigation.navigate('SurveyFiller', {
          questions: doc.data().questions,
          surveyTitle: doc.data().title,
          surveyId,
          surveyCode,
        });
      } else {
        throw new Error(INVALID_CODE);
      }
    } catch (error) {
      if (error.name === 'FirebaseError') {
        if (error.code === 'permission-denied')
          Alert.alert('Error', NOT_PUBLISHED);
        else
          showFirebaseError(error);
      } else {
        Alert.alert('Error', error.message);
      }
      setLoading(false);
    }
  };

  const participateLoggedIn = async (surveyId, surveyCode) => {
    try {
      const doc = await surveysRef.doc(surveyId).get();

      if (doc.exists && doc.data().ownerId === user.uid)
        throw new Error(OWNED_SURVEY);
      else
        throw new Error(NO_SURVEY);
    } catch (error) {
      if (error.name === 'FirebaseError') {
        if (error.code === 'permission-denied') {
          // The logged in user is not the owner of the survey and wants to participate in it.
          await getPublishedData(surveyId, surveyCode);
        } else {
          showFirebaseError(error);
        }
      } else {
        Alert.alert('Error', error.message);
      }
      setLoading(false);
    }
  };

  const participateAnonymous = async (surveyId, surveyCode) => {
    await getPublishedData(surveyId, surveyCode);
  };

  const onPressParticipate = async (form) => {
    try {
      const surveyCodes = await getAsyncData('surveyCodes');
      const { surveyCode } = form;
      const surveyId = form.surveyCode.split(':')[1];

      Keyboard.dismiss();
      setLoading(true);
      if (surveyCodes && surveyCodes.includes(surveyCode))
        throw new Error(PARTICIPATED);

      if (user.isLoggedIn)
        participateLoggedIn(surveyId, surveyCode);
      else
        participateAnonymous(surveyId, surveyCode);
    } catch (error) {
      if (error.name === 'FirebaseError')
        showFirebaseError(error);
      else
        Alert.alert('Error', error.message);
      setLoading(false);
    }
  };

  const onPressCreateSurvey = () => {
    if (user.isLoggedIn)
      navigation.navigate('SurveyCreator');
    else
      setAnonymousUser(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Icon style={styles.icon} name="clipboard-list-outline" size={80} color={DEFAULT_COLOR} />
        <Text style={styles.title}>{title}</Text>
        <Controller
          name="surveyCode"
          control={control}
          rules={{
            required: 'Survey Code is required!',
            pattern: { message: 'Invalid survey code format', value: SURVEY_CODE_FORMAT },
          }}
          defaultValue=""
          onFocus={() => surveyCodeRef.current.focus()}
          render={({ onChange, onBlur, value }) => (
            <>
              <TextInput
                label="Survey Code"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={(surveyCodeValue) => onChange(surveyCodeValue)}
                value={value}
                ref={surveyCodeRef}
              />
              <HelperText type="error">{errors.surveyCode?.message}</HelperText>
            </>
          )}
        />
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.btnGroupContainer}>
          <Button mode="text" onPress={onPressCreateSurvey} disabled={loading}>
            CREATE A SURVEY
          </Button>
          <Button mode="contained" onPress={handleSubmit(onPressParticipate)} disabled={loading}>
            PARTICIPATE
          </Button>
        </View>
      </View>
      <LoadingModal visible={loading} />
    </View>
  );
};

SurveyParticipate.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: DEFAULT_PADDING,
  },
  topContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 15,
  },
  btnGroupContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomContainer: {
    height: 60,
  },
  icon: {
    alignSelf: 'center',
  },
});

export default SurveyParticipate;
