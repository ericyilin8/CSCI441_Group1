import React, { useState, useEffect, useContext } from 'react';
import { View, Pressable, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { Link } from "expo-router";
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AppStateContext } from '../contexts/AppState';

export default function CameraComponent() {
  const { socket } = useContext(AppStateContext);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);

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
      const photo = await camera.takePictureAsync({ quality: 0.1 });

      uploadImageToServer(photo.uri);
      router.replace('/Chat');
    }
  };


  const uploadImageToServer = async (imageUri) => {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg', // Adjust the file type as needed
      name: 'image.jpg', // Set a desired name for the image file
    });
  
    try {
      const response = await fetch(process.env.EXPO_PUBLIC_SOCKET_URL + '/image', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.ok) {
        console.log('Image uploaded successfully');
        // Handle success
      } else {
        console.error('Image upload failed');
        // Handle error
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      // Handle error
    }
  };

  if (cameraPermission === null) {
    return <View />;
  }
  if (cameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

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



