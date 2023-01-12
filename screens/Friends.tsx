import { Dimensions, ScrollView, Text, View } from 'react-native';
import useToken from '../hooks/useToken';
import { useUser } from '../hooks/useUser';
import Loading from '../components/Loading';
import { useFriends } from '../hooks/useFriends';
import EmptyScreen from '../components/EmptyScreen';
import { UserCircle } from 'phosphor-react-native';

export default function FriendsScreen({ navigation }) {
  const { height } = Dimensions.get('window');
  const token = useToken();
  const { data: friends, isLoading, error } = useFriends(token);
  if (isLoading) return <Loading />;
  if (friends.length === 0)
    return (
      <EmptyScreen
        icon={<UserCircle weight='fill' color='rgb(204,201,201)' size={48} />}
        text="You don't have any friends right now!"
      />
    );
  return (
    <ScrollView
      className='px-6 flex-1'
      scrollEnabled
      contentContainerStyle={{ height: height, paddingBottom: 500 }}
    >
      {friends?.map((friend) => (
        <View
          className='mr-2 my-1 bg-secondaryDark px-6 py-2 rounded-full'
          key={friend.id}
        >
          <Text className='text-white text-md font-MontserratMedium'>
            {friend.firstName} {friend.lastName}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}
