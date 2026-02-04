import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import RootNav from "./RootNav";
import { useColorScheme } from "react-native";

export const RootNavContainer = () => {
  const scheme = useColorScheme();
  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNav />
    </NavigationContainer>
  );
};

