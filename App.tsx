import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, Text, View } from 'react-native';
import { Canvas } from '@shopify/react-native-skia';

function HomeScreen({ navigation }) {
  return (
    <View className='flex justify-center items-center flex-1'>
      <Text>Test</Text>
      <Button
        onPress={() => navigation.navigate('Details')}
        title='Go to Details'
      />
    </View>
  );
}

function DetailsScreen() {
  return (
    <View className='flex justify-center items-center'>
      <Text>Details Screen</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      {/* Rest of your app code */}
      <Stack.Navigator>
        <Stack.Screen
          name='Home'
          options={{ title: 'Overview' }}
          component={HomeScreen}
        />
        <Stack.Screen name='Details' component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
