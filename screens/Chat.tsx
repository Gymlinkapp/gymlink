import { useEffect, useRef, useState } from 'react';
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
import { useQueryClient } from 'react-query';
import Loading from '../components/Loading';

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
  const [messageData, setMessageData] = useState<MessageData>({
    roomName: roomName,
    roomId: roomId,
    sender: user,
    content: '',
  });
  const [messages, setMessages] = useState<MessageData[] | Message[]>([]);
  const flatListRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({ title: roomName });

    if (chat) {
      setMessages(chat.messages);
    }

    socket.emit('join-chat', { roomName, roomId });
    socket.on('recieve-message', (data: MessageData) => {
      console.log('recieved message', data);
      setMessages([...messages, data]);
    });

    console.log('messages', messages);
  }, [socket, chat, roomName, roomId, chat.messages]);

  const sendMessage = async () => {
    setMessageData({ ...messageData, sender: user });
    await socket.emit('chat-message', messageData);
    setMessages([...messages, messageData]);
    setMessageData({ ...messageData, content: '' });
  };

  const amIAuthor = (message: Message) =>
    message.sender?.id === user.id ? 'flex-row-reverse' : 'flex-row';
  if (isChatLoading) return <Loading />;
  return (
    <KeyboardAvoidingView
      className='flex-1'
      behavior='padding'
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <SafeAreaView className='flex-1 bg-primaryDark px-4'>
        <KeyboardAvoidingView behavior='height' className='flex-1'>
          <FlatList
            maintainVisibleContentPosition={
              Platform.OS === 'ios' ? { minIndexForVisible: 1 } : undefined
            }
            keyExtractor={(item) => item.id}
            className='px-4'
            data={messages}
            initialScrollIndex={messages.length - 1}
            // when a new message is sent, scroll to the bottom
            onContentSizeChange={() => {
              flatListRef.current.scrollToEnd({ animated: true });
            }}
            ref={flatListRef}
            getItemLayout={(data, index) => ({
              length: 100,
              offset: 100 * index,
              index,
            })}
            // when the keyboard is open, scroll to the bottom
            onLayout={() => {
              flatListRef.current.scrollToEnd({ animated: true });
            }}
            // hides the scroll bar
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View className={`${amIAuthor(item)} my-2`} key={item.id}>
                <View className='flex-col w-1/2 bg-secondaryDark p-4 rounded-full'>
                  {item.sender?.id !== user.id && (
                    <Text className='text-secondaryWhite'>
                      {item.sender?.firstName} {item.sender?.lastName}
                    </Text>
                  )}
                  <Text className='text-white'>{item.content}</Text>
                </View>
              </View>
            )}
          />
        </KeyboardAvoidingView>
        {socket && (
          <View className='flex-row items-center bg-primaryDark'>
            <View className='flex-1 mr-2'>
              <TextInput
                value={messageData.content}
                onChangeText={(text) =>
                  setMessageData({ ...messageData, content: text })
                }
                className='bg-secondaryDark text-white p-4 rounded-md'
              />
            </View>
            {messageData.content.length > 0 && (
              <Button variant='primary' textSize='xs' onPress={sendMessage}>
                Send
              </Button>
            )}
          </View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
