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
import Button from '../components/button';
import { useChat } from '../hooks/useChat';
import { keyboardVerticalOffset } from '../utils/ui';
import { User } from '../utils/users';
import { Message } from './Chats';

interface MessageData extends Message {
  roomName: string;
  roomId: string;
  content: string;
}

export default function ChatScreen({ route, navigation }) {
  const { socket, user, roomId, roomName } = route.params;
  const {
    data: chat,
    isLoading: isChatLoading,
    error: isChatError,
  } = useChat(roomId);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<MessageData[] | Message[]>([]);

  console.log('messages', messages);
  useEffect(() => {
    navigation.setOptions({ title: roomName });

    if (chat) setMessages(chat.messages);

    socket.emit('join-chat', { roomName, roomId });
    socket.on('recieve-message', (data: MessageData) => {
      console.log('data', data);
      setMessages((messages) => [...messages, data]);
    });
  }, [socket, chat]);

  const messageData: MessageData = {
    roomName: roomName,
    roomId: roomId,
    sender: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      ...user,
    },
    content: message,
  };

  const sendMessage = async () => {
    await socket.emit('chat-message', messageData);
    setMessages((messages) => [...messages, messageData]);
    setMessage('');
  };

  const amIAuthor = (message: Message) =>
    message.sender.id === user.id ? 'flex-row-reverse' : 'flex-row';

  return (
    <SafeAreaView className='flex-1 bg-primaryDark px-4'>
      <FlatList
        maintainVisibleContentPosition={
          Platform.OS === 'ios' ? { minIndexForVisible: 1 } : undefined
        }
        keyExtractor={(item) => item.id}
        className='p-4 flex-1'
        data={messages}
        renderItem={({ item }) => (
          <View className={`${amIAuthor(item)} my-2`}>
            <View className='flex-col w-1/2 bg-secondaryDark p-4 rounded-full'>
              {item.senderId !== user.id && (
                <Text className='text-secondaryWhite'>
                  {item.sender?.firstName} {item.sender?.lastName}
                </Text>
              )}
              <Text className='text-white'>{item.content}</Text>
            </View>
          </View>
        )}
      />

      {socket && (
        <KeyboardAvoidingView
          className='px-4'
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
    </SafeAreaView>
  );
}
