import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { CaretLeft, MapPin } from 'phosphor-react-native';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import { Text } from 'react-native';
import { View } from 'react-native';
import BackButton from '../components/BackButton';
import Split from '../components/Split';
import { WeekSplit } from '../utils/split';
import { useEffect, useState } from 'react';
import { useGym } from '../hooks/useGym';
import { useAuth } from '../utils/context';
import UserPrompt from '../components/UserPrompt';
import getMostRecentPrompt from '../utils/getMostRecentPrompt';
import { useUser } from '../hooks/useUser';
import Loading from '../components/Loading';

const ProfileInfoSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <View className='bg-secondaryDark p-6 rounded-2xl mb-2'>
      <Text className='text-white text-2xl font-MontserratBold mb-1'>
        {title}
      </Text>
      {children}
    </View>
  );
};

export default function ProfileInfo({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const { user, gymId } = route.params;
  const { prompt, token } = useAuth();
  const [userSplit, setUserSplit] = useState<WeekSplit[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [recentPrompt, setRecentPrompt] = useState('');

  const { data: currUser, isLoading: isUserLoading } = useUser(token);
  const { data: gym, isLoading: gymLoading } = useGym(gymId);

  if (isUserLoading) return <Loading />;

  const transformTag = (tag: string) => {
    const words = tag.split('-');
    const transformedWords = words.map((word) => {
      return word[0].toUpperCase() + word.slice(1);
    });
    return transformedWords.join(' ');
  };

  useEffect(() => {
    if (user.userPrompts.length < 1) return;
    if (user) {
      const lastPrompt = getMostRecentPrompt(user);
      setRecentPrompt(lastPrompt.answer);
    } else {
      const lastPrompt = getMostRecentPrompt(currUser);
      setRecentPrompt(lastPrompt.answer);
    }
  }, [currentImageIndex]);

  useEffect(() => {
    if (user.split) {
      const userSplit = Object.keys(user.split).map((day) => {
        // dont include 'id' as a day in the key
        if (day === 'id') return;
        return {
          day,
          exercises: user.split[day],
        };
      }) as WeekSplit[];
      setUserSplit(userSplit);
    }
  }, [user]);
  return (
    <View className='relative'>
      {currUser?.id !== user.id && (
        <View className='px-6 absolute z-50 w-52 h-52 justify-between'>
          <BackButton navigation={navigation} />
        </View>
      )}
      <View className='w-full h-72 rounded-[50px] overflow-hidden justify-end'>
        <View className='z-50 p-4'>
          <Text className='text-white font-MontserratRegular text-lg mb-2'>
            {user.age}
          </Text>
          <Text className='text-white font-MontserratBold text-4xl'>
            {user.firstName}
          </Text>
          <Text className='text-white font-MontserratBold text-4xl'>
            {user.lastName}
          </Text>
          <View className='flex-row items-center mb-2'>
            <MapPin color='#CCC9C9' weight='regular' size={14} />
            <Text className='text-secondaryWhite font-MontserratRegular text-md'>
              {gym?.name}
            </Text>
          </View>
        </View>
        <LinearGradient
          pointerEvents='none'
          colors={['rgba(0,0,0,1)', 'rgba(0,0,0,0)']}
          className='absolute bottom-0 left-0 z-40 w-full h-full'
          locations={[0, 0.5]}
          start={[0, 1]}
          end={[1, 0]}
        />
        <Image
          source={{ uri: user.images[0] }}
          className='w-full h-full absolute top-0 left-0 object-cover'
        />
      </View>
      <ScrollView className='mt-2 mb-52'>
        <View className='my-4'>
          <UserPrompt answer={recentPrompt} prompt={prompt} />
        </View>
        <ProfileInfoSection title='About'>
          <Text className='text-md text-secondaryWhite font-MontserratRegular'>
            {user.bio}
          </Text>
        </ProfileInfoSection>
        {user.tags.length > 0 && (
          <ProfileInfoSection title='Favorite Movements'>
            <View className='flex-row flex-wrap'>
              {user.tags &&
                user.tags.map((tag, idx) => (
                  <View
                    key={idx}
                    className='mr-2 my-1 bg-primaryDark px-6 py-2 rounded-full'
                  >
                    <Text className='text-white text-md font-MontserratMedium'>
                      {transformTag(tag)}
                    </Text>
                  </View>
                ))}
            </View>
          </ProfileInfoSection>
        )}
        {userSplit.length > 0 && (
          <Split
            split={userSplit}
            isEditable={user.id === currUser?.id}
            navigation={navigation}
          />
        )}
      </ScrollView>
    </View>
  );
}
