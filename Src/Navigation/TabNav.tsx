import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import HomePage from "../Home/HomePage";
import DiscoverPage from "../Discover/DiscoverPage";
import MinePage from "../Mine/MinePage";
import { Image, View } from "react-native";
import images from "../images";

const TabStack = createBottomTabNavigator();
const TabNav = () => {
  return (
    <TabStack.Navigator>
      <TabStack.Screen name="Home" component={HomePage} options={{
        title: '书架',
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: (props) => {
          const { focused } = props;
          return (
            <View>
              <Image
                style={{ width: 25, height: 25 }}
                source={focused ? images.bookSheelSel : images.bookSheelNor}
              />
            </View>
          );
        }
      }} />
      <TabStack.Screen name="Discover" component={DiscoverPage} options={{
        title: '发现',
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: (props) => {
          const { focused } = props;
          return (
            <View>
              <Image
                style={{ width: 25, height: 25 }}
                source={focused ? images.fundSel : images.fundNor}
              />
            </View>
          );
        }
      }} />
      <TabStack.Screen name="Mine" component={MinePage} options={{
        title: '我的',
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: (props) => {
          const { focused } = props;
          return (
            <View>
              <Image
                style={{ width: 25, height: 25 }}
                source={focused ? images.mineSel : images.mineNor}
              />
            </View>
          );
        }
      }} />
    </TabStack.Navigator>
  );
};

export default TabNav;