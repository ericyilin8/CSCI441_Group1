import React, { useState } from 'react';

export const AppStateContext = React.createContext();

export const AppStateProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState({ count: 0 });

  const incrementCount = () => {
    setGlobalState((prevState) => ({
      ...prevState,
      count: prevState.count + 1,
    }));
  };

  const decrementCount = () => {
    setGlobalState((prevState) => ({
      ...prevState,
      count: prevState.count - 1,
    }));
  };

  return (
    <AppStateContext.Provider
      value={{ globalState, incrementCount, decrementCount }}
    >
      {children}
    </AppStateContext.Provider>
  );
};
