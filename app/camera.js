import React, { useState, useEffect } from 'react';
import { View, Pressable, Image } from 'react-native';
import { Camera } from 'expo-camera';
import socketIO from 'socket.io-client';
import { Link } from "expo-router";
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function App() {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);

  useEffect(() => {
    // Request permission to access the camera, has to be before the socket setup for some reason
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(status === 'granted');
    })();

    // Connect to the Socket.io server
    const socket = socketIO(process.env.EXPO_PUBLIC_SOCKET_URL)

    // Event listeners

    // Clean up the connection on component unmount
    return () => {
        socket.disconnect()
    };
    
  }, []);

  const handleTakePhoto = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync({ quality: 0.1 });

      uploadImageToServer(photo.uri);
      router.replace('/chat');
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



