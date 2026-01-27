import React, { use, useEffect } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import CommonView from "../Components/CommonView";
import { useNavigation, useRoute } from "@react-navigation/native";
import { IBook, IChapter } from "../Model";
import Api from "../Api";

const BookDetailPage = () => {
  const route = useRoute();
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
      <View style={{}}>
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
            <TouchableOpacity
              style={{
                marginTop: 10,
                width: 100,
                height: 40,
                backgroundColor: '#999',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 12,
              }}
              onPress={onPressStartRead.bind(this, 1)}
            >
              <Text style={{}} >{`开始阅读`}</Text>
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
          <View style={{ flexDirection: 'row', padding: 10 }}>
            <View>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item.tit}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={{ height: 1, backgroundColor: '#999' }} />
      </View>
    )
  }

  return (
    <CommonView
      title={book.title}
    >
      {bookInfoView(book)}
      <FlatList
        style={{ flex: 1 }}
        data={chapterList}
        renderItem={_renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </CommonView>
  );
};

export default BookDetailPage;