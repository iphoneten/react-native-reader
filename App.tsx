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
import GlobalLoadingMask from './Src/Components/GlobalLoadingMask';

function App() {

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootNav />
      </NavigationContainer>
      <GlobalLoadingMask />
    </SafeAreaProvider>

  );
}

export default App;
