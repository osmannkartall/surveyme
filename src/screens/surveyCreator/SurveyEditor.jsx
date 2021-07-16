import React, { useRef, useContext, useEffect } from 'react';
import { Text, View, StyleSheet, Alert, Keyboard } from 'react-native';
import { Controller } from 'react-hook-form';
import { TextInput, HelperText, Button, RadioButton } from 'react-native-paper';
import { REMOVE_COLOR, DEFAULT_COLOR } from '../../constants/styles';
import { NewSurveyContext } from '../../context/NewSurveyContext';
import { TOO_MANY_QUESTIONS } from '../../constants/alerts';
import { SURVEY_TITLE_MAX_LEN, SURVEY_TITLE_MIN_LEN } from '../../constants/validations';

/**
 * There is no "update survey" feature in the app.
 * If you decided to add it, use getGreatestId function in utils folder.
 * to get the greatest id value in previously created questions array.
 * Increase idCounter from that value when updating or simply use uuid generator to get unique ids.
 */
let idCounter = 0;

const SurveyEditor = ({
  control,
  errors,
  setQuestionRef,
  getValues,
  setValue,
  navigation,
}) => {
  const [newSurvey, setNewSurvey] = useContext(NewSurveyContext);
  const surveyTitleRef = useRef();
  const isUpdating = newSurvey.editedQuestionId !== null;

  useEffect(
    () => navigation.addListener('beforeRemove', (e) => {
      // Don't leave the screen.
      e.preventDefault();
      const tempQuestion = getValues('question');
      const tempSurveyTitle = getValues('surveyTitle');

      setNewSurvey((prevState) => ({
        ...prevState,
        question: tempQuestion,
        title: tempSurveyTitle,
      }));
      navigation.dispatch(e.data.action);
    }),
    [navigation],
  );

  const addQuestion = () => {
    const tempQuestion = getValues('question').replace(/\n+/g, '').trim();

    if (tempQuestion) {
      if (newSurvey.questions.length === 10) {
        Alert.alert('Warning', TOO_MANY_QUESTIONS);
      } else {
        const newQuestions = [
          ...newSurvey.questions,
          {
            id: idCounter,
            content: tempQuestion,
          },
        ];

        idCounter += 1;
        setNewSurvey((prevState) => ({ ...prevState, questions: newQuestions, question: '' }));
        setValue('question', '');
        Keyboard.dismiss();
      }
    }
  };

  const updateQuestion = () => {
    const tempQuestion = getValues('question').replace(/\n+/g, '').trim();

    if (tempQuestion && newSurvey.question !== tempQuestion) {
      const newQuestions = [...newSurvey.questions];
      const index = newQuestions.findIndex((q) => q.id === newSurvey.editedQuestionId);

      if (index !== -1) {
        const updatedQuestion = { ...newQuestions[index] };

        updatedQuestion.content = tempQuestion;
        newQuestions[index] = updatedQuestion;
        setValue('question', '');
        setNewSurvey((prevState) => ({
          ...prevState,
          questions: newQuestions,
          question: '',
          editedQuestionId: null,
        }));
      }
      Keyboard.dismiss();
    }
  };

  const cancelAddOrUpdate = () => {
    if (getValues('question') !== '')
      setValue('question', '');
    if (newSurvey.question !== '' || newSurvey.editedQuestionId !== null)
      setNewSurvey((prevState) => ({ ...prevState, question: '', editedQuestionId: null }));
    Keyboard.dismiss();
  };

  const clear = () => {
    setValue('question', '');
    setNewSurvey((prevState) => ({ ...prevState, question: '' }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.radioBtnOuterContainer}>
        <View style={styles.radioBtnContainer}>
          <RadioButton
            value
            status={newSurvey.visibility === 'published' ? 'checked' : 'unchecked'}
            onPress={() => setNewSurvey((prevState) => ({ ...prevState, visibility: 'published' }))}
            color={DEFAULT_COLOR}
          />
          <Text>Published</Text>
        </View>
        <View style={styles.radioBtnContainer}>
          <RadioButton
            value={false}
            status={newSurvey.visibility === 'private' ? 'checked' : 'unchecked'}
            onPress={() => setNewSurvey((prevState) => ({ ...prevState, visibility: 'private' }))}
            color={DEFAULT_COLOR}
          />
          <Text>Private</Text>
        </View>
      </View>
      <Controller
        name="surveyTitle"
        control={control}
        rules={{
          required: 'Survey Title is required!',
          minLength: {
            message: `Survey title must contain at least ${SURVEY_TITLE_MIN_LEN} characters.`,
            value: SURVEY_TITLE_MIN_LEN,
          },
          maxLength: {
            message: `Survey title cannot have more than ${SURVEY_TITLE_MAX_LEN} characters.`,
            value: SURVEY_TITLE_MAX_LEN,
          },
        }}
        defaultValue={newSurvey.title}
        onFocus={() => surveyTitleRef.current.focus()}
        render={({ onChange, onBlur, value }) => (
          <>
            <TextInput
              label="Survey Title"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={(surveyTitleValue) => onChange(surveyTitleValue)}
              value={value}
              ref={surveyTitleRef}
            />
            <HelperText type="error">{errors.surveyTitle?.message}</HelperText>
          </>
        )}
      />
      <Text style={styles.infoTitle}>Question Editor</Text>
      <Controller
        name="question"
        control={control}
        defaultValue={newSurvey.question}
        render={({ value, onChange }) => (
          <>
            <TextInput
              mode="outlined"
              value={value}
              onChangeText={(questionValue) => onChange(questionValue)}
              multiline
              numberOfLines={4}
              minHeight={120}
              maxHeight={120}
              ref={(e) => setQuestionRef(e)}
              right={
                value ? <TextInput.Icon name="close" color={REMOVE_COLOR} onPress={clear} /> : null
              }
              maxLength={250}
            />
          </>
        )}
      />
      <View style={styles.btnGroupContainer}>
        {!isUpdating && (
          <View style={styles.btnContainer}>
            <Button mode="contained" onPress={addQuestion}>
              ADD
            </Button>
          </View>
        )}
        {isUpdating && (
          <View style={styles.btnContainer}>
            <Button mode="contained" onPress={updateQuestion}>
              UPDATE
            </Button>
          </View>
        )}
        <View style={styles.btnContainer}>
          <Button mode="contained" onPress={cancelAddOrUpdate} color={REMOVE_COLOR}>
            <Text>CANCEL</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  btnGroupContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  btnContainer: {
    width: '49%',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  radioBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
  },
  radioBtnOuterContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
});

export default SurveyEditor;
