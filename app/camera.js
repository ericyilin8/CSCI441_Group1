import React, { useState, useEffect, useContext } from 'react';
import { View, Pressable, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { Link } from "expo-router";
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import imageService from '../services/ImageService';
import { AppStateContext } from '../contexts/AppState';

export default function CameraComponent() {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const { user } = useContext(AppStateContext);

  useEffect(() => {
    // Request permission to access the camera, has to be before the socket setup for some reason
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(status === 'granted');
    })();

    // Event listeners
  }, []);

  const handleTakePhoto = async () => {
    if (camera) {
      // Fetch and decode the JWT
      const token = await SecureStore.getItemAsync('userToken');

      const photo = await camera.takePictureAsync({ quality: 0.1 });

      imageService.uploadImageToServer(photo.uri, token, 'message', user.currentGroup);
      router.replace('/chat');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1, height: 600 }}
        type={Camera.Constants.Type.back}
        ref={(ref) => setCamera(ref)}
      />
      <View style={{ flexDirection: 'row',  alignItems: 'center', justifyContent: 'space-around', paddingBottom: 40 }}>
        <Pressable onPress={handleTakePhoto}>
            <Ionicons name="ios-camera-sharp" size={36} color="gold" />
        </Pressable>
        <Link href="/chat" asChild>
          <Entypo name="back" size={36} color="white" />
        </Link>
      </View>
    </View>
  );
}



