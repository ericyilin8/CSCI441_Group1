import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import { StatusBar } from 'expo-status-bar';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from "expo-router";

import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import socketIO from 'socket.io-client';
import { Ionicons } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

const socket = socketIO(process.env.EXPO_PUBLIC_SOCKET_URL);

export default function App() {
  const [location, setLocation] = useState(null);
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
      
      socket.emit('shareLocation', location);
    })();
  }, []);

  const handleZoomIn = () => { // zoom in function
    mapRef.current.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922, // determine zoom level
      longitudeDelta: 0.0421, // determine zoom level
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView 
          style={styles.map} 
          ref={mapRef} // assign the ref
        >
          {location && (
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Your Location"
            />
          )}
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

        <Link href="/group" asChild>
          <Ionicons name="people-circle-outline" size={36} color="white" />      
        </Link>
        <Link href="/chat" asChild>
          <Entypo name="chat" size={36} color="white" />
        </Link>
        <Link href="/" asChild>
          <Text style={{color: "white"}}>LOGOUT</Text>
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
  }
});
