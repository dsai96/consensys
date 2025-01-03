import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Welcome to Movie Night
      </h1>
      <div className="space-y-4 w-full max-w-md">
        <Link
          href="/room/join"
          className="btn-primary w-full block text-center"
        >
          Join a Room
        </Link>
        <Link
          href="/room/create"
          className="btn-secondary w-full block text-center"
        >
          Create a New Room
        </Link>
      </div>
    </div>
  );
}
