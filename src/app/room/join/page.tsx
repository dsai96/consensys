"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { makeRequest } from "@/services/helpers";
import { useUser } from "@/contexts/UserContexts";
import { BannerStatus } from "@/app/components/BannerStatus";

export default function JoinRoom() {
  const [userName, setUserName] = useState("");
  const { setUser } = useUser();
  const [roomId, setRoomId] = useState("");
  const router = useRouter();
  const { status, setStatus } = useUser();

  const createUser = async () => {
    const res = await makeRequest({
      method: "POST",
      endpoint: "/api/enhanced/createUser",
      data: { userName, roomId },
    });
    setUser({ id: res.data.user_id, name: userName });
    setStatus("Waiting");
    router.push(`/room/${roomId}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName && roomId) {
      createUser();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <BannerStatus status={status} />
      <h1 className="text-3xl font-bold mb-8">Join a Room</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your name"
          className="input-primary w-full mb-4"
          required
        />
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter Room ID"
          className="input-primary w-full mb-4"
          required
        />
        <button type="submit" className="btn-primary w-full">
          Join Room
        </button>
      </form>
    </div>
  );
}
