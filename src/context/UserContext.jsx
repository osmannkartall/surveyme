import React, { useState, createContext } from 'react';

const UserContext = createContext([{}, () => {}]);

const UserProvider = ({ children }) => {
  const [state, setState] = useState({
    username: '',
    email: '',
    uid: '',
    isLoggedIn: null,
  });

  const avoidLogin = () => setState((prevState) => ({ ...prevState, isLoggedIn: false }));

  return (
    <UserContext.Provider value={[state, setState, avoidLogin]}>{children}</UserContext.Provider>
  );
};

export { UserContext, UserProvider };
