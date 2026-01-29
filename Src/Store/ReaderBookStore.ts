import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IBook, IChapter } from '../Model';

interface IReaderBookState {
  books: IBook[]; // 书架列表
  historty: {
    [key: number]: {
      chapterId: number;
      page: number;
    }
  };
  bookChapterList: {
    [key: number]: IChapter[]
  }
  setBook: (book: IBook) => void;
  removeBook: (book: IBook) => void;
  setHistorty: (bookId: number, chapterId: number, page: number) => void;
  setBookChapterList: (bookId: number, chapterList: IChapter[]) => void
}

export const useReaderBookStore = create<IReaderBookState>()(
  persist(
    (set) => ({
      books: [],
      historty: {},
      bookChapterList: {},
      setBook: (book: IBook) =>
        set((state) => ({ books: [...state.books, book] })),
      removeBook: (book: IBook) =>
        set((state) => ({ books: state.books.filter((item) => item.id !== book.id) })),
      setHistorty: (bookId: number, chapterId: number, page: number) =>
        set((state) => ({ historty: { ...state.historty, [bookId]: { chapterId, page } } })),
      setBookChapterList: (bookId, chapterList) =>
        set((state) => ({ bookChapterList: { ...state.bookChapterList, [bookId]: chapterList } })),
    }),
    {
      name: 'readerBookStore',
      storage: createJSONStorage(() => AsyncStorage),
      // partialize: (state) => ({ books: state.books }), // 只存储books
    }
  )
);