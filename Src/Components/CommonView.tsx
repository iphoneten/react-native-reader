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
    <View style={{ flex: 1 }}>
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={{ backgroundColor: "#fff" }}
      >
        <View style={styles.container}>
          <View style={styles.leftside}>
            {back ? (
              <TouchableOpacity onPress={handleBack}>
                <Image
                  style={{ width: 20, height: 20 }}
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
      <View style={{ flex: 1, backgroundColor: '#eee' }}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
});

export default CommonView;