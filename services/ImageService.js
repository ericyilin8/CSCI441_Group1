import * as FileSystem from 'expo-file-system';

export const imageService = {
  uploadImageToServer: async (imageUri, jwt, imageType = 'message', groupId = null) => {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg', // Adjust the file type as needed
      name: 'image.jpg', // Set a desired name for the image file
    });
    formData.append('imageType', imageType);
    if (imageType != 'avatar') {
      formData.append(groupId)
    }

    try {
      const response = await fetch(process.env.EXPO_PUBLIC_SOCKET_URL + '/api/image/save', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': jwt,
        },
      });

      const text = await response.text();  // get raw response text
      console.log('Server response:', text);
      const data = JSON.parse(text);

      if (response.ok) {
        console.log('Image uploaded successfully');
        // return the server's response
        return data;
      } else {
        console.error('Image upload failed', data);
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  downloadImageFromServer: (imageName, jwt) => {
    return new Promise(async (resolve, reject) => {
      try {
        const remoteURI = process.env.EXPO_PUBLIC_SOCKET_URL + '/api/image/retrieve/' + imageName;
        const localURI = FileSystem.documentDirectory + imageName;
        const headers = {
          'Authorization': jwt
        };
  
        const { uri } = await FileSystem.downloadAsync(remoteURI, localURI, {headers});
  
        console.log("Image downloaded and saved to: ", uri);
        
        // Resolve the Promise with the uri
        resolve(uri);
      } catch (error) {
        console.error('Error downloading image:', error);
        // Reject the Promise with the error
        reject(error);
      }
    });
  }
};

export default imageService;