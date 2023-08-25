import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center gap-10">
      <Link href="/create">
        <button className="p-2 w-40 border border-[#FF97AB] rounded-md text-[#FF97AB] hover:bg-[#FF97AB] hover:bg-opacity-20">
          Create New Poll
        </button>
      </Link>
      <Link href="/join">
        <button className="p-2 w-40 border border-[#00F3F0] rounded-md text-[#00F3F0] hover:bg-[#00F3F0] hover:bg-opacity-20">
          Join Existing Poll
        </button>
      </Link>
    </main>
  );
}
