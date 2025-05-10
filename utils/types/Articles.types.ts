import { ArticleImage } from "./ArticleImage.types";
import { CommentType } from "./Comment.types";
import { Step } from "./Step.types";
import { UserType } from "./User.types";

export interface Article {
  id: number;
  label: string;
  description: string;
  content: string;
  category: {
    id: string;
    label: string;
  };
  user: UserType;
  articleImages: ArticleImage[];
}

export interface createArticle
  extends Omit<
    Article,
    | "id"
    | "file"
    | "banner"
    | "status"
    | "nbParticipant"
    | "comment"
    | "isValidate"
    | "category"
    | "typeArticle"
  > {
  step: Omit<Step[], "id">;
}
