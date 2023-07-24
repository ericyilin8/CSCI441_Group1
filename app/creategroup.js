import React, { useState, useEffect } from 'react';
import { Alert, View, Text, TextInput, StyleSheet, ScrollView, Platform, Image, Pressable } from 'react-native';
import { router, Link } from "expo-router";
import { Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import uploadImageToServer from '../services/ImageService';
import { groupService } from '../services/GroupService';

const CreateGroup = () => {
    const [groupName, setGroupName] = useState('');
    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Need gallery permissions to add a group avatar.');
                }
            }
        })();
    }, []);

    const handleCreateGroup = async () => {
        try {
            let imagepath = '';
            if (avatar) {
                // Create form data
                let formData = new FormData();
                formData.append('avatar', {
                    uri: avatar,
                    type: 'image/jpeg',
                    name: 'avatar.jpg',
                });
                // Fetch JWT from Secure Store
                const jwt = await SecureStore.getItemAsync('jwt');

                // Upload avatar image and get server response
                const imageData = await uploadImageToServer(avatar, jwt, 'avatar');
                console.log('Avatar uploaded successfully:', imageData);
                imagepath=imageData.path
            }
            // Create group with server - leader is assigned server side using sender's JWT
            const group = await groupService.createGroup(
                {
                    name: groupName,
                    avatar: imagepath,
                });

            // log response
            console.log('Group Create response:', group);
            Alert.alert('Group Created!');

            // Take user back to group view
            router.back();

            // Reset the input fields after creating the group
            setGroupName('');
            setAvatar('');

        } catch (error) {
            console.error('Failed to create group:', JSON.stringify(error));
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (result.assets) {
            setAvatar(result.assets[0].uri);
        }
    }

    return (
        <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps='handled' // Closes keyboard when tapping outside of TextInput
        >
            <View style={styles.container}>
                <Link href="/group" asChild>
                    <Entypo name="back" size={36} color="white" />
                </Link>
                <Text style={styles.heading}>Create a New Group</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Group Name"
                    value={groupName}
                    onChangeText={text => setGroupName(text)}
                />
                {avatar ? (
                    <>
                        <Text style={styles.headingAvatar}>Group Avatar</Text>
                        <Image
                            source={{ uri: avatar }}
                            style={{ width: 200, height: 200 }}
                        />
                    </>
                ) : (
                    <Pressable style={styles.button} onPress={pickImage}>
                        <Text style={styles.buttonText}>Pick an image</Text>
                    </Pressable>
                )}
                <Pressable style={styles.button} onPress={handleCreateGroup}>
                    <Text style={styles.buttonText}>Create Group</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        width: '100%',
        height: 40,
        borderRadius: 4,
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: 'white',
    },
    button: {
        backgroundColor: '#3498db',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 4,
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    scrollContainer: {
        flexGrow: 1
    },
    headingAvatar: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
});

export default CreateGroup;
