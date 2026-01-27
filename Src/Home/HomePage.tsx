import React, { useEffect } from "react";
import { FlatList, ScrollView, Text, TouchableOpacity, View, Image, StyleSheet, RefreshControl } from "react-native";
import Api from "../Api";
import { categroyList, DefaultPageSize } from "../Util";
import { IBook } from "../Model";
import { useNavigation } from "@react-navigation/native";
const HomePage = () => {
  const navigation = useNavigation();
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
        setBookList([...bookList, ...res]);
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
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={onPressBook.bind(this, item)}
        >
          <View style={{ flexDirection: 'row', padding: 10 }}>
            <View>
              <Image
                style={{ width: 140, height: 200 }}
                source={{ uri: item.imgUrl }}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item.title}</Text>
              <Text style={{ marginTop: 8 }} >{`作者: ${item.author}`}</Text>
              <Text style={{ marginTop: 8 }} numberOfLines={3}>{item.des}</Text>
              <Text style={{ marginTop: 8 }} >{`更新内容: ${item.update_content}`}</Text>
              <Text style={{ marginTop: 8 }} >{`更新时间: ${item.update_time.includes('T') ? item.update_time.split('T')[0] : item.update_time}`}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View>
      <ScrollView
        style={{ width: '100%', height: 40 }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {
          categroyList.map(item => {
            return (
              <TouchableOpacity
                key={item.id}
                style={{ ...styles.tab, backgroundColor: item.id === currentCategory.id ? '#339AF0' : '#999' }}
                onPress={onPressCategory.bind(this, item)}
              >
                <Text style={{ color: '#fff' }}>{item.name}</Text>
              </TouchableOpacity>
            );
          })
        }
      </ScrollView>
      <FlatList
        // style={{ flex: 1 }}
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
  tab: {
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#999'
  },
})

export default HomePage;