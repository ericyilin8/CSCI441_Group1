import React, { createContext, useState, useEffect, useContext } from 'react';
import { startLocationUpdates, stopLocationUpdates } from '../services/LocationService';
import { AppStateContext } from '../contexts/AppState';

export const LocationShareContext = createContext();

export const LocationShareProvider = ({ children }) => {
  const { socket } = useContext(AppStateContext);
  const [isLocationSharingEnabled, setIsLocationSharingEnabled] = useState(false); // default to false

  const startLocationSharing = () => {
    startLocationUpdates(socket);
    setIsLocationSharingEnabled(true);
  };

  const stopLocationSharing = () => {
    stopLocationUpdates();
    setIsLocationSharingEnabled(false);
  };

  useEffect(() => {
    if (isLocationSharingEnabled) {
      startLocationSharing();
    } else {
      stopLocationSharing();
    }
  }, [isLocationSharingEnabled, socket]);

  return (
    <LocationShareContext.Provider value={{ isLocationSharingEnabled, startLocationSharing, stopLocationSharing }}>
      {children}
    </LocationShareContext.Provider>
  );
};