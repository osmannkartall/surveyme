import React, { useState, createContext } from 'react';

// It is used to store the input values of the unsubmitted survey.
const NewSurveyContext = createContext([{}, () => {}]);

/**
 * editedQuestionId is used to distinguish the currently edited question from others.
 * null indicates that no questions are currently being edited.
 */
const NewSurveyProvider = ({ children }) => {
  const [state, setState] = useState({
    questions: [],
    visibility: 'private',
    title: '',
    question: '',
    editedQuestionId: null,
  });

  return (
    <NewSurveyContext.Provider value={[state, setState]}>{children}</NewSurveyContext.Provider>
  );
};

export { NewSurveyContext, NewSurveyProvider };
