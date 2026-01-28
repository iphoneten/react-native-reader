import React, { FC } from "react";
import { View, TextInput, TouchableOpacity, Image, StyleSheet, } from "react-native";
import images from "../images";

interface IProps {
  placeholder?: string
  onPressSearch?: (text: string) => void
}

const SearchBar: FC<IProps> = ({
  placeholder = '请输入搜索内容',
  onPressSearch,
}) => {

  const [value, setValue] = React.useState<string>('');

  const onPress = () => {
    if (onPressSearch && value) {
      onPressSearch(value);
    }
  }

  const onChangeText = (text: string) => {
    setValue(text);
  }

  const onSubmitEditing = () => {
    onPress();
  }

  const onClearInput = () => {
    setValue('');
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        returnKeyLabel={'搜索'}
        returnKeyType={'search'}
        onSubmitEditing={onSubmitEditing}
        enablesReturnKeyAutomatically={value ? true : false}
      />
      <TouchableOpacity
        activeOpacity={0.5}
        disabled={!value}
        onPress={onPress}
      >
        <View>
          <Image
            style={styles.image}
            source={value ? images.fundSel : images.fundNor}
          />
        </View>
      </TouchableOpacity>
      {value && (
        <TouchableOpacity
          onPress={onClearInput}
        >
          <View style={styles.close}>
            <Image
              style={styles.closeImage}
              source={images.blueClosedIcon}
            />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
  },
  image: {
    width: 25,
    height: 25,
  },
  close: {
    marginLeft: 10,
  },
  closeImage: {
    width: 20,
    height: 20,
  }
});

export default SearchBar;

