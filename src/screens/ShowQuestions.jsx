import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DEFAULT_COLOR } from '../constants/styles';
import Question from '../common/Question';
import setMessageByCount from '../utils/setMessageByCount';

const ShowQuestions = ({ route }) => {
  const { questions, surveyTitle } = route.params;
  const infoTitle = setMessageByCount('Question', questions.length);

  const renderItem = ({ item, index }) => (
    <Question key={item.id} number={index + 1} content={item.content} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Icon name="clipboard-check-outline" size={60} color={DEFAULT_COLOR} />
        <Text style={styles.surveyTitle}>{surveyTitle}</Text>
        <Text style={styles.infoTitle}>{infoTitle}</Text>
      </View>
      <FlatList
        scrollEnabled
        scrollEventThrottle={16}
        data={questions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

ShowQuestions.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      questions: PropTypes.arrayOf(PropTypes.object).isRequired,
      surveyTitle: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    flex: 1,
  },
  surveyTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoContainer: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  infoTitle: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
  },
});

export default ShowQuestions;
