import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IBook } from '../Model';

interface IReaderBookStore {
  books: IBook[];
  setBook: (book: IBook) => void;
  removeBook: (book: IBook) => void;
}

export const useReaderBookStore = create<IReaderBookStore>()(
  persist(
    (set) => ({
      books: [],
      setBook: (book: IBook) => set((state) => ({ books: [...state.books, book] })),
      removeBook: (book: IBook) => set((state) => ({ books: state.books.filter((item) => item.id !== book.id) })),
    }),
    {
      name: 'readerBookStore',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ books: state.books }),
    }
  )
);