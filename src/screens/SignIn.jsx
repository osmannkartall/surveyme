import React, { useContext, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { Button, TextInput, HelperText } from 'react-native-paper';
import { View, Text, StyleSheet, Alert, Pressable, Keyboard } from 'react-native';
import { DEFAULT_PADDING, DEFAULT_COLOR, BLACK } from '../constants/styles';
import { UserContext } from '../context/UserContext';
import { AnonymousUserContext } from '../context/AnonymousUserContext';
import { auth, usersRef } from '../configs/firebase';
import HeaderGroup from '../common/HeaderGroup';
import LoadingModal from '../common/LoadingModal';
import { NO_USER } from '../constants/alerts';
import { EMAIL_FORMAT, PASSWORD_MAX_LEN, PASSWORD_MIN_LEN } from '../constants/validations';
import storeAsyncData from '../utils/storeAsyncData';
import getAsyncDataString from '../utils/getAsyncDataString';
import showFirebaseError from '../utils/showFirebaseError';

const SignIn = ({ navigation }) => {
  const participatingTitle = ' participate in a survey anonymously';
  const [loading, setLoading] = useState(false);
  const [, setUser] = useContext(UserContext);
  const [, setAnonymousUser] = useContext(AnonymousUserContext);
  const emailRef = useRef();
  const passwordRef = useRef();
  const { control, handleSubmit, errors, setValue } = useForm();

  useEffect(() => {
    let mounted = true;

    (async () => {
      const email = await getAsyncDataString('email');
      if (mounted && email)
        setValue('email', email);
    })();

    return function cleanup() {
      mounted = false;
    };
  }, []);

  // Takes a whole form as an argument when it is valid.
  const onSubmit = async (form) => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      const credential = await auth.signInWithEmailAndPassword(form.email, form.password);
      const doc = await usersRef.doc(credential.user.uid).get();

      if (!doc.exists) {
        Alert.alert('Error', NO_USER);
        setLoading(false);
      } else {
        const userData = {
          email: doc.data().email,
          username: doc.data().username,
          uid: credential.user.uid,
          isLoggedIn: true,
        };

        storeAsyncData('email', userData.email);
        setUser(userData);
      }
    } catch (error) {
      showFirebaseError(error);
      setLoading(false);
    }
  };

  const onPressParticipateSurvey = () => setAnonymousUser(true);

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <HeaderGroup title="Sign In">
          <View style={styles.participateSurveyBtnContainer}>
            <Text style={[styles.topSubtitle, { color: BLACK }]}>or</Text>
            <Pressable onPress={onPressParticipateSurvey}>
              <Text style={styles.topSubtitle}>{participatingTitle}</Text>
            </Pressable>
          </View>
        </HeaderGroup>
        <Controller
          name="email"
          control={control}
          rules={{
            required: 'Email is required!',
            pattern: { message: 'Invalid email format', value: EMAIL_FORMAT },
          }}
          defaultValue=""
          onFocus={() => emailRef.current.focus()}
          render={({ onChange, onBlur, value }) => (
            <>
              <TextInput
                label="Email"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={(emailValue) => onChange(emailValue)}
                value={value}
                ref={emailRef}
                keyboardType="email-address"
              />
              <HelperText type="error">{errors.email?.message}</HelperText>
            </>
          )}
        />
        <Controller
          name="password"
          control={control}
          rules={{
            required: 'Password is required!',
            minLength: {
              message: `Passwords have at least ${PASSWORD_MIN_LEN} characters.`,
              value: PASSWORD_MIN_LEN,
            },
            maxLength: {
              message: `Password cannot have more than ${PASSWORD_MAX_LEN} characters.`,
              value: PASSWORD_MAX_LEN,
            },
          }}
          defaultValue=""
          onFocus={() => passwordRef.current.focus()}
          render={({ onChange, onBlur, value }) => (
            <>
              <TextInput
                label="Password"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={(passwordValue) => onChange(passwordValue)}
                value={value}
                ref={passwordRef}
                secureTextEntry
              />
              <HelperText type="error">{errors.password?.message}</HelperText>
            </>
          )}
        />
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.btnGroupContainer}>
          <Button mode="text" onPress={() => navigation.navigate('SignUp')} disabled={loading}>
            CREATE ACCOUNT
          </Button>
          <Button mode="contained" onPress={handleSubmit(onSubmit)} disabled={loading}>
            SIGN IN
          </Button>
        </View>
      </View>
      <LoadingModal visible={loading} />
    </View>
  );
};

SignIn.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: DEFAULT_PADDING,
    justifyContent: 'center',
  },
  topContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  bottomContainer: {
    height: 60,
  },
  btnGroupContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topSubtitle: {
    color: DEFAULT_COLOR,
    fontSize: 16,
    marginBottom: 10,
  },
  participateSurveyBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SignIn;
