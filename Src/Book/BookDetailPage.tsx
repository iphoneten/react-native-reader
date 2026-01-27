import React, { useEffect } from "react";
import { FlatList, Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import CommonView from "../Components/CommonView";
import { RouteProp, useRoute } from "@react-navigation/native";
import { IBook, IChapter, RootStackParamList } from "../Model";
import Api from "../Api";

type BookDetailRouteProp = RouteProp<
  RootStackParamList,
  "BookDetail"
>;
const BookDetailPage = () => {
  const route = useRoute<BookDetailRouteProp>();
  const book = route.params?.book;
  const [chapterList, setChapterList] = React.useState<IChapter[]>([]);
  useEffect(() => {
    console.log('book', book);
    const bookId = book?.id;
    if (bookId) {
      Api.getBookListApi(bookId).then(res => {
        console.log('getBookDetail', res);
        setChapterList(res);
      });
    }
  }, [book]);

  const onPressStartRead = (chapterId: number = 1) => {
    console.log('onPressStartRead', chapterId);
  };

  const bookInfoView = (item: IBook) => {
    return (
      <View style={styles.bookInfoContainer}>
        <View style={styles.bookRow}>
          <View>
            <Image
              style={styles.cover}
              source={{ uri: item.imgUrl }}
            />
          </View>
          <View style={styles.bookContent}>
            <Text style={styles.bookTitle}>{item.title}</Text>
            <Text style={styles.metaText}>{`作者: ${item.author}`}</Text>
            <Text style={styles.metaText} numberOfLines={3}>{item.des}</Text>
            <Text style={styles.metaText}>{`更新内容: ${item.update_content}`}</Text>
            <Text style={styles.metaText}>{`更新时间: ${item.update_time.includes('T') ? item.update_time.split('T')[0] : item.update_time}`}</Text>
            <TouchableOpacity
              style={styles.readButton}
              onPress={onPressStartRead.bind(this, 1)}
            >
              <Text style={styles.readButtonText}>{`开始阅读`}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };


  const _renderItem = ({ item }: { item: IChapter }) => {
    return (
      <View>
        <TouchableOpacity
          onPress={onPressStartRead.bind(this, item.chapter_id)}
        >
          <View style={styles.chapterRow}>
            <View>
              <Text style={styles.chapterTitle}>{item.tit}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />
      </View>
    )
  }

  return (
    <CommonView
      title={book.title}
    >
      {bookInfoView(book)}
      <FlatList
        style={styles.list}
        data={chapterList}
        renderItem={_renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </CommonView>
  );
};

export default BookDetailPage;

const styles = StyleSheet.create({
  bookInfoContainer: {},
  bookRow: {
    flexDirection: 'row',
    padding: 10,
  },
  cover: {
    width: 140,
    height: 200,
  },
  bookContent: {
    flex: 1,
    marginLeft: 10,
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  metaText: {
    marginTop: 8,
  },
  readButton: {
    marginTop: 10,
    width: 100,
    height: 40,
    backgroundColor: '#339AF0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  readButtonText: {
    color: '#fff',
  },
  chapterRow: {
    flexDirection: 'row',
    padding: 10,
  },
  chapterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#999',
  },
  list: {
    flex: 1,
  },
});