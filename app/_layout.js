import { StatusBar } from 'expo-status-bar';
import { Alert, Button, TextInput, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Slot } from 'expo-router';
import { AppStateProvider } from '../contexts/AppState';
import { RouterProvider } from '../contexts/RouterContext';
import { LocationShareProvider } from '../contexts/LocationShareContext';

export default function App() {
    return (
        <AppStateProvider>
            <RouterProvider>
                <LocationShareProvider>
                    <View style={styles.container}>
                        <Slot/>
                    </View>
                </LocationShareProvider>
            </RouterProvider>
        </AppStateProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#23A7E0'
    }
})
