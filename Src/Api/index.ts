import { IBook, IChapter } from "../Model";
import { DefaultPageSize } from "../Util";

const BASE_URL = 'https://www.bqgns.com';

const GET_CATEGRORY = 'api/query/get_list';
const GET_BOOK_LIST = 'api/query/get_book_list';

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
  return response.json();
};

const getCategoryBook = async (classString: string, page: number = 1): Promise<IBook[]> => {
  const path = GET_CATEGRORY;
  const params = {
    class: classString,
    size: DefaultPageSize,
    page: page,
  };
  try {
    const response = await GET(path, params);
    if (response.code === 0) {
      return [];
    }
    return response.data.list;
  } catch (error) {
    return [];
  } finally {

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
  try {
    const response = await GET(path, params);
    if (response.code === 0) {
      return [];
    }
    return response.data.list;
  } catch (error) {
    return [];
  } finally {

  }
  // return GET(path, params);
}

export default {
  getCategoryBook,
  getBookListApi,
}
