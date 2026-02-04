import { RouteProp, NavigationProp } from '@react-navigation/native';

export type ScreenProps<T extends keyof RootStackParamList> = {
  route: RouteProp<RootStackParamList, T>;
  navigation: NavigationProp<RootStackParamList, T>;
};

export type RootStackParamList = {
  Home: undefined;
  Discover: undefined;
  Mine: undefined;
  BookDetail: {
    book: IBook;
  };
  ReadBook: {
    book: IBook;
    chapter: IChapter;
    chapterList: IChapter[];
  };
};

export interface IBook {
  id: number;
  class_id: number;
  title: string;
  author: string;
  imgUrl: string;
  des: string;
  update_content: string;
  update_id: number;
  update_time: string;
  state: number;
  click: number;
}

export interface IChapter {
  chapter_id: number;
  tit: string;
}

export interface IBookContent extends IChapter {
  text: string;
}