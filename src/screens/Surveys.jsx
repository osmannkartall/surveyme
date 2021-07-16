import React, { useState, useContext, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, Pressable, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { Avatar, Divider, List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { surveysRef } from '../configs/firebase';
import {
  APPROVE_COLOR,
  BLACK,
  DEFAULT_COLOR,
  DEFAULT_GRAY,
  REMOVE_COLOR,
  WHITE,
} from '../constants/styles';
import { UserContext } from '../context/UserContext';
import LoadingModal from '../common/LoadingModal';
import { SurveysContext } from '../context/SurveysContext';
import { MULTI_PUBLISHED_COLLECTION, NO_PUBLISHED_COLLECTION } from '../constants/alerts';
import sortBy from '../utils/sortBy';
import setMessageByCount from '../utils/setMessageByCount';
import showFirebaseError from '../utils/showFirebaseError';

const Surveys = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [user] = useContext(UserContext);
  const [surveys, setSurveys] = useContext(SurveysContext);

  const onPressFAB = () => navigation.navigate('SurveyCreator');

  const getSurveys = async () => {
    try {
      const surveysData = [];
      // Get records from surveys collection.
      const surveysSnapshot = await surveysRef.where('ownerId', '==', user.uid).get();

      setLoading(true);
      await Promise.all(surveysSnapshot.docs.map(async (surveyDoc) => {
        // Get survey data that is public after the survey is published.
        const publishedSnapshot = await surveysRef.doc(surveyDoc.id).collection('published').get();

        // Each published sub-collection has only one document. This check is for safety.
        if (publishedSnapshot.size === 1) {
          surveysData.push({
            id: surveyDoc.id,
            ...surveyDoc.data(),
            surveyCode: publishedSnapshot.docs[0].id,
            ...publishedSnapshot.docs[0].data(),
          });
        } else if (publishedSnapshot.size > 1) {
          Alert.alert('Error', MULTI_PUBLISHED_COLLECTION);
        } else {
          Alert.alert('Error', NO_PUBLISHED_COLLECTION);
        }
      }));
      sortBy(surveysData, 'insertDate');
      setSurveys(surveysData);
    } catch (error) {
      showFirebaseError(error);
    } finally {
      setLoading(false);
    }
  };

  // Update navigation title after removing or adding a survey.
  useEffect(() => {
    let mounted = true;

    if (mounted) {
      navigation.setOptions({
        headerTitle: (
          <View>
            <Text style={styles.topTitle}>SurveyMe</Text>
            <Text style={styles.bottomTitle}>{setMessageByCount('Survey', surveys.length)}</Text>
          </View>
        ),
      });
    }

    return function cleanup() {
      mounted = false;
    };
  }, [surveys.length]);

  // Get all surveys belonging to the authenticated user.
  useEffect(() => {
    let mounted = true;

    (async () => {
      if (mounted && user.uid)
        await getSurveys();
    })();

    return function cleanup() {
      mounted = false;
    };
  }, []);

  const SurveyItem = ({ item, onPress }) => (
    <View>
      <List.Item
        title={item.title}
        titleNumberOfLines={3}
        description={item.published ? 'Published' : 'Private'}
        descriptionStyle={[
          styles.descriptionStyle,
          { color: item.published ? APPROVE_COLOR : REMOVE_COLOR },
        ]}
        left={() => <Avatar.Icon style={styles.surveyItemLeftAvatarIcon} size={45} icon="clipboard-list" />}
        right={() => (
          <Text style={styles.surveyItemRightText}>{item.insertDate.split(' ')[0]}</Text>
        )}
        onPress={onPress}
      />
      <Divider inset />
    </View>
  );

  const renderSurveyItem = ({ item }) => (
    <SurveyItem
      item={item}
      onPress={() => navigation.navigate('SurveyDetail', { surveyId: item.id })}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        scrollEnabled
        scrollEventThrottle={16}
        data={surveys}
        renderItem={renderSurveyItem}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.FABContainer}>
        <Pressable style={styles.FAB} onPress={onPressFAB}>
          <Icon name="pencil-plus" size={24} color={WHITE} />
        </Pressable>
      </View>
      <LoadingModal visible={loading} />
    </View>
  );
};

Surveys.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  FABContainer: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignSelf: 'flex-end',
    justifyContent: 'space-between',
  },
  FAB: {
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    backgroundColor: DEFAULT_COLOR,
    shadowColor: BLACK,
    // IOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    // ANDROID
    elevation: 4,
    alignItems: 'center',
  },
  descriptionStyle: {
    fontWeight: 'bold',
  },
  surveyItemRightText: {
    marginLeft: 5,
    fontSize: 12,
    color: DEFAULT_GRAY,
  },
  surveyItemLeftAvatarIcon: {
    alignSelf: 'center',
  },
  topTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: WHITE,
  },
  bottomTitle: {
    color: WHITE,
  },
});

export default Surveys;
