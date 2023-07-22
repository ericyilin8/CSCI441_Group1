import React, { useState } from 'react';

export const AppStateContext = React.createContext();

export const AppStateProvider = ({ children }) => {
  const [socket, setSocket] = useState({});
  const [currentGroup, setCurrentGroup] = useState('');
  return (
    <AppStateContext.Provider
      value={{ socket, setSocket, currentGroup, setCurrentGroup }}
    >
      {children}
    </AppStateContext.Provider>
  );
};
