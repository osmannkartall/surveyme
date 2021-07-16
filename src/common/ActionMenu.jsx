import React, { useContext, useState } from 'react';
import { IconButton, Menu, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AnonymousUserContext } from '../context/AnonymousUserContext';
import { UserContext } from '../context/UserContext';
import { auth } from '../configs/firebase';
import { DEFAULT_COLOR, WHITE } from '../constants/styles';
import showFirebaseError from '../utils/showFirebaseError';

const ActionMenu = () => {
  const [visible, setVisible] = useState(false);
  const [, setUser] = useContext(UserContext);
  const [, setAnonymousUser] = useContext(AnonymousUserContext);
  const navigation = useNavigation();

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const onPressParticipateSurvey = () => {
    closeMenu();
    navigation.navigate('SurveyParticipate');
  };

  const onPressSignOut = async () => {
    try {
      await auth.signOut();
      setUser((state) => ({ ...state, uid: null, isLoggedIn: false }));
      setAnonymousUser(null);
    } catch (error) {
      showFirebaseError(error);
    }
  };

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={<IconButton onPress={openMenu} color={WHITE} icon="dots-vertical" />}
    >
      <Menu.Item
        onPress={onPressParticipateSurvey}
        title="Participate"
        icon={() => <Icon name="clipboard-text-outline" size={24} color={DEFAULT_COLOR} />}
      />
      <Menu.Item
        onPress={() => {}}
        title="Analytics"
        icon={() => <Icon name="chart-line" size={24} color={DEFAULT_COLOR} />}
      />
      <Divider />
      <Menu.Item
        onPress={onPressSignOut}
        title="Sign Out"
        icon={() => <Icon name="logout" size={24} color={DEFAULT_COLOR} />}
      />
    </Menu>
  );
};

export default ActionMenu;
