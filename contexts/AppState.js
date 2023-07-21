import React, { useState } from 'react';

export const AppStateContext = React.createContext();

export const AppStateProvider = ({ children }) => {
  const [socket, setSocket] = useState({});

  return (
    <AppStateContext.Provider
      value={{ socket, setSocket }}
    >
      {children}
    </AppStateContext.Provider>
  );
};
