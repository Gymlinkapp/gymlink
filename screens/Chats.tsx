import { NavigationState } from '@react-navigation/native';
import { getItemAsync } from 'expo-secure-store';
import { useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { io } from 'socket.io-client';
import Button from '../components/button';
import useToken from '../hooks/useToken';
import { useUser } from '../hooks/useUser';
import Layout from '../layouts/layout';
import { keyboardVerticalOffset } from '../utils/ui';
import { User } from '../utils/users';

interface Message {
  room: string;
  user: User;
  message: string;
  time: string;
}

export default function Chats({ navigation, route }: any) {
  const { socket } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [room, setRoom] = useState('');

  const token = useToken();
  const { data: user, isLoading, error } = useUser(token);

  useEffect(() => {
    socket.on('recieve-message', (data: Message) => {
      setMessages((messages) => [...messages, data]);
    });
    console.log(messages);
  }, [socket]);

  const messageData: Message = {
    room: room,
    user: user,
    message: message,
    time:
      new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes(),
  };

  const sendMessage = async () => {
    await socket.emit('chat-message', messageData);
    setMessages((messages) => [...messages, messageData]);
    setMessage('');
  };

  if (isLoading) return <Text className='text-white'>Loading...</Text>;
  if (error) return <Text className='text-white'>Error: {error.message}</Text>;

  const amIAuthor = (message: Message) =>
    message.user.id === user.id ? 'flex-row-reverse' : 'flex-row';

  return (
    <View className='flex-1 bg-primaryDark px-4'>
      {messages.length > 0 && (
        <FlatList
          className='p-4'
          data={messages}
          renderItem={({ item }) => (
            <View className={`${amIAuthor(item)} my-2`}>
              <View className='flex-col w-1/2 bg-secondaryDark p-4 rounded-full'>
                {item.user.id !== user.id && (
                  <Text className='text-secondaryWhite'>
                    {item.user.firstName} {item.user.lastName}
                  </Text>
                )}
                <Text className='text-white'>{item.message}</Text>
              </View>
            </View>
          )}
        />
      )}
      {socket && (
        <KeyboardAvoidingView
          behavior='position'
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          <View className='flex-row items-center bg-primaryDark'>
            <View className='flex-1 mr-2'>
              <TextInput
                value={message}
                onChangeText={(text) => setMessage(text)}
                className='bg-secondaryDark text-white p-4 rounded-md'
              />
            </View>
            <Button variant='primary' textSize='xs' onPress={sendMessage}>
              Send
            </Button>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}
