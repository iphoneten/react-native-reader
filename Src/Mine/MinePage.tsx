import React from "react";
import { Image, Text, View, StyleSheet, ScrollView } from "react-native";
import images from "../images";

const MinePage = () => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.headerView}>
          <Image
            style={styles.avatar}
            source={images.default}
          />
          <Text style={styles.name}>{'🐢乌鬼的黑头'}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  headerView: {
    marginTop: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: 'bold',
  }
});

export default MinePage;