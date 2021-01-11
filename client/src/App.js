import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

import './App.css';
import createFakeUsers from './util/fakeUsers';
import NameHolder from './components/nameholder/NameHolder';
import LoginModal from './loginmodal/LoginModal';
import GoogleMap from './components/GoogleMap';
import ChatBox from './components/chatbox/ChatBox';
import ReCenterIcon from './components/button/ReCenterIcon';
import NumberOfUsers from './components/usercount/NumberOfUsers';

// const SERVER_URL = 'http://localhost:5000';
export const StateContext = React.createContext({});

const SG_POSITION = { lat: 1.3521, lng: 103.8198 };

const socket = io('https://helloworld-hnr.herokuapp.com', {
  withCredentials: true,
  extraHeaders: {
    'my-custom-header': 'abcd',
  },
});

function createUserObj(data) {
  return {
    ...data,
    lat: parseFloat(data.lat),
    lng: parseFloat(data.lng),
  };
}

function createMessageObj(data) {
  return {
    _id: data._id,
    sender: data.username,
    senderId: data.userId,
    text: data.text,
  };
}

function App() {
  // Global Variables
  const [name, setName] = useState('');
  const [image, setImage] = useState('boy1');
  const [mapOptions, setMapOptions] = useState(null);

  // Cache
  const [users, setUsers] = useState(createFakeUsers(500, SG_POSITION, 1));
  const [messages, setMessages] = useState([]);
  const [numOnline, setNumOnline] = useState(0);

  // Map Coordinates
  const [currLocation, setCurrLocation] = useState(SG_POSITION);

  // onMount
  useEffect(() => {
    socket.on('connect', (message) => {
      console.log('A new user has connected');
    });

    socket.on('status', (msg) => {
      console.log(msg);
    });

    socket.on('outputUser', (newUsers) => {
      newUsers.map((user) => console.log('user ' + user.username + ' joined'));
      newUsers = newUsers.map((user) => createUserObj(user));
      setUsers((prevUsers) => [...prevUsers, ...newUsers]);
    });

    socket.on('outputMessage', (newMessages) => {
      const modifiedMsg = newMessages.map((msg) => createMessageObj(msg));
      setMessages((prevMessages) => [...prevMessages, ...modifiedMsg]);

      const ids = new Map();
      newMessages.forEach((msg) => {
        ids.set(msg.userId, msg.text);
      });

      setUsers((prevUsers) =>
        prevUsers.map((usr) => {
          if (ids.has(usr._id)) {
            return { ...usr, latestMessage: ids.get(usr._id) };
          } else {
            return usr;
          }
        })
      );
    });

    ['outputUpdateUser', 'outputPosition'].forEach((event) => {
      socket.on(event, (newUsers) => {
        newUsers.map((user) => console.log(user.username + ' was modified'));
        newUsers = newUsers.map((user) => createUserObj(user));
        const ids = new Set(newUsers.map((u) => u._id));
        setUsers((prevUsers) => [...prevUsers.filter((u) => !ids.has(u._id)), ...newUsers]);
      });
    });

    socket.on('onlineUsers', (number) => {
      console.log('users: ' + number);
      setNumOnline(number);
    });

    socket.on('userLeft', (userId) => {
      console.log('user ' + userId + ' left, called by ' + socket.id);
      setUsers((prevUsers) => [...prevUsers.filter((u) => u._id !== userId)]);
    });

    // get location
    if ('geolocation' in navigator) {
      console.log('Location enabled');

      navigator.geolocation.getCurrentPosition((position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrLocation(location);
        setMapOptions({ center: location, zoom: 15 });
      });
    } else {
      console.log('Location disabled');
    }
    setUsers((prevUsers) => [...prevUsers]);
  }, []);

  // on avatar or name update
  useEffect(() => {
    console.log('Changed name/avatar');
    socket.emit('inputUpdateUser', { username: name, avatar: image });
  }, [name, image]);

  // create user
  const initUser = (name, image) => {
    // send user input
    socket.emit('inputUser', {
      username: name,
      avatar: image,
      lat: currLocation.lat,
      lng: currLocation.lng,
    });

    // listen for location update
    if ('geolocation' in navigator) {
      navigator.geolocation.watchPosition((position) => {
        console.log('geolocation changed');
        if (
          currLocation.lat !== position.coords.latitude ||
          currLocation.lng !== position.coords.longitude
        ) {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setCurrLocation(location);
          console.log(location);
          socket.emit('inputPosition', location);
        }
      });
    }
  };

  const contextProviderValue = {
    name,
    setName: (newName) => {
      setName(newName);
      socket.emit('inputUpdateUser', {
        username: newName,
      });
    },
    image,
    setImage: (newImage) => {
      setImage(newImage);
      socket.emit('inputUpdateUser', {
        avatar: newImage,
      });
    },
    mapOptions,
    setMapOptions,
    socketId: socket.id,
    sendMessage: (text) => socket.emit('inputMessage', { text: text }),
    initUser,
  };

  return (
    <div className="App">
      <StateContext.Provider value={contextProviderValue}>
        <LoginModal />
        <NameHolder />
        <NumberOfUsers numOnline={numOnline} />
        <GoogleMap users={users} />
        {/*<ReCenterIcon handleClick={toggleFakeUser} />*/}
        <ReCenterIcon handleClick={() => setMapOptions({ center: currLocation, zoom: 15 })} />
        <ChatBox messages={messages} />
      </StateContext.Provider>
      {/*<p className="app-name">HELLO WORLD!</p>*/}
    </div>
  );
}

export default App;
