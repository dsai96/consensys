import { useState, useEffect } from "react";

interface BannerStatusProps {
  status: AppStatus;
}

export type AppStatus =
  | "Initial"
  | "Waiting"
  | "Seeding"
  | "Voting"
  | "Completed";

export function BannerStatus({ status }: BannerStatusProps) {
  const [statusText, setStatusText] = useState("");
  const [bgColor, setBgColor] = useState("");

  useEffect(() => {
    switch (status) {
      case "Initial":
        setStatusText("Setting up room...");
        setBgColor("bg-orange-500");
        break;
      case "Waiting":
        setStatusText("Waiting for others...");
        setBgColor("bg-yellow-500");
        break;
      case "Seeding":
        setStatusText("Gathering user taste...");
        setBgColor("bg-green-500");
        break;
      case "Voting":
        setStatusText("Movie selection in progress");
        setBgColor("bg-blue-500");
        break;
      case "Completed":
        break;
    }
  }, [status]);

  return (
    <div
      className={`fixed top-0 left-0 w-full p-2 ${bgColor} text-white text-center font-bold animate-pulse`}
    >
      {statusText}
    </div>
  );
}
