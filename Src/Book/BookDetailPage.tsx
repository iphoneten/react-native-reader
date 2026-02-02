import React, { useEffect, useRef } from "react";
import { FlatList, Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import CommonView from "../Components/CommonView";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { IBook, IChapter, RootStackParamList } from "../Model";
import Api from "../Api";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useReaderBookStore } from "../Store/ReaderBookStore";

type BookDetailRouteProp = RouteProp<
  RootStackParamList,
  "BookDetail"
>;

type BookDetailNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "BookDetail"
>;
const BookDetailPage = () => {
  const route = useRoute<BookDetailRouteProp>();
  const navigation = useNavigation<BookDetailNavigationProp>();
  const book = route.params?.book;
  const chapterList = useReaderBookStore(state => state.bookChapterList)[book?.id || 0];
  const setBookChapterList = useReaderBookStore(state => state.setBookChapterList);
  const myBooks = useReaderBookStore(state => state.books);
  const setBook = useReaderBookStore(state => state.setBook);
  const removeBook = useReaderBookStore(state => state.removeBook);
  const setHistorty = useReaderBookStore(state => state.setHistorty);
  const readHistory = useReaderBookStore(state => state.historty);
  const isInBooksheel = myBooks.find(item => item.id === book?.id);
  const history = readHistory[book?.id || 0];
  const listRef = useRef<FlatList>(null);
  useEffect(() => {
    const bookId = book?.id;
    if (bookId) {
      Api.getBookListApi(bookId).then(res => {
        setBookChapterList(bookId, res);
      });
    }
  }, [book, setBookChapterList]);

  useEffect(() => {
    if (chapterList.length > 0 && history?.chapterId) {
      const index = chapterList.findIndex(
        item => item.chapter_id === history.chapterId
      );
      if (index < 5) {
        return;
      }
      if (index >= 0) {
        requestAnimationFrame(() => {
          listRef.current?.scrollToIndex({
            index: (index - 5),
            animated: false,
          });
        });
      }
    }
  }, [chapterList, history]);

  const onClickStartRead = () => {
    if (history) {
      setHistorty(book?.id || 0, history.chapterId, history.page);
    } else {
      setHistorty(book?.id || 0, 1, 0);
    }
    const chapter = chapterList.find(item => item.chapter_id === 1) || chapterList[0];
    navigation.navigate('ReadBook', { book, chapter, chapterList });
  }

  const onPressStartRead = (chapterId: number = 1) => {
    if (history && history.chapterId === chapterId) {
      setHistorty(book?.id || 0, history.chapterId, history.page);
    } else {
      setHistorty(book?.id || 0, chapterId, 0);
    }
    const chapter = chapterList.find(item => item.chapter_id === chapterId) || chapterList[0];
    navigation.navigate('ReadBook', { book, chapter, chapterList });
  };

  const onPressAddBook = () => {
    const isInBooks = myBooks.find(item => item.id === book?.id);
    if (isInBooks) {
      removeBook(isInBooks);
      return;
    }
    setBook(book);
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
            <View style={styles.buttonView}>
              <TouchableOpacity
                style={styles.readButton}
                onPress={onClickStartRead}
              >
                <Text style={styles.readButtonText}>{history ? `继续阅读` : `开始阅读`}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.readButton, styles.addButton]}
                onPress={onPressAddBook}
              >
                <Text style={styles.readButtonText}>{isInBooksheel ? `移除书架` : `加入书架`}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };


  const _renderItem = ({ item }: { item: IChapter }) => {
    const isNowRead = history?.chapterId === item.chapter_id;
    return (
      <View>
        <TouchableOpacity
          onPress={onPressStartRead.bind(this, item.chapter_id)}
        >
          <View style={styles.chapterRow}>
            <View style={styles.chapterContent}>
              <Text style={[styles.chapterTitle, isNowRead && styles.nowReadChapterTitle]}>{item.tit}</Text>
            </View>
            {isNowRead && (
              <View>
                <Text style={styles.nowReadText}>{'正在阅读'}</Text>
              </View>
            )}
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
        ref={listRef}
        style={styles.list}
        data={chapterList}
        renderItem={_renderItem}
        keyExtractor={(item, index) => index.toString()}
        onScrollToIndexFailed={info => {
          setTimeout(() => {
            listRef.current?.scrollToIndex({
              index: info.index,
              animated: false,
            });
          }, 100);
        }}
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
    borderRadius: 10,
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
  buttonView: {
    flexDirection: 'row',
    alignItems: 'center',
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
  addButton: {
    marginLeft: 10,
  },
  readButtonText: {
    color: '#fff',
  },
  chapterRow: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: 'medium',
  },
  nowReadChapterTitle: {
    fontWeight: 'bold',
    color: 'red',
  },
  divider: {
    height: 1,
    backgroundColor: '#d5d4d4ff',
  },
  list: {
    flex: 1,
  },
  nowReadText: {
    marginLeft: 10,
    color: 'red',
  },
  chapterContent: {
    flex: 1,
  },
});