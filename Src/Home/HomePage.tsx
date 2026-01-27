import React, { useEffect } from "react";
import { FlatList, ScrollView, Text, TouchableOpacity, View, StyleSheet, RefreshControl } from "react-native";
import Api from "../Api";
import { categroyList, DefaultPageSize } from "../Util";
import { IBook, RootStackParamList } from "../Model";
import { useNavigation } from "@react-navigation/native";
import BookItem from "../Components/BookItem";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type HomeNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;
const HomePage = () => {
  const navigation = useNavigation<HomeNavProp>();
  const [currentCategory, setCurrentCategory] = React.useState(categroyList[0]);
  const [page, setPage] = React.useState(1);
  const [bookList, setBookList] = React.useState<IBook[]>([]);
  const [isLoading, setLoading] = React.useState(false);
  useEffect(() => {
    setLoading(true);
    Api.getCategoryBook(currentCategory.class, page).then(res => {
      if (page === 1) {
        setBookList(res);
      } else {
        setBookList(prev => [...prev, ...res]);
      }
      setLoading(false);
    });
  }, [currentCategory, page]);

  const onPressCategory = (item: any) => {
    setBookList([]);
    setPage(1);
    setCurrentCategory(item);
  };

  const onLoadMore = () => {
    if (isLoading) return;
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

  return (
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
            refreshing={isLoading}
            onRefresh={() => {
              setPage(1);
            }}
          />
        }
        onEndReachedThreshold={0.5}
        onEndReached={onLoadMore}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
})

export default HomePage;