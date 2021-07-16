import React, { useContext } from 'react';
import { Alert, View, FlatList, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { REMOVE_COLOR, EDIT_COLOR, DEFAULT_PADDING } from '../../constants/styles';
import Question from '../../common/Question';
import { NewSurveyContext } from '../../context/NewSurveyContext';

const SurveyQuestions = ({ uncollapseWithCheck, setValue, questionRef }) => {
  const [newSurvey, setNewSurvey] = useContext(NewSurveyContext);

  const removeQuestion = (id) => {
    const removedQuestionIdx = newSurvey.questions.findIndex((q) => q.id === id);

    if (removedQuestionIdx !== -1) {
      Alert.alert('Remove Question', `\n${newSurvey.questions[removedQuestionIdx].content}`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            const newQuestions = [...newSurvey.questions];
            newQuestions.splice(removedQuestionIdx, 1);
            setNewSurvey((prevState) => ({ ...prevState, questions: newQuestions }));
          },
        },
      ]);
    }
  };

  const fillQuestionEditor = (id) => {
    const newQuestions = [...newSurvey.questions];
    const selectedQuestion = newQuestions.find((q) => q.id === id);

    if (selectedQuestion !== undefined) {
      setValue('question', selectedQuestion.content);
      setNewSurvey((prevState) => ({
        ...prevState,
        question: selectedQuestion.content,
        editedQuestionId: id,
      }));
      questionRef.current.focus();
    }
  };

  const prepareForEditing = (id) => {
    uncollapseWithCheck();
    fillQuestionEditor(id);
  };

  const renderItem = ({ item, index }) => (
    <Question
      key={item.id}
      number={index + 1}
      content={item.content}
      isEditing={newSurvey.editedQuestionId === item.id}
    >
      <View style={styles.btnGroupContainer}>
        <Button
          icon="pen"
          mode="outlined"
          color={EDIT_COLOR}
          style={styles.btnSpaceBetween}
          onPress={() => prepareForEditing(item.id)}
          disabled={newSurvey.editedQuestionId === item.id}
        >
          EDIT
        </Button>
        <Button
          icon="delete"
          mode="outlined"
          color={REMOVE_COLOR}
          onPress={() => removeQuestion(item.id)}
          disabled={newSurvey.editedQuestionId === item.id}
        >
          REMOVE
        </Button>
      </View>
    </Question>
  );

  return (
    <FlatList
      scrollEnabled
      scrollEventThrottle={16}
      data={newSurvey.questions}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

const styles = StyleSheet.create({
  btnGroupContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    paddingHorizontal: DEFAULT_PADDING,
    marginVertical: 10,
  },
  btnSpaceBetween: {
    marginRight: 20,
  },
});

export default SurveyQuestions;
