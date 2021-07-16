import React, { useContext, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { View, Text, StyleSheet, Pressable, Keyboard } from 'react-native';
import { Button, TextInput, HelperText } from 'react-native-paper';
import { DEFAULT_PADDING, DEFAULT_COLOR } from '../constants/styles';
import { UserContext } from '../context/UserContext';
import { auth, usersRef } from '../configs/firebase';
import HeaderGroup from '../common/HeaderGroup';
import LoadingModal from '../common/LoadingModal';
import {
  EMAIL_FORMAT,
  PASSWORD_MAX_LEN,
  PASSWORD_MIN_LEN,
  USERNAME_FORMAT,
  USERNAME_MAX_LEN,
  USERNAME_MIN_LEN,
} from '../constants/validations';
import storeAsyncData from '../utils/storeAsyncData';
import showFirebaseError from '../utils/showFirebaseError';

const SignUp = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [, setUser, avoidLogin] = useContext(UserContext);
  const emailRef = useRef();
  const passwordRef = useRef();
  const usernameRef = useRef();
  const { control, handleSubmit, errors } = useForm();

  const onSubmit = async (form) => {
    try {
      Keyboard.dismiss();
      setLoading(true);
      const credential = await auth.createUserWithEmailAndPassword(form.email, form.password);

      usersRef.doc(credential.user.uid).set({
        username: form.username,
        email: form.email,
      });
      storeAsyncData('email', form.email);
      setUser({
        username: form.username,
        email: form.email,
        uid: credential.user.uid,
        isLoggedIn: true,
      });
    } catch (error) {
      showFirebaseError(error);
      avoidLogin();
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <HeaderGroup title="Sign Up">
          <View style={styles.signInBtnContainer}>
            <Text style={styles.accountTitle}>Already have an account?</Text>
            <Pressable style={styles.buttonSignIn} onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.signInBtnTitle}> Sign In</Text>
            </Pressable>
          </View>
        </HeaderGroup>
        <Controller
          name="username"
          control={control}
          rules={{
            required: 'Username is required!',
            minLength: {
              message: `Usernames have at least ${USERNAME_MIN_LEN} characters.`,
              value: USERNAME_MIN_LEN,
            },
            maxLength: {
              message: `Usernames cannot have more than ${USERNAME_MAX_LEN} characters.`,
              value: USERNAME_MAX_LEN,
            },
            pattern: {
              message: 'Only numbers and lowercase letters can be used.',
              value: USERNAME_FORMAT,
            },
          }}
          defaultValue=""
          onFocus={() => usernameRef.current.focus()}
          render={({ onChange, onBlur, value }) => (
            <>
              <TextInput
                label="Username"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={(usernameValue) => onChange(usernameValue)}
                value={value}
                ref={usernameRef}
              />
              <HelperText type="error">{errors.username?.message}</HelperText>
            </>
          )}
        />
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
        <Button mode="contained" onPress={handleSubmit(onSubmit)} disabled={loading}>
          SIGN UP
        </Button>
      </View>
      <LoadingModal visible={loading} />
    </View>
  );
};

SignUp.propTypes = {
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
  signInBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signInBtnTitle: {
    color: DEFAULT_COLOR,
    fontSize: 16,
  },
  topContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 20,
  },
  bottomContainer: {
    height: 60,
  },
  accountTitle: {
    fontSize: 16,
  },
});

export default SignUp;
