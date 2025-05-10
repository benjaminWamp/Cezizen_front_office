import { CitizenType } from "./User.types";

export interface Message {
  id: string;
  message: string;
  updatedAt: string;
  ressourceId: string;
  citizen: Pick<CitizenType, "id" | "name" | "surname">;
}
