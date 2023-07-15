const io = require('socket.io-client');

// test constants

const numUsers = 5;
const baseLocation = { latitude: 38.8735, longitude: -99.3429 }; // base location that is tweaked to give each user different location


for(let i=0; i<numUsers; i++) {
  const socket = io('https://adventurous-pointed-ocean.glitch.me');

  let location = {
    coords: {
      accuracy: 35,
      altitude: 318.0910301208496,
      altitudeAccuracy: 6.092679500579834,
      heading: -1,
      latitude: baseLocation.latitude + (Math.random() - 0.5) * 0.0145,
      longitude: baseLocation.longitude + (Math.random() - 0.5) * 0.0145,
      speed: -1
    },
    timestamp: Date.now()
  };
  
  let testUsername = `testUser${i}`;

  console.log(`Sending location to for testUser${i}:`, location);
  socket.emit('shareLocation', location);
}