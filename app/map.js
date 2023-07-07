import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import { StatusBar } from 'expo-status-bar';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { Link } from "expo-router";
import MapView from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import socketIO from 'socket.io-client';
import { SOCKET_URL } from 'react-native-dotenv';

const socket = socketIO(SOCKET_URL);

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
      <Text>Map Page</Text>
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
      {location && (
        <Button
          title="Zoom In"
          onPress={handleZoomIn}
        />
      )}
      <Link href="/group">Group</Link>
      <Link href="/chat">Chat</Link>
      <Link href="/">Logout</Link>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    //justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '90%',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingTop: 10,
    borderTopColor: 'white',
    borderTopWidth: 2
  }
});
