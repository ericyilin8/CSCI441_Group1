import React from 'react';

export const AppConstants = React.createContext();

export const AppConstantsProvider = ({ children }) => {
  const LEADER_ICON_URI = require('../assets/leader_icon.png');

  return (
    <AppConstants.Provider value={{ LEADER_ICON_URI }}>
      {children}
    </AppConstants.Provider>
  );
};