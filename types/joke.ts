import type { Rating } from "@/types/rating";

export interface Joke {
  id: string;
  text: string;
  category: string;
  ratings: Rating[];
  averageRating?: number;
}
