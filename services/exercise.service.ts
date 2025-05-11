// src/services/exerciseSession.service.ts

import { ApiResponse } from "../utils/types/Api.types";
import { ExerciseType } from "../utils/types/Exercise.types";

const _URL = process.env.EXPO_PUBLIC_API_URL;

/**
 * Récupère la liste paginée des sessions d'exercice.
 */
export const getExercises = async (
  page?: number,
  perPage?: number
): Promise<ApiResponse<ExerciseType[]>> => {
  try {
    let url = `${_URL}exercise`;
    if (page != null && perPage != null) {
      url += `?page=${page}&perPage=${perPage}`;
    }
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    if (!res.ok) throw new Error(`Erreur ${res.status}`);
    
    return (await res.json()) as ApiResponse<ExerciseType[]>;
  } catch (e) {
    console.error("getExercises:", e);
    throw e;
  }
};

/**
 * Récupère une session d'exercice par son ID.
 */
export const getExercise = async (
  id: number
): Promise<ApiResponse<ExerciseType>> => {
  try {
    const res = await fetch(`${_URL}exercise/${id}`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    if (!res.ok) throw new Error(`Erreur ${res.status}`);
    return (await res.json()) as ApiResponse<ExerciseType>;
  } catch (e) {
    console.error("getExercise:", e);
    throw e;
  }
};

/**
 * Crée une nouvelle session d'exercice.
 */
export const createExercise = async (
  newExercise: Omit<ExerciseType, "id">
): Promise<ApiResponse<ExerciseType>> => {
  try {
    const res = await fetch(`${_URL}exercise`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(newExercise),
    });
    if (!res.ok) throw new Error(`Erreur ${res.status}`);
    return (await res.json()) as ApiResponse<ExerciseType>;
  } catch (e) {
    console.error("createExercise:", e);
    throw e;
  }
};

/**
 * Met à jour une session d'exercice existante.
 */
export const updateExercise = async (
  id: number,
  changes: Partial<Omit<ExerciseType, "id">>
): Promise<ApiResponse<ExerciseType>> => {
  try {
    const res = await fetch(`${_URL}exercise/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(changes),
    });
    if (!res.ok) throw new Error(`Erreur ${res.status}`);
    return (await res.json()) as ApiResponse<ExerciseType>;
  } catch (e) {
    console.error("updateExercise:", e);
    throw e;
  }
};

/**
 * Supprime une session d'exercice.
 */
export const deleteExercise = async (
  id: number
): Promise<ApiResponse<null>> => {
  try {
    const res = await fetch(`${_URL}exercise/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`Erreur ${res.status}`);
    return (await res.json()) as ApiResponse<null>;
  } catch (e) {
    console.error("deleteExercise:", e);
    throw e;
  }
};
