import React, { useContext, useEffect } from 'react';
import { Image, StyleSheet, Alert } from 'react-native';
import { DEFAULT_PADDING } from '../constants/styles';
import { UserContext } from '../context/UserContext';
import { auth, usersRef } from '../configs/firebase';
import { NO_USER } from '../constants/alerts';
import showFirebaseError from '../utils/showFirebaseError';

const Loading = () => {
  const [user, setUser, avoidLogin] = useContext(UserContext);

  useEffect(() => {
    let mounted = true;

    auth.onAuthStateChanged(async (userCredential) => {
      try {
        if (userCredential && mounted) {
          const { uid } = userCredential;
          const doc = await usersRef.doc(uid).get();

          if (!doc.exists) {
            Alert.alert('Error', NO_USER);
            avoidLogin();
          } else {
            const userData = {
              email: doc.data().email,
              username: doc.data().username,
              uid,
              isLoggedIn: true,
            };

            setUser(userData);
          }
        } else {
          avoidLogin();
        }
      } catch (error) {
        showFirebaseError(error);
        avoidLogin();
      }
    });

    return function cleanup() {
      mounted = false;
    };
  }, [user]);

  return (
    <Image
      style={styles.container}
      source={require('../../assets/splash.png')}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: DEFAULT_PADDING,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loading;
