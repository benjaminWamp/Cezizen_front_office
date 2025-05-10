import { Article } from "./Articles.types";

export interface ArticleImage {
  id: number;
  path: string;
  articles: Article[];
}            