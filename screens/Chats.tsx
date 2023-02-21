import { ChatsTeardrop } from 'phosphor-react-native';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { User } from '../utils/users';
import EmptyScreen from '../components/EmptyScreen';
import { useAuth } from '../utils/context';
import { Image } from 'react-native';

export type Message = {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  chatId?: string;
  senderId?: string;
  sender?: User;
  content: string;
};

export interface Chat {
  name: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  participants: User[];
  messages: Message[];
}

export default function Chats({ navigation, route }: any) {
  const { socket } = route.params;

  const { user, token } = useAuth();

  const isCurrentUser = (u: User) => u.id === user.id;

  return (
    <View className='flex-1'>
      {user.chats?.length ? (
        <View>
          <FlatList
            className='p-4'
            // filter the friends and find the chats between the user and the friend
            data={user.chats}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const recentMessage = item.messages[item.messages?.length - 1];
              const me = item.participants.find(
                (u: User) => u.id === user.id
              ) as User;
              const otherUser = item.participants.find(
                (u: User) => u.id !== user.id
              ) as User;
              return (
                <TouchableOpacity
                  className='flex-row items-center my-2 bg-secondaryDark p-4 rounded-md'
                  onPress={() => {
                    navigation.navigate('Chat', {
                      socket: socket,
                      user: user,
                      roomName: item.name,
                      toUser: otherUser,
                      userImage: otherUser.images[0],
                      uiName: `${otherUser.firstName} ${otherUser.lastName}`,
                      roomId: item.id,
                    });
                  }}
                >
                  <Image
                    source={{
                      uri: isCurrentUser(item.participants[0])
                        ? item.participants[1].images[0]
                        : item.participants[0].images[0],
                    }}
                    className='w-[50px] h-[50px] rounded-full mr-4'
                  />
                  <View className='flex-col'>
                    <Text className='text-white text-xl'>
                      {otherUser.firstName} {otherUser.lastName}
                    </Text>
                    <Text className='text-secondaryWhite'>
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Text>
                    <Text className='text-white'>
                      {recentMessage.senderId === me.id
                        ? 'Me: '
                        : otherUser.firstName}{' '}
                      {recentMessage.content}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      ) : (
        <EmptyScreen
          icon={
            <ChatsTeardrop weight='fill' color='rgb(204,201,201)' size={48} />
          }
          text='You have no chats yet'
        />
      )}
    </View>
  );
}
