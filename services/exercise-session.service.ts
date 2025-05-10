// src/services/exerciseSession.service.ts

import { ApiResponse } from "../utils/types/Api.types";
import { ExerciseSessionType } from "../utils/types/ExerciseSession.types";

const _URL = process.env.EXPO_PUBLIC_API_URL;

/**
 * Récupère la liste paginée des sessions d'exercice.
 */
export const getExerciseSessions = async (): Promise<ApiResponse<ExerciseSessionType[]>> => {
  try {
    const res = await fetch(`${_URL}exercise-user`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    if (!res.ok) throw new Error(`Erreur ${res.status}`);
    return (await res.json()) as ApiResponse<ExerciseSessionType[]>;
  } catch (e) {
    console.error("getExerciseSessions:", e);
    throw e;
  }
};

/**
 * Récupère une session d'exercice par son ID.
 */
export const getExerciseSession = async (
  id: number
): Promise<ApiResponse<ExerciseSessionType>> => {
  try {
    const res = await fetch(`${_URL}exercise-user/${id}`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    if (!res.ok) throw new Error(`Erreur ${res.status}`);
    return (await res.json()) as ApiResponse<ExerciseSessionType>;
  } catch (e) {
    console.error("getExerciseSession:", e);
    throw e;
  }
};

/**
 * Crée une nouvelle session d'exercice.
 */
export const createExerciseSession = async (
  newSession: Omit<ExerciseSessionType, "id">
): Promise<ApiResponse<ExerciseSessionType>> => {
  try {
    const res = await fetch(`${_URL}exercise-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(newSession),
    });
    if (!res.ok) throw new Error(`Erreur ${res.status}`);
    return (await res.json()) as ApiResponse<ExerciseSessionType>;
  } catch (e) {
    console.error("createExerciseSession:", e);
    throw e;
  }
};

/**
 * Met à jour une session d'exercice existante.
 */
export const updateExerciseSession = async (
  id: number,
  changes: Partial<Omit<ExerciseSessionType, "id">>
): Promise<ApiResponse<ExerciseSessionType>> => {
  try {
    const res = await fetch(`${_URL}exercise-user/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(changes),
    });
    if (!res.ok) throw new Error(`Erreur ${res.status}`);
    return (await res.json()) as ApiResponse<ExerciseSessionType>;
  } catch (e) {
    console.error("updateExerciseSession:", e);
    throw e;
  }
};

/**
 * Supprime une session d'exercice.
 */
export const deleteExerciseSession = async (
  id: number
): Promise<ApiResponse<null>> => {
  try {
    const res = await fetch(`${_URL}exercise-user/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`Erreur ${res.status}`);
    return (await res.json()) as ApiResponse<null>;
  } catch (e) {
    console.error("deleteExerciseSession:", e);
    throw e;
  }
};
