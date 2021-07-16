import React, { useState, createContext } from 'react';

const AnonymousUserContext = createContext([{}, () => {}]);

const AnonymousUserProvider = ({ children }) => {
  const [state, setState] = useState(null);

  return (
    <AnonymousUserContext.Provider value={[state, setState]}>
      {children}
    </AnonymousUserContext.Provider>
  );
};

export { AnonymousUserContext, AnonymousUserProvider };
