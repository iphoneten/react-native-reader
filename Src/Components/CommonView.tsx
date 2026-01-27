import { useNavigation } from "@react-navigation/native";
import React, { ReactNode, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image, Dimensions } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import images from './../images';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface IProps {
  title?: string;
  back?: boolean;
  leftView?: React.ReactNode;
  rightView?: React.ReactNode;
  onBackPress?: () => void;
  children?: ReactNode;
  showHeader?: boolean
}

const deviceWidth = Math.round(Dimensions.get('window').width);
const CommonView: React.FC<IProps> = ({
  title = '详情',
  back = true,
  leftView,
  rightView,
  onBackPress,
  children,
  showHeader = true,
}) => {

  const navigation = useNavigation();
  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };
  const insets = useSafeAreaInsets();
  const opacity = useSharedValue(showHeader ? 1 : 0);
  useEffect(() => {
    opacity.value = withTiming(showHeader ? 1 : 0, { duration: 200 });
  });
  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: withTiming(opacity.value ? 0 : -50) }],
  }));
  return (
    <View style={styles.container}>
      {showHeader && (
        <Animated.View style={[styles.headerSafeArea, animatedHeaderStyle]}>
          <SafeAreaView
            edges={["top", "left", "right"]}
            style={styles.headerContainerWrapper}
          >
            <View style={[styles.headerContainer]}>
              <View style={styles.leftside}>
                {back ? (
                  <TouchableOpacity onPress={handleBack}>
                    <Image
                      style={styles.backImage}
                      source={images.backIcon}
                    />
                  </TouchableOpacity>
                ) : (
                  leftView
                )}
              </View>

              <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
              </View>

              <View style={styles.rightSide}>{rightView}</View>
            </View>
          </SafeAreaView>
        </Animated.View>
      )}
      <View style={[styles.childrenContainer, !showHeader && { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerSafeArea: {
    backgroundColor: "#fff",
  },
  headerContainerWrapper: {
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    height: 50,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  leftside: {
    width: deviceWidth / 3,
    paddingLeft: 10,
  },
  rightSide: {
    width: deviceWidth / 3,
    alignItems: "flex-end",
    paddingRight: 10,
  },
  titleContainer: {
    width: deviceWidth / 3,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  backText: {
    fontSize: 16,
    color: "#007aff",
  },
  backImage: {
    width: 20,
    height: 20,
  },
  childrenContainer: {
    flex: 1,
    backgroundColor: '#eee'
  },
});

export default CommonView;