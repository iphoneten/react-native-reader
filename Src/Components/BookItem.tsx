import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { IBook } from "../Model";

interface IProps {
  book: IBook;
  onPressItem?: (item: IBook) => void
}

const BookItem: React.FC<IProps> = ({
  book,
  onPressItem,
}) => {
  const item = book;
  const onPressBook = () => {
    if (onPressItem) {
      onPressItem(item);
    }
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPressBook}
      >
        <View style={styles.row}>
          <View>
            <Image
              style={styles.cover}
              source={{ uri: item.imgUrl }}
            />
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.meta}>{`作者: ${item.author}`}</Text>
            <Text style={styles.desc} numberOfLines={3}>{item.des}</Text>
            <Text style={styles.meta}>{`更新内容: ${item.update_content}`}</Text>
            <Text style={styles.meta}>{`更新时间: ${item.update_time.includes('T') ? item.update_time.split('T')[0] : item.update_time}`}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 10,
  },
  cover: {
    width: 140,
    height: 200,
    borderRadius: 10,
  },
  content: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  meta: {
    marginTop: 8,
  },
  desc: {
    marginTop: 8,
  },
});

export default BookItem;