/* eslint-disable react/react-in-jsx-scope */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { makeRequest } from "@/services/helpers";
import { AxiosResponse } from "axios";
import { useUser } from "@/contexts/UserContexts";
import {
  MovieData,
  RoomStatusData,
  UserVoteData,
  Vote,
} from "@/services/types";
import { BannerStatus } from "@/app/components/BannerStatus";

export default function Movies() {
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [currentMovie, setCurrentMovie] = useState<MovieData>();
  const router = useRouter();
  const { id: roomId } = useParams();
  const [isLoading, setLoading] = useState(true);
  const { user, status, setStatus } = useUser();
  const [shouldStartPollingRoom, setShouldStartPollingRoom] = useState(false);

  const getRoomStatus = useCallback(async () => {
    const response: AxiosResponse<RoomStatusData> = await makeRequest({
      method: "GET",
      endpoint: `/api/enhanced/getRoomStatus?roomId=${roomId}`,
    });
    if (response.data.seedingComplete) {
      setStatus("Voting");
      setShouldStartPollingRoom(false);
      setTimeLeft(Number(response.data.config.voting_duration));
    }
  }, [roomId, setStatus]);

  const getNextMovie = useCallback(async () => {
    const res: AxiosResponse<MovieData> = await makeRequest({
      method: "GET",
      endpoint: `/api/enhanced/getNextMovie?userId=${user.id}`,
    });
    setCurrentMovie(res.data);
  }, [user.id]);

  useEffect(() => {
    if (shouldStartPollingRoom) {
      const intervalId = setInterval(getRoomStatus, 3000);
      return () => clearInterval(intervalId);
    }
  }, [getRoomStatus, shouldStartPollingRoom]);

  useEffect(() => {
    if (status === "Voting") {
      if (timeLeft > 0) {
        const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timerId);
      } else {
        router.push("/recommendations");
      }
    }
  }, [timeLeft, router, status]);

  useEffect(() => {
    if (!currentMovie) {
      setLoading(true);
      getNextMovie();
      setLoading(false);
    }
  }, [currentMovie, getNextMovie]);

  const handleVote = async (vote: Vote) => {
    switch (status) {
      case "Voting":
        await makeRequest({
          method: "POST",
          endpoint: "/api/enhanced/vote",
          data: { userId: user.id, movieId: currentMovie?.movie_id, vote },
        });
        setCurrentMovie(undefined);
        break;
      case "Seeding":
        const res: AxiosResponse<UserVoteData> = await makeRequest({
          method: "POST",
          endpoint: "/api/enhanced/vote",
          data: { userId: user.id, movieId: currentMovie?.movie_id, vote },
        });
        setCurrentMovie(undefined);
        if (res.data.status === "user_seeding_complete") {
          setStatus("Waiting");
          setShouldStartPollingRoom(true);
        } else if (res.data.status === "seeding_complete") {
          setStatus("Voting");
          setShouldStartPollingRoom(false);
        }
        break;
      default:
        throw new Error("Invalid status");
    }
  };

  const movieDiv = (
    <div className="text-center mt-16">
      <h2 className="text-3xl font-bold mb-4">{currentMovie?.title || ""}</h2>
      <h4 className="text-l font-bold mb-4">
        Year: {currentMovie?.year || ""}
      </h4>
      <div className="flex justify-center space-x-4">
        <button onClick={() => handleVote(Vote.like)} className="btn-primary">
          Like
        </button>
        <button
          onClick={() => handleVote(Vote.dislike)}
          className="btn-secondary"
        >
          Dislike
        </button>
        <button
          onClick={() => handleVote(Vote.notSeen)}
          className="btn-secondary"
        >
          Not seen
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <BannerStatus status={status} />
      {status === "Voting" && !isLoading ? (
        <div className="fixed top-0 left-0 w-full bg-gray-800 p-4">
          <div className="max-w-md mx-auto flex justify-between items-center">
            <span className="text-xl font-bold">Time left: {timeLeft}s</span>
            <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-pink-500"
                style={{ width: `${(timeLeft / 60) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      ) : null}
      {isLoading ? (
        <div>Loading...</div>
      ) : status === "Voting" || status === "Seeding" ? (
        movieDiv
      ) : null}
    </div>
  );
}
