"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosResponse } from "axios";
import { RoomCreateData } from "@/services/types";
import { makeRequest } from "@/services/helpers";
import { useUser } from "@/contexts/UserContexts";
import { BannerStatus } from "@/app/components/BannerStatus";

const genres = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance"];

export default function CreateRoom() {
  const [timerDuration, setTimerDuration] = useState(60);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [yearMin, setYearMin] = useState(2022);
  const [yearMax, setYearMax] = useState(2023);
  const [userName, setUserName] = useState<string>("");
  const router = useRouter();
  const { setUser, setStatus, status } = useUser();

  const createUser = async (roomId: string) => {
    const res = await makeRequest({
      method: "POST",
      endpoint: "/api/enhanced/createUser",
      data: { userName, roomId },
    });
    setUser({ id: res.data.user_id, name: userName });
    setStatus("Waiting");
    router.push(`/room/${roomId}`);
  };

  const updateRoomConfig = async (roomId: string) => {
    const years = Array.from(
      { length: yearMax - yearMin },
      (_, i) => i + yearMin,
    );
    await makeRequest({
      method: "POST",
      endpoint: "/api/enhanced/updateRoomConfig",
      data: {
        roomId,
        years,
        genres: selectedGenres,
        votingDuration: timerDuration,
      },
    });
  };

  const createRoomAndAddUser = async () => {
    const res: AxiosResponse<RoomCreateData> = await makeRequest({
      method: "POST",
      endpoint: "/api/enhanced/createRoom",
    });
    const currentRoomId = res.data.room_id;
    await updateRoomConfig(currentRoomId);
    await createUser(currentRoomId);
    router.push(`/room/${currentRoomId}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRoomAndAddUser();
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <BannerStatus status={status} />
      <h1 className="text-3xl font-bold mb-8">Create a Room</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-xl font-bold mb-4">Users</h2>
          <label className="block mb-2">Your Name</label>
          <input
            type="string"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="input-primary w-full"
            required
          />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Room Configuration</h2>
          <label className="block mb-2">Timer Duration (seconds)</label>
          <input
            type="number"
            value={timerDuration}
            onChange={(e) => setTimerDuration(Number(e.target.value))}
            className="input-primary w-full"
            min="30"
            max="600"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Select Genres</label>
          <div className="grid grid-cols-2 gap-2">
            {genres.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => toggleGenre(genre)}
                className={`btn-secondary ${selectedGenres.includes(genre) ? "bg-blue-500" : ""}`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
        <div className="flex space-x-4">
          <div>
            <label className="block mb-2">Year Min</label>
            <input
              type="number"
              value={yearMin}
              onChange={(e) => setYearMin(Number(e.target.value))}
              className="input-primary w-full"
              min="1900"
              max={yearMax}
              required
            />
          </div>
          <div>
            <label className="block mb-2">Year Max (Inclusive)</label>
            <input
              type="number"
              value={yearMax}
              onChange={(e) => setYearMax(Number(e.target.value))}
              className="input-primary w-full"
              min={yearMin}
              max={new Date().getFullYear()}
              required
            />
          </div>
        </div>
        <button type="submit" className="btn-primary w-full">
          Create Room
        </button>
      </form>
    </div>
  );
}
