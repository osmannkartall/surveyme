import React, { useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { DEFAULT_PADDING } from '../constants/styles';
import { AnonymousUserContext } from '../context/AnonymousUserContext';

const Initial = () => {
  const mainTitle = 'SurveyMe';
  const subtitle = 'Participate in any survey anonymously or create surveys for yourself.';
  const [, setAnonymousUser] = useContext(AnonymousUserContext);

  const onPressCreate = () => setAnonymousUser(false);

  const onPressParticipate = () => setAnonymousUser(true);

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>{mainTitle}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={styles.btnContainer}>
          <Button mode="contained" onPress={onPressCreate}>CREATE</Button>
        </View>
        <View style={styles.btnContainer}>
          <Button mode="contained" onPress={onPressParticipate}>PARTICIPATE</Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: DEFAULT_PADDING,
  },
  topContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleContainer: {
    marginBottom: 40,
  },
  btnContainer: {
    alignSelf: 'center',
    width: '35%',
    marginTop: 30,
  },
  mainTitle: {
    fontSize: 60,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Initial;
