import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableNativeFeedback, GestureResponderEvent, LayoutChangeEvent, TouchableOpacity, Image } from "react-native";
import { IBookContent, ScreenProps } from "../Model";
import Api from "../Api";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import images from "../images";
import { useReaderBookStore } from "../Store/ReaderBookStore";

type ReadBookScreenProps = ScreenProps<'ReadBook'>;
const { width, height } = Dimensions.get("window");
const FONT_SIZE = 20;
const LINE_HEIGHT = 24;
const PADDING_VERTICAL = 40; // top + bottom padding in container
const BOTTOM_BAR_HEIGHT = 30;
const ReadBookPage: React.FC<ReadBookScreenProps> = ({
  route,
  navigation
}) => {
  const { book } = route.params;
  const insets = useSafeAreaInsets();
  const {
    historty,
    setHistorty,
  } = useReaderBookStore();
  const bookHistory = historty[book.id];
  const [bookContent, setBookContent] = useState<IBookContent>();
  const [showHeader, setShowHeader] = useState(false);
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(bookHistory?.page || 0);
  const [containerHeight, setContainerHeight] = useState(height - PADDING_VERTICAL - 100 - insets.top - insets.bottom - (showHeader ? 50 : 0) - BOTTOM_BAR_HEIGHT);
  const [currentChapterId, setCurrentChapterId] = useState(bookHistory?.chapterId || 1);
  const [isLoading, setIsLoading] = useState(false);

  const [isRightPage, setIsRightPage] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    Api.getBookContentApi(book.id, bookHistory.chapterId).then(res => {
      setBookContent(res);
      setIsLoading(false);
    })
  }, [book, bookHistory?.chapterId]);

  useEffect(() => {
    setHistorty(book.id, currentChapterId, currentPage);
  }, [currentPage, currentChapterId, setHistorty, book.id])

  useEffect(() => {
    if (bookContent?.text) {
      const content = stripHtml(bookContent.text);
      const newPages = paginateContent(content);
      setPages(newPages);
      if (isRightPage) {
        setCurrentPage(newPages.length - 1);
      } else {
        setCurrentPage(bookHistory?.page || 0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookContent, containerHeight]);

  useEffect(() => {
    if (showHeader) {
      const timer = setTimeout(() => {
        setShowHeader(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showHeader]);

  // Strip HTML function unchanged
  const stripHtml = (html: string): string => {
    let text = html;
    // 段落换行
    text = text.replace(/<\/p>/gi, '\n\n');
    // <br> 换行
    text = text.replace(/<br\s*\/?>/gi, '\n');
    // 列表 li 转•
    text = text.replace(/<li>(.*?)<\/li>/gi, '• $1\n');
    // 去掉所有其他 HTML 标签
    text = text.replace(/<[^>]+>/g, '');
    // &nbsp; → 空格
    text = text.replace(/&nbsp;/g, ' ');
    // 压缩多余空格，但保留换行
    text = text.split('\n').map(line => line.replace(/\s+/g, ' ').trim()).join('\n');
    // 保留段落之间的空行
    return text.trim();
  }

  const paginateContent = useCallback((content: string): string[] => {
    // RN 字体 ascent / descent 在 Android 下存在像素偏差，必须预留 1 行
    const linesPerPage = Math.max(
      1,
      Math.floor(containerHeight / LINE_HEIGHT)
    );
    // Split content into lines by \n
    const lines = content.split('\n');
    const tempPages: string[] = [];
    let currentLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      currentLines.push(lines[i]);
      if (currentLines.length === linesPerPage) {
        tempPages.push(currentLines.join('\n'));
        currentLines = [];
      }
    }
    if (currentLines.length > 0) {
      tempPages.push(currentLines.join('\n'));
    }
    return tempPages;
  }, [containerHeight]);

  const onPressArea = (event: GestureResponderEvent) => {
    const touchX = event.nativeEvent.locationX;
    const third = width / 3;

    if (touchX < third) {
      if (showHeader) {
        setShowHeader(false);
        return;
      };
      // 左翻页
      if (currentPage > 0) {
        const nextPage = currentPage - 1;
        setCurrentPage(nextPage);
        setShowHeader(false);
      }
      if (currentPage === 0 && bookHistory?.chapterId > 1) {
        const preChapterId = bookHistory.chapterId - 1;
        setIsRightPage(true);
        setCurrentChapterId(preChapterId);
      }
    } else if (touchX > 2 * third) {
      // 右翻页
      if (showHeader) {
        setShowHeader(false);
        return;
      };
      if (currentPage < pages.length - 1) {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        setShowHeader(false);
      }
      if (currentPage === pages.length - 1) {
        const nextChapterId = bookHistory.chapterId + 1;
        setIsRightPage(false);
        setCurrentChapterId(nextChapterId);
        setCurrentPage(0);
      }
    } else {
      // 中间区域，显示/隐藏 Header
      setShowHeader(prev => !prev);
    }
  }

  const onContainerLayout = (event: LayoutChangeEvent) => {
    const layoutHeight = event.nativeEvent.layout.height;
    const effectiveHeight = layoutHeight - BOTTOM_BAR_HEIGHT - insets.bottom - insets.top;
    if (effectiveHeight !== containerHeight) {
      setContainerHeight(effectiveHeight);
    }
  }

  const handleBack = () => {
    navigation.goBack();
  }

  const onPressBookDetail = () => {
    navigation.navigate('BookDetail', { book: book });
  }

  return (
    <SafeAreaView style={styles.container} >
      {(
        <View style={{ position: 'absolute', top: insets.top, zIndex: 1 }} >
          <View style={[styles.headerContainer, { opacity: showHeader ? 1 : 0 }]}>
            <View style={styles.leftside}>
              {(
                <TouchableOpacity onPress={handleBack}>
                  <Image
                    style={styles.backImage}
                    source={images.backIcon}
                  />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{book.title}</Text>
            </View>
            <View style={styles.rightSide}>
              <TouchableOpacity
                onPress={onPressBookDetail}
              >
                <View>
                  <Image
                    style={styles.backImage}
                    source={images.moreIcon}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      <View style={[styles.container]}>
        <TouchableNativeFeedback
          onPress={onPressArea}
          onLayout={onContainerLayout}
        >
          {isLoading ?
            (
              <View style={styles.container} />
            ) : (
              <View style={[styles.container, styles.bookContainer]}>
                {currentPage === 0 && (
                  <Text style={styles.titleText}>{bookContent?.tit}</Text>
                )}
                <View style={{ width: '100%' }}>
                  <Text style={styles.content}>{pages[currentPage] || ''}</Text>
                </View>
              </View>
            )
          }
        </TouchableNativeFeedback>
        {(
          <View style={styles.bottomView}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginLeft: 16 }}>
              <Text>{`${book.title}--${bookContent?.tit}`}</Text>
              <Text style={styles.pageNumber}>{pages.length > 0 ? `${currentPage + 1} / ${pages.length}` : ''}</Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
  },
  bookContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: '#eee',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  content: {
    fontSize: FONT_SIZE,
    // fontWeight: '500',
    lineHeight: LINE_HEIGHT,
    textAlign: 'left',
    includeFontPadding: false,
    paddingBottom: 6,
  },
  pageNumber: {
    fontSize: 14,
    color: '#888',
    marginLeft: 10
  },
  headerContainer: {
    width: width,
    flexDirection: "row",
    height: 50,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  leftside: {
    width: width / 3,
    paddingLeft: 16,
  },
  rightSide: {
    width: width / 3,
    alignItems: "flex-end",
    paddingRight: 16,
  },
  titleContainer: {
    width: width / 3,
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
  backImage: {
    width: 20,
    height: 20,
  },
  bottomView: {
    height: BOTTOM_BAR_HEIGHT
  },
});

export default ReadBookPage;