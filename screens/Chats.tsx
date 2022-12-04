import { NavigationState } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { io } from 'socket.io-client';
import Button from '../components/button';
import Layout from '../layouts/layout';
// import { socket } from '../utils/socket';

export default function Chats({ navigation, route }: any) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState({});
  const { socket } = route.params;
  console.log(socket);

  useEffect(() => {
    const messageListener = (message) => {
      setMessages((prevMessages) => {
        const newMessages = { ...prevMessages };
        newMessages[message.id] = message;
        return newMessages;
      });
    };

    socket.on('chat message', messageListener);

    return () => {
      socket.off('chat message', messageListener);
    };
  }, [socket]);

  console.log(messages);

  return (
    <View className='flex-1 bg-primaryDark'>
      <Text className='text-white'>test</Text>
      <TextInput
        value={message}
        onChangeText={(text) => setMessage(text)}
        className='bg-secondaryWhite text-black'
      />
      {socket && (
        <Button
          variant='primary'
          onPress={() => {
            socket.emit('chat message', message);
            setMessage('');
          }}
        >
          Send
        </Button>
      )}
    </View>
  );
}
