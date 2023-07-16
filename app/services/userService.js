export const userService = {
  register: async (username, email, password, phone_number) => {
    try {
      const requestBody = { username, email, password, phone_number };
      console.log('Sending request to:', process.env.EXPO_PUBLIC_SOCKET_URL + '/api/user')
      console.log('Sending request:', requestBody);

      const response = await fetch(process.env.EXPO_PUBLIC_SOCKET_URL + '/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const text = await response.text();
      console.log('Response text:', text);

      if (!response.ok) {
        console.error('HTTP status:', response.status);
        throw new Error('Registration failed');
      }

      const data = JSON.parse(text);
      return data;

    } catch (error) {
      console.error(error); // Log full error
      throw error;
    }
  },
};

export default userService;
