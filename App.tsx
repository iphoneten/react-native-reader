/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import RootNav from './Src/Navigation/RootNav';

function App() {

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootNav />
      </NavigationContainer>
    </SafeAreaProvider>

  );
}

export default App;
