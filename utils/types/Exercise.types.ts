import { ExerciseSessionType } from "./ExerciseSession.types";

export interface ExerciseType {
  id: number;
  label: string;
  times: string;
    description: string;
    inspiration: number;
    expiration: number;
    apnea: number
    sessions: ExerciseSessionType[];

}
