export interface QuizResponse {
  success: boolean;
  titleText?: string;
  completedImageUrl?: string;
  completedImageWidth?: number;
  completedImageHeight?: number;
  events: QuizItem[];
  message?: string;
}

export interface QuizItem {
  id?: string;
  imageUrl: string;
  titleText: string;
  rewardsText: string;
  url: string;
  isCompleted?: boolean;
}
