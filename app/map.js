import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import { StatusBar } from 'expo-status-bar';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from "expo-router";
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import socketIO from 'socket.io-client';
import { Ionicons } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

const socket = socketIO(process.env.EXPO_PUBLIC_SOCKET_URL);
import { Feather } from '@expo/vector-icons';

const socket = socketIO(process.env.EXPO_PUBLIC_SOCKET_URL);

export default function App() {
  const [location, setLocation] = useState(null);
  const [sharedLocations, setSharedLocations] = useState({}); // state for shared locations
  const mapRef = useRef(); // create a ref so that map doesn't re-render on zoom

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log("Sending location to server:", location);
      
      socket.emit('shareLocation', location);

      socket.on('updateLocations', locationData => {
        console.log("Received location data:", locationData);
        setSharedLocations(prevLocations => ({...prevLocations, ...locationData}));
      });
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

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView 
          style={styles.map}
          ref={mapRef} // assign the ref
        >
          {Object.keys(sharedLocations).map(key => {
            const userLocation = sharedLocations[key].location.coords;
            const userName = sharedLocations[key].username;

            console.log(`Mapping user ${userName} at coordinates:`, userLocation);
            
            return (
              <Marker
                key={key} // React needs a unique key for each marker
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
    //justifyContent: 'center',
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
  }
});
