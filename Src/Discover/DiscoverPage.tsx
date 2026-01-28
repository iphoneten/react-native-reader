import React from "react";
import { Text, View, StyleSheet, Keyboard } from "react-native";
import SearchBar from "../Components/SearchBar";

const DiscoverPage = () => {
  const onTouchEnd = () => {
    Keyboard.dismiss();
  }
  return (
    <View style={styles.container}>
      <SearchBar
      />
      <View style={styles.container} onTouchEnd={onTouchEnd}>
        <Text>发现</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  search: {
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  }
});

export default DiscoverPage;