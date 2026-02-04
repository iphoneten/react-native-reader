import React, { } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { IBook, RootStackParamList } from "../Model";
import { useNavigation } from "@react-navigation/native";
import BookItem from "../Components/BookItem";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useReaderBookStore } from "../Store/ReaderBookStore";
import { useAppTheme } from "../Util/theme";

type HomeNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;
const HomePage = () => {
  const theme = useAppTheme();
  const navigation = useNavigation<HomeNavProp>();
  const myBooks = useReaderBookStore(state => state.books);
  const readHistory = useReaderBookStore(state => state.historty);
  const setHistorty = useReaderBookStore(state => state.setHistorty);
  const onPressBook = (item: IBook) => {
    const bookId = item.id;
    const history = readHistory[bookId || 0];
    console.log('history', history);
    if (!history) {
      setHistorty(bookId || 0, 1, 0);
    }
    navigation.navigate('ReadBook', { book: item, chapter: { chapter_id: history?.chapterId || 1, tit: '' }, chapterList: [] });
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
    <View style={
      [styles.container, { backgroundColor: theme.background }]
    }>
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