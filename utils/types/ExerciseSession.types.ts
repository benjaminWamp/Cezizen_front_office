import { UserType } from "./User.types";
import { ExerciseType } from "./Exercise.types";

export interface ExerciseSessionType {
  id: string;
  notes?: string;
  endDate: Date;
  user: UserType;
  userId: number;
  exercise: ExerciseType;
  exerciseId: number;createdAt: Date;
  updatedAt: Date;
}
