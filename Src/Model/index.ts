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