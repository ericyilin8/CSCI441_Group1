import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Link } from "expo-router";
import { Entypo } from '@expo/vector-icons';

const CreateGroup = () => {
    const [groupName, setGroupName] = useState('');
    const [avatar, setAvatar] = useState('');

    const handleCreateGroup = () => {
        // You can implement the logic to create the group here
        // Send the group name and avatar to the server or perform any other actions
        console.log('Creating group:', groupName, avatar);
        // Reset the input fields after creating the group
        setGroupName('');
        setAvatar('');
    };

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
                <TextInput
                    style={styles.input}
                    placeholder="Group Avatar URL"
                    value={avatar}
                    onChangeText={text => setAvatar(text)}
                />
                <TouchableOpacity style={styles.button} onPress={handleCreateGroup}>
                    <Text style={styles.buttonText}>Create Group</Text>
                </TouchableOpacity>
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
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
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
});

export default CreateGroup;
