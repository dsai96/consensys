/* eslint-disable react/react-in-jsx-scope */
"use client";

import { useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import { useUser } from "@/contexts/UserContexts";
import { makeRequest } from "@/services/helpers";
import { AxiosResponse } from "axios";
import { RecommendationsData } from "@/services/types";

export default function Recommendations() {
  const [showRecommendations, setShowRecommendations] = useState(false);
  const { user } = useUser();
  const [groupRecommendations, setGroupRecommendations] = useState<string[]>();
  const [userRecommendations, setUserRecommendations] = useState<string[]>();

  const getRecommendations = useCallback(async () => {
    const res: AxiosResponse<RecommendationsData> = await makeRequest({
      method: "GET",
      endpoint: `/api/enhanced/getRecommendations?userId=${user.id}`,
    });
    const userQueue: number[] = res.data.userQueues[user.id];
    const userRecommendations = userQueue
      ?.map((movieId: number) => {
        return res.data.movieTitles[movieId];
      })
      .filter((movie) => movie !== undefined);
    const groupRecommendations = res.data.topMovies
      .map((movieId) => {
        return res.data.movieTitles[movieId];
      })
      .filter((movie) => movie !== undefined);
    setUserRecommendations(userRecommendations);
    setGroupRecommendations(groupRecommendations);
  }, [user.id]);

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    const timer = setTimeout(() => setShowRecommendations(true), 3000);
    getRecommendations();
    return () => clearTimeout(timer);
  }, [getRecommendations]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h2 className="text-4xl mb-8 text-center">
        {showRecommendations
          ? "Here are your group's recommendations!"
          : "Generating recommendations..."}
      </h2>
      {showRecommendations && (
        <div className="w-full max-w-md space-y-4">
          {groupRecommendations?.map((movie) => (
            <div key={movie} className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h4>{movie}</h4>
            </div>
          ))}
        </div>
      )}
      <h2 className="text-4xl mb-8 text-center mt-6">
        {showRecommendations ? "Here are your personal recommendations!" : null}
      </h2>
      {showRecommendations && (
        <div className="w-full max-w-md space-y-4">
          {userRecommendations?.map((movie) => (
            <div key={movie} className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h4>{movie}</h4>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
