import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import TabNav from "./TabNav";
import BookDetailPage from "../Book/BookDetailPage";

const stack = createNativeStackNavigator();
const RootNav = () => {
  return (
    <stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <stack.Screen name="TabNav" component={TabNav} options={{ headerShown: false }} />
      <stack.Screen name="BookDetail" component={BookDetailPage} />
    </stack.Navigator>
  );
};

export default RootNav;