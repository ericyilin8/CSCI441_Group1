import React, { useState, useEffect, useContext, useRef } from 'react'; // Import useRef
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from "expo-router";
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { AppStateContext } from '../contexts/AppState';
import { LocationShareContext } from '../contexts/LocationShareContext';
import * as SecureStore from 'expo-secure-store';
import jwtDecode from 'jwt-decode';

export default function Map() {
  const { socket } = useContext(AppStateContext);
  const [location, setLocation] = useState(null);
  const [sharedLocations, setSharedLocations] = useState({}); // state for shared locations
  const mapRef = useRef(); // create a ref so that map doesn't re-render on zoom
  const [username, setUsername] = useState(null);
  const { isLocationSharingEnabled, startLocationSharing, stopLocationSharing } = useContext(LocationShareContext);

  const handleLocationSharing = () => {
    if (isLocationSharingEnabled) {
      stopLocationSharing();
    } else {
      startLocationSharing(socket);
    }
  };

  useEffect(() => {
    (async () => {
      // Fetch and decode the JWT
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.username);
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      // set location to user's location - used to center map and to display marker if 
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // Listen for socket events
      socket.on('updateLocations', locationData => {
        console.log("Received location data:", locationData);
        setSharedLocations(prevLocations => ({...prevLocations, ...locationData}));
      });

      // Cleanup function
      return () => {
        socket.off('updateLocations');
      };
    })();
  }, []);

  const handleZoomIn = () => { // zoom in function
    mapRef.current.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.08, // determine zoom level
      longitudeDelta: 0.035, // determine zoom level
    });
  };

  const getFirstSharedLocationCoords = () => {
    const keys = Object.keys(sharedLocations);
    if (keys.length > 0) {
      return sharedLocations[keys[0]].location?.coords;
    }
    return null;
  };

  if (!location) {
    return <ActivityIndicator />;
  }

  const defaultLatitude = 38.874151; // Fallback coordinates if no locations to use to center map, currently FHSU student union
  const defaultLongitude = -99.341932;

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView 
          style={styles.map}
          ref={mapRef} // assign the ref
          initialRegion={{
            latitude: location?.coords?.latitude || getFirstSharedLocationCoords()?.latitude || defaultLatitude,
            longitude: location?.coords?.longitude || getFirstSharedLocationCoords()?.longitude || defaultLongitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {Object.keys(sharedLocations).length > 0 && Object.keys(sharedLocations).map(key => {
            const userLocation = sharedLocations[key].location?.coords;
            const userName = sharedLocations[key].username;

            console.log(`Mapping user ${userName} at coordinates:`, userLocation);
            
            return (
              userLocation && <Marker
                key={key} // React needs a unique key for each marker - TODO add logic somewhere, serverside? to verify all mapped usernames are unique
                coordinate={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}
                title={userName}
              />
            );
          })}
        </MapView>
      </View>

      <View style={styles.navigation}>
        <View style={styles.mapButtons}>
          {location && (
            <Pressable
              style={styles.mapButton}
              onPress={handleZoomIn}
            >
              <Feather style={styles.mapIcon} name="zoom-in" size={36} color="white" />
            </Pressable>
          )}
        </View>
        <Pressable onPress={handleLocationSharing}>
          {isLocationSharingEnabled
          ? <Text style={{color: "green"}}>Location Sharing On</Text>
          : <Text style={{color: "grey"}}>Location Sharing Off</Text>}
        </Pressable>
        <Link href="/group" asChild>
          <Ionicons name="people-circle-outline" size={36} color="#23A7E0" />      
        </Link>
        <Link href="/chat" asChild>
          <Entypo name="chat" size={36} color="#23A7E0" />
        </Link>
        <Link href="/" asChild>
          <Text style={{color: "#23A7E0"}}>LOGOUT</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor:'white',
  },
  mapContainer: {
    width: '100%',
    height: '90%',
    shadowColor: 'rgba(0,0,0,0.8)',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    backgroundColor: 'white'
  },
  map: {
    width: '100%',
    height: '100%',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingTop: 16,
  },
  mapButton: {
    zIndex: 999,
  },
  mapIcon: {
    shadowColor: 'rgba(0,0,0,0.8)',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  mapButtons: {
    alignItems: 'center',
    justifyContent: 'center', 
    position: 'absolute',
    top: -50,
    left: 0,
    width: '100%',
    paddingTop: 16,
  },
});