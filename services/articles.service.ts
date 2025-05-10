import { useConntedUser } from "../utils/ConnectedUserContext";
import { ApiResponse } from "../utils/types/Api.types";
import { Article } from "../utils/types/Articles.types";

const _URL = process.env.EXPO_PUBLIC_API_URL;

export const getArticles = async (
  page: number = 1,
  pageSize: number = 50
): Promise<
  ApiResponse<Article[]> | undefined
> => {
  try {
    const response = await fetch(`${_URL}article?page=${page}&perPage=${pageSize}`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const getArticle = async (
  id: string
): Promise<ApiResponse<Article> | undefined> => {
  try {
    const response = await fetch(`${_URL}article/${id}`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const getUserArticle = async (
  citizenId: string
): Promise<ApiResponse<Article> | undefined> => {
  try {
    const response = await fetch(`${_URL}article/citizen/${citizenId}`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const createArticle = async (
  data: any
): Promise<ApiResponse<Article> | undefined> => {
  try {
    const response = await fetch(`${_URL}article`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const updateArticle = async (
  articleId: string,
  data: any
): Promise<ApiResponse<Article> | undefined> => {
  try {
    const response = await fetch(`${_URL}article/${articleId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const deleteArticle = async (
  articleId: string
): Promise<ApiResponse<Article> | undefined> => {
  try {
    const response = await fetch(`${_URL}article/${articleId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};
