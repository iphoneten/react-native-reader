import React, { } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { IBook, RootStackParamList } from "../Model";
import { useNavigation } from "@react-navigation/native";
import BookItem from "../Components/BookItem";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useReaderBookStore } from "../Store/ReaderBookStore";

type HomeNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;
const HomePage = () => {
  const navigation = useNavigation<HomeNavProp>();
  const myBooks = useReaderBookStore(state => state.books);

  const onPressBook = (item: IBook) => {
    navigation.navigate('BookDetail', { book: item });
  };

  const _renderItem = ({ item }: { item: IBook }) => {
    return (
      <BookItem
        book={item}
        onPressItem={onPressBook}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={myBooks}
        renderItem={_renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default HomePage;