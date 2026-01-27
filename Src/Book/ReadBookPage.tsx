import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableNativeFeedback, GestureResponderEvent, LayoutChangeEvent, ScrollView, TouchableOpacity, Image } from "react-native";
import { IBookContent, RootStackParamList } from "../Model";
import Api from "../Api";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import images from "../images";

type ReadBookRouteProp = RouteProp<RootStackParamList, 'ReadBook'>;
const { width, height } = Dimensions.get("window");

const FONT_SIZE = 20;
const LINE_HEIGHT = 24;
const PADDING_VERTICAL = 40; // top + bottom padding in container
const ReadBookPage = () => {
  const route = useRoute<ReadBookRouteProp>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [bookContent, setBookContent] = useState<IBookContent>();
  const [showHeader, setShowHeader] = useState(true);
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [containerHeight, setContainerHeight] = useState(height - PADDING_VERTICAL - 100 - insets.top - insets.bottom - (showHeader ? 50 : 0));
  const { book, chapter, chapterList } = route.params;
  const [currentChapterId, setCurrentChapterId] = useState(chapter.chapter_id);
  useEffect(() => {
    Api.getBookContentApi(book.id, currentChapterId).then(res => {
      setBookContent(res);
      setCurrentPage(0);
    })
  }, [book, currentChapterId]);

  useEffect(() => {
    if (bookContent?.text) {
      const content = stripHtml(bookContent.text);
      const newPages = paginateContent(content);
      setPages(newPages);
      setCurrentPage(0);
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
    // Calculate number of lines per page with a safety factor to avoid last line cut off
    const safetyFactor = 0.9;
    const linesPerPage = Math.floor(containerHeight / (LINE_HEIGHT + 6) * safetyFactor);
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
      // 左翻页
      if (currentPage > 0) {
        const nextPage = currentPage - 1;
        setCurrentPage(nextPage);
        setShowHeader(false);
      }
      if (currentPage === 0 && currentChapterId > 1) {
        setCurrentChapterId(currentChapterId - 1);
      }
    } else if (touchX > 2 * third) {
      // 右翻页
      console.log(currentPage, pages.length);
      if (currentPage < pages.length - 1) {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        setShowHeader(false);
      }
      if (currentPage === pages.length - 1 && currentChapterId < chapterList?.length) {
        setCurrentChapterId(currentChapterId + 1);
      }
    } else {
      // 中间区域，显示/隐藏 Header
      setShowHeader(prev => !prev);
    }
  }

  const onContainerLayout = (event: LayoutChangeEvent) => {
    const layoutHeight = event.nativeEvent.layout.height;
    if (layoutHeight !== containerHeight) {
      setContainerHeight((layoutHeight));
    }
  }

  const handleBack = () => {
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.container}>
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
          </View>
        </View>
      )}
      <View style={[styles.container]}>
        <TouchableNativeFeedback
          onPress={onPressArea}
          onLayout={onContainerLayout}
        >
          <View style={[styles.container, styles.bookContainer]}>
            {currentPage === 0 && (
              <Text style={styles.titleText}>{bookContent?.tit}</Text>
            )}
            <ScrollView style={{ flex: 1, width: '100%' }} scrollEnabled={false} showsVerticalScrollIndicator={false}>
              <Text style={styles.content}>{pages[currentPage] || ''}</Text>
            </ScrollView>
          </View>
        </TouchableNativeFeedback>
        <View style={styles.bottomView}>
          <Text>{`${book.title}--${bookContent?.tit}`}</Text>
          <Text style={styles.pageNumber}>{pages.length > 0 ? `${currentPage + 1} / ${pages.length}` : ''}</Text>
        </View>
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
    justifyContent: 'center',
    paddingHorizontal: 20,
    // paddingVertical: 20,
    backgroundColor: '#eee',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    fontSize: FONT_SIZE,
    fontWeight: '500',
    lineHeight: LINE_HEIGHT,
    // marginTop: 10,
    textAlign: 'left',
    flex: 1,
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
    paddingLeft: 10,
  },
  rightSide: {
    width: width / 3,
    alignItems: "flex-end",
    paddingRight: 10,
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
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    padding: 8
  },
});

export default ReadBookPage;