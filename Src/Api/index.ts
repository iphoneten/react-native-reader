import { IBook, IBookContent, IChapter } from "../Model";
import { useUIStore } from "../Store/UIStore";
import { DefaultPageSize } from "../Util";

const BASE_URL = 'https://www.bqgns.com';

const GET_CATEGRORY = 'api/query/get_list';
const GET_BOOK_LIST = 'api/query/get_book_list';
const GET_BOOK_CONTENT = 'api/query/get_book_text';

// const POST = async (path: string, body: any) => {
//   const response = await fetch(`${BASE_URL}/${path}`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(body),
//   });
//   return response.json();
// };

const GET = async (path: string, params: any) => {
  if (params) {
    const searchParams = new URLSearchParams(params);
    path = `${path}?${searchParams.toString()}`;
  }
  console.log('[GET]:', `${BASE_URL}/${path}`);
  const response = await fetch(`${BASE_URL}/${path}`, {
    method: 'GET',
  });
  if (response.ok === false) {
    throw new Error(response.statusText);
  }
  const json = await response.json();
  console.log('[GET]:', json);
  return json;
};

const getCategoryBook = async (classString: string, page: number = 1): Promise<IBook[]> => {
  const path = GET_CATEGRORY;
  const params = {
    class: classString,
    size: DefaultPageSize,
    page: page,
  };
  useUIStore.getState().startLoading();
  try {
    const response = await GET(path, params);
    if (response.code === 0) {
      return [];
    }
    return response.data.list;
  } catch (error) {
    return [];
  } finally {
    useUIStore.getState().endLoading();
  }
};

const getBookListApi = async (bookId: number, page: number = 1): Promise<IChapter[]> => {
  const path = GET_BOOK_LIST;
  const params = {
    bookId: bookId,
    size: 9999,
    page: page,
    sort: 0,
  };
  useUIStore.getState().startLoading();
  try {
    const response = await GET(path, params);
    if (response.code === 0) {
      return [];
    }
    return response.data.list;
  } catch (error) {
    return [];
  } finally {
    useUIStore.getState().endLoading();
  }
}

const getBookContentApi = async (bookId: number, chapterId: number): Promise<IBookContent> => {
  const path = GET_BOOK_CONTENT;
  const params = {
    bookId: bookId,
    id: chapterId,
  };
  try {
    const response = await GET(path, params);
    if (response.code === 0) {
      return {} as IBookContent;
    }
    return response.data.text[0];
  } catch (error) {
    return {} as IBookContent;
  } finally {

  }
}

export default {
  getCategoryBook,
  getBookListApi,
  getBookContentApi,
}
