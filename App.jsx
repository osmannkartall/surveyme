import React, { useContext } from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DefaultTheme as PaperDefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SurveyFiller from './src/screens/SurveyFiller';
import SurveyParticipate from './src/screens/SurveyParticipate';
import Surveys from './src/screens/Surveys';
import SurveyDetail from './src/screens/SurveyDetail';
import Submission from './src/screens/Submission';
import SurveyCreator from './src/screens/surveyCreator/SurveyCreator';
import { UserContext, UserProvider } from './src/context/UserContext';
import SignIn from './src/screens/SignIn';
import SignUp from './src/screens/SignUp';
import Loading from './src/screens/Loading';
import Initial from './src/screens/Initial';
import { AnonymousUserContext, AnonymousUserProvider } from './src/context/AnonymousUserContext';
import { DEFAULT_COLOR, WHITE } from './src/constants/styles';
import ActionMenu from './src/common/ActionMenu';
import ShowQuestions from './src/screens/ShowQuestions';
import { SurveysProvider } from './src/context/SurveysContext';
import { NewSurveyProvider } from './src/context/NewSurveyContext';

LogBox.ignoreLogs([
  'Setting a timer for a long period of time, i.e. multiple minutes, is a performance and correctness issue on Android as it keeps the timer module awake',
]);

const appTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
  },
};

const paperTheme = {
  ...PaperDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    primary: DEFAULT_COLOR,
  },
};

const screenOptions = {
  animationEnabled: false,
  headerStyle: {
    backgroundColor: DEFAULT_COLOR,
  },
  headerTintColor: WHITE,
  headerTitleStyle: {
    color: WHITE,
  },
};

const Menu = () => <ActionMenu />;

// Screens for anonymous users
const AnonymousStackScreens = () => {
  const AnonymousStack = createStackNavigator();

  return (
    <AnonymousStack.Navigator screenOptions={screenOptions}>
      <AnonymousStack.Screen
        name="SurveyParticipate"
        component={SurveyParticipate}
        options={{ headerShown: false }}
      />
      <AnonymousStack.Screen
        name="SurveyFiller"
        component={SurveyFiller}
        options={{ title: 'Complete the Survey' }}
      />
    </AnonymousStack.Navigator>
  );
};

// Screens for authenticated users
const MainStackScreens = (isLoggedIn) => {
  const MainStack = createStackNavigator();
  let surveyParticipateOptions;

  if (isLoggedIn)
    surveyParticipateOptions = { title: 'Participate in a Survey' };
  else
    surveyParticipateOptions = { title: null, headerLeft: null };

  return (
    <SurveysProvider>
      <NewSurveyProvider>
        <MainStack.Navigator screenOptions={screenOptions}>
          <MainStack.Screen
            name="Surveys"
            component={Surveys}
            options={{
              title: 'Your Surveys',
              headerLeft: null,
              headerRight: Menu,
            }}
          />
          <MainStack.Screen
            name="SurveyParticipate"
            component={SurveyParticipate}
            options={surveyParticipateOptions}
          />
          <MainStack.Screen
            name="SurveyCreator"
            component={SurveyCreator}
            options={{ title: 'Create a Survey' }}
          />
          <MainStack.Screen
            name="SurveyFiller"
            component={SurveyFiller}
            options={{ title: 'Complete the Survey' }}
          />
          <MainStack.Screen name="SurveyDetail" component={SurveyDetail} options={{ title: '' }} />
          <MainStack.Screen
            name="Submission"
            component={Submission}
            options={{ title: 'Submitted Scores' }}
          />
          <MainStack.Screen
            name="ShowQuestions"
            component={ShowQuestions}
            options={{ title: 'Questions' }}
          />
        </MainStack.Navigator>
      </NewSurveyProvider>
    </SurveysProvider>
  );
};

// Screens for sign-in or sign-up
const AuthStackScreens = () => {
  const AuthStack = createStackNavigator();

  return (
    <AuthStack.Navigator headerMode="none" screenOptions={screenOptions}>
      <AuthStack.Screen name="SignIn" component={SignIn} />
      <AuthStack.Screen name="SignUp" component={SignUp} />
    </AuthStack.Navigator>
  );
};

const AppStackScreens = () => {
  const AppStack = createStackNavigator();
  const [user] = useContext(UserContext);
  const [anonymousUser] = useContext(AnonymousUserContext);
  let currentComponent;

  if (user.isLoggedIn == null && anonymousUser == null) {
    currentComponent = <AppStack.Screen name="Loading" component={Loading} />;
  } else if (!user.isLoggedIn && anonymousUser == null) {
    currentComponent = <AppStack.Screen name="Initial" component={Initial} />;
  } else if (!user.isLoggedIn && !anonymousUser) {
    currentComponent = <AppStack.Screen name="Auth" component={AuthStackScreens} />;
  } else if (!user.isLoggedIn && anonymousUser) {
    currentComponent = <AppStack.Screen name="Anonymous" component={AnonymousStackScreens} />;
  } else if (user.isLoggedIn) {
    currentComponent = (
      <AppStack.Screen name="Main" component={MainStackScreens} isLoggedIn={user.isLoggedIn} />
    );
  }

  return (
    <SafeAreaProvider>
      <AppStack.Navigator headerMode="none" screenOptions={screenOptions}>
        {currentComponent}
      </AppStack.Navigator>
    </SafeAreaProvider>
  );
};

export default function App() {
  return (
    <PaperProvider theme={paperTheme}>
      <UserProvider>
        <AnonymousUserProvider>
          <NavigationContainer theme={appTheme}>
            <AppStackScreens />
          </NavigationContainer>
        </AnonymousUserProvider>
      </UserProvider>
    </PaperProvider>
  );
}
