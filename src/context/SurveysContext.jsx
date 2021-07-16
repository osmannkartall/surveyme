import React, { useState, createContext } from 'react';

const SurveysContext = createContext([{}, () => {}]);

const SurveysProvider = ({ children }) => {
  const [state, setState] = useState([]);

  return (
    <SurveysContext.Provider value={[state, setState]}>{children}</SurveysContext.Provider>
  );
};

export { SurveysContext, SurveysProvider };
