import { useNavigation } from "@react-navigation/native";
import React, { ReactNode } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import images from './../images';
interface IProps {
  title?: string;
  back?: boolean;
  leftView?: React.ReactNode;
  rightView?: React.ReactNode;
  onBackPress?: () => void;
  children?: ReactNode
}

const deviceWidth = Math.round(Dimensions.get('window').width);
const CommonView: React.FC<IProps> = ({
  title = '详情',
  back = true,
  leftView,
  rightView,
  onBackPress,
  children
}) => {

  const navigation = useNavigation();
  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={styles.headerSafeArea}
      >
        <View style={styles.headerContainer}>
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
      <View style={styles.childrenContainer}>
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