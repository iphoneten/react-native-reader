import { create } from "zustand";
import { IBook } from "../Model";
import Api from "../Api";

interface IBookState {
  bookList: IBook[];
  fetchBooks: (classString: string, page: number) => void;
}

export const useBookStore = create<IBookState>()(
  (set) => ({
    bookList: [],
    fetchBooks: async (classString: string, page: number) => {
      const res = await Api.getCategoryBook(classString, page);
      if (page === 1) {
        set({ bookList: res });
      } else {
        set((state) => ({ bookList: [...state.bookList, ...res] }));
      }
    },
  })
);