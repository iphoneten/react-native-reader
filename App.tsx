/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import GlobalLoadingMask from './Src/Components/GlobalLoadingMask';
import { RootNavContainer } from './Src/Navigation';

function App() {
  return (
    <SafeAreaProvider>
      <RootNavContainer />
      <GlobalLoadingMask />
    </SafeAreaProvider>
  );
}

export default App;
