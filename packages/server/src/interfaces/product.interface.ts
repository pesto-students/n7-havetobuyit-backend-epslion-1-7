import { User } from './user.interface';

export enum AvailableReactions {
  Happy = 'happy',
  Neutral = 'neutral',
  Sad = 'sad',
}

export interface Reaction {
  user: User;
  reaction: AvailableReactions;
}

export interface Review {
  byUser: User;
  title: string;
  description: string;
  rating: number;
  images: string[];
}

export enum ProductStatus {
  Draft = 'Draft',
  InReview = 'InReview',
  Published = 'Published',
}

export interface Product {
  title: string;
  description: string;
  images: string[];
  postedBy: User;
  postedAt: Date;
  status: ProductStatus;
  reactions: Reaction[];
  reviews: Review[];
  overallRating: number;
}

export interface PublishProductPayload {
  productId: string;
}
