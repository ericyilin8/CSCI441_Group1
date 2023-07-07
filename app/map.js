import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Link } from "expo-router";
import MapView from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons';

export default function App() {
  return (
    <View style={styles.container}>
      <MapView style={styles.map} />
      <View style={styles.navigation}>
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
