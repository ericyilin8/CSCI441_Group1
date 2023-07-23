const uploadImageToServer = async (imageUri, jwt, imageType = 'message') => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg', // Adjust the file type as needed
    name: 'image.jpg', // Set a desired name for the image file
  });
  formData.append('imageType', imageType);

  try {
    const response = await fetch(process.env.EXPO_PUBLIC_SOCKET_URL + '/api/image/save', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': jwt,
      },
    });

    // Delete and uncommment below once working
    const text = await response.text();  // get raw response text
    console.log('Server response:', text);
    const data = JSON.parse(text);


    //const data = await response.json();

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
};

export default uploadImageToServer;