import { StatusBar } from 'expo-status-bar';
import { Alert, Button, TextInput, View, StyleSheet, Text } from 'react-native';
import { Link } from "expo-router";
import { useState } from 'react';
import { Slot } from 'expo-router';
import { AppStateProvider } from '../AppState';

export default function App() {

  return (
        <AppStateProvider>
            <View style={styles.container}>
                <Slot/>
            </View>
        </AppStateProvider>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#23A7E0'
    }
})
