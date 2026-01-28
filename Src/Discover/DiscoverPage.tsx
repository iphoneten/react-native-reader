import React, { useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, FlatList, RefreshControl } from "react-native";
import SearchBar from "../Components/SearchBar";
import { categroyList, DefaultPageSize } from "../Util";
import { IBook, RootStackParamList } from "../Model";
import { useUIStore } from "../Store/UIStore";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import BookItem from "../Components/BookItem";
import { useReaderBookStore } from "../Store/ReaderBookStore";

type DiscoverNavProp = NativeStackNavigationProp<RootStackParamList, 'Discover'>;
const DiscoverPage = () => {
  const navigation = useNavigation<DiscoverNavProp>();
  const [currentCategory, setCurrentCategory] = React.useState(categroyList[0]);
  const [page, setPage] = React.useState(1);
  const globalLoading = useUIStore(state => state.showLoading);
  const fethcBooks = useReaderBookStore(state => state.fetchBooks);
  const bookList = useReaderBookStore(state => state.bookList);

  useEffect(() => {
    fethcBooks(currentCategory.class, page);
  }, [currentCategory, page, fethcBooks]);

  const onPressCategory = (item: any) => {
    setPage(1);
    setCurrentCategory(item);
  };

  const onLoadMore = () => {
    if (globalLoading) return;
    const count = bookList.length;
    if (count % DefaultPageSize !== 0) return;
    const nextPage = page + 1;
    setPage(nextPage);
  }

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

  const onPressSearch = (text: string) => {
    console.log('onPressSearch', text);
  }

  return (
    <View style={styles.container}>
      <SearchBar
        onPressSearch={onPressSearch}
      />
      <View style={styles.container}>
        <ScrollView
          style={styles.categoryScroll}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
        >
          {
            categroyList.map(item => {
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.tab, item.id === currentCategory.id ? styles.tabActive : styles.tabInactive]}
                  onPress={onPressCategory.bind(this, item)}
                >
                  <Text style={styles.tabText}>{item.name}</Text>
                </TouchableOpacity>
              );
            })
          }
        </ScrollView>
        <FlatList
          data={bookList}
          renderItem={_renderItem}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={globalLoading}
              onRefresh={() => {
                setPage(1);
              }}
            />
          }
          onEndReachedThreshold={0.5}
          onEndReached={onLoadMore}
        />
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
  },
  categoryScroll: {
    width: '100%',
    height: 40,
  },
  tab: {
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#339AF0',
  },
  tabInactive: {
    backgroundColor: '#999',
  },
  tabText: {
    color: '#fff',
  },
});

export default DiscoverPage;