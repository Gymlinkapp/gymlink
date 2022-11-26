import { Button, Text, View } from 'react-native';
import Layout from '../layouts/layout';

export default function HomeScreen({ navigation }) {
  return (
    <Layout>
      <Text>Test</Text>
      <Button
        onPress={() => navigation.navigate('Details')}
        title='Go to Details'
      />
    </Layout>
  );
}
