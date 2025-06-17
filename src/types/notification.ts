
export type NotificationType = 
  | "INCIDENT" 
  | "INSURANCE" 
  | "ITEM" 
  | "MAINTENANCE" 
  | "POSITION" 
  | "PROJECT" 
  | "TRIP" 
  | "VEHICLE" 
  | "USER" 
  | "FUEL";

export interface NotificationFull {
  id: number;
  message: string;
  isRead: boolean;
  type: NotificationType;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationUpdate {
  isRead: boolean;
}

export interface NotificationQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: string;
  isRead?: boolean;
  type?: NotificationType;
}
