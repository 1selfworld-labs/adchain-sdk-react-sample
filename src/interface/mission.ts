export interface MissionItem {
  id?: string;
  imageUrl: string;
  brandText: string;
  titleText: string;
  rewardsText: string;
  url: string;
  isCompleted?: boolean;
  isInprogress?: boolean;
  type?: string;
}
