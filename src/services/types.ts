export enum Vote {
  like = "like",
  dislike = "dislike",
  notSeen = "not seen",
}

export type Method = "GET" | "POST";

export interface RequestOptions {
  method: Method;
  endpoint: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

export interface RoomConfig {
  years: [number, number];
  genres: string[];
  votingDuration: number;
}

export interface RoomCreateData {
  room_id: string;
}

export interface RecommendationsData {
  topMovies: number[];
  movieTitles: Record<number, string>;
  userQueues: Record<number, number[]>;
}

export interface UserCreateData {
  user_id: string;
}

export interface UserVoteData {
  status: "seeding_complete" | "seeding" | "user_seeding_complete";
}

export interface MovieData {
  movie_id: string;
  title: string;
  year: number;
}

export interface RoomStatusData {
  config: {
    genres: number[];
    voting_duration?: string;
    years: number[];
  };
  remainingTime?: number;
  roomId: string;
  seedingComplete: boolean;
  users: User[];
  votingStarted: boolean;
}

export interface User {
  id: number;
  name: string;
}
