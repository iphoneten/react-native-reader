import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IBook } from '../Model';
import Api from '../Api';

interface IReaderBookState {
  books: IBook[];
  bookList: IBook[];
  setBook: (book: IBook) => void;
  removeBook: (book: IBook) => void;
  fetchBooks: (classString: string, page: number) => void;
}

export const useReaderBookStore = create<IReaderBookState>()(
  persist(
    (set) => ({
      books: [],
      bookList: [],
      setBook: (book: IBook) => set((state) => ({ books: [...state.books, book] })),
      removeBook: (book: IBook) => set((state) => ({ books: state.books.filter((item) => item.id !== book.id) })),
      fetchBooks: async (classString: string, page: number) => {
        const res = await Api.getCategoryBook(classString, page);
        if (page === 1) {
          set({ bookList: res });
        } else {
          set((state) => ({ bookList: [...state.bookList, ...res] }));
        }
      },
    }),
    {
      name: 'readerBookStore',
      storage: createJSONStorage(() => AsyncStorage),
      // partialize: (state) => ({ books: state.books }), // 只存储books
    }
  )
);