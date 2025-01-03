"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { makeRequest } from "@/services/helpers";
import { AxiosResponse } from "axios";
import { RoomStatusData, User } from "@/services/types";
import { BannerStatus } from "@/app/components/BannerStatus";
import { useUser } from "@/contexts/UserContexts";

export default function Room() {
  const [users, setUsers] = useState<User[]>();
  const [roomStatus, setRoomStatus] = useState<RoomStatusData>();

  const router = useRouter();
  const params = useParams();
  const [isLoading, setLoading] = useState(true);
  const { status, setStatus } = useUser();
  const [copied, setCopied] = useState(false);
  const roomId = params.id;

  const getRoomStatus = useCallback(async () => {
    const response: AxiosResponse<RoomStatusData> = await makeRequest({
      method: "GET",
      endpoint: `/api/enhanced/getRoomStatus?roomId=${roomId}`,
    });
    setUsers(response.data.users);
    setRoomStatus(response.data);
    setLoading(false);
    if (response.data.votingStarted) {
      setStatus("Seeding");
      router.push(`/room/${roomId}/movies`);
    }
  }, [roomId, router, setStatus]);

  const copyRoomId = () => {
    if (!roomId) return;
    navigator.clipboard.writeText(roomId as string).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    });
  };

  function confirmStartVoting() {
    if (
      confirm("Are all users in the room? This will start voting for everyone.")
    ) {
      startSeedingForAllUsers();
    }
  }

  useEffect(() => {
    const intervalId = setInterval(getRoomStatus, 3000);
    return () => clearInterval(intervalId);
  }, [getRoomStatus, params, users]);

  const startSeedingForAllUsers = useCallback(async () => {
    await makeRequest({
      method: "POST",
      endpoint: "/api/enhanced/startVoting",
      data: { roomId },
    });
    setStatus("Seeding");
    router.push(`/room/${roomId}/movies`);
  }, [roomId, router, setStatus]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-teal to-blue">
      <BannerStatus status={status} />
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink to-red animate-pulse-scale">
          Room {params.id}
        </h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <div className="card">
              <h2 className="text-2xl font-bold mb-2">Room Number</h2>
              <div className="flex items-center gap-4 align-text-top">
                <p className="text-lg mb-2">{roomStatus?.roomId}</p>
                <button
                  onClick={copyRoomId}
                  className={`p-2 rounded-full transition-colors duration-200 ${
                    copied
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  title="Copy room ID"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {copied ? (
                      <>
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </>
                    ) : (
                      <>
                        <rect
                          x="9"
                          y="9"
                          width="13"
                          height="13"
                          rx="2"
                          ry="2"
                        ></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>
            <div className="card my-8">
              <h2 className="text-2xl font-bold mb-2">Users</h2>
              {users?.length === 0 && (
                <p className="text-lg mb-2">No users in room</p>
              )}
              <ul className="space-y-2">
                {users?.map((user: User) => (
                  <li
                    key={user.id}
                    className="flex justify-between items-center"
                  >
                    {user.name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card my-8">
              <button
                onClick={confirmStartVoting}
                className="btn-primary w-full"
              >
                Start Seeding
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
