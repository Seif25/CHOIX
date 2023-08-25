"use client";

import Link from "next/link";
import { useState } from "react";
import { MdNavigateNext } from "react-icons/md";

const CreatePoll = () => {
  const [limit, setLimit] = useState(1);

  const increaseLimit = () => {
    if (limit < 5) {
      setLimit(limit + 1);
    }
  };

  const decreaseLimit = () => {
    if (limit > 1) {
      setLimit(limit - 1);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center gap-5">
      {/* Title */}
      <div className="flex items-center justify-between w-64">
        <h3 className="font-bold text-xl text-[#FF8EA7]">Create New Poll</h3>
        <div className="flex items-center gap-3">
          <Link href="/poll">
            <button className="text-[#FF8EA7] hover:text-black rounded-md border border-[#FF8EA7] bg-[#FF8EA7] bg-opacity-20 hover:bg-opacity-100 p-2">
              <MdNavigateNext />
            </button>
          </Link>
        </div>
      </div>
      {/* Topic */}
      <div className="flex flex-col justify-center gap-2">
        <label
          htmlFor="topic"
          className="text-[#FAF774] font-extrabold text-xs uppercase"
        >
          Poll Topic
        </label>
        <input
          id="topic"
          className="p-2 w-64 border border-[#FAF774] rounded-md text-black"
          type="text"
          placeholder="Where are we eating today?"
        />
      </div>
      {/* Name */}
      <div className="flex flex-col justify-center gap-2">
        <label
          htmlFor="name"
          className="text-[#FAF774] font-extrabold text-xs uppercase"
        >
          Name
        </label>
        <input
          id="name"
          className="p-2 w-64 border border-[#FAF774] rounded-md text-black"
          type="text"
          placeholder="Your Name"
        />
      </div>
      {/* Limit */}
      <div className="flex flex-col items-start justify-center gap-2 w-64">
        <label
          htmlFor="voters"
          className="text-[#FAF774] font-extrabold text-xs uppercase"
        >
          Allowed Votes per Voter
        </label>
        <div
          id="voters"
          className="flex items-center justify-between gap-5 w-64"
        >
          <button
            className="flex items-center justify-center p-2 w-10 h-10 border border-[#FF8EA7] rounded-md text-[#FF8EA7] hover:bg-[#FF8EA7] hover:bg-opacity-20 text-lg disabled:cursor-not-allowed disabled:bg-[#202020]"
            onClick={decreaseLimit}
            disabled={limit === 1}
          >
            -
          </button>
          <h3 className="text-2xl text-[#FAF774] font-bold">{limit}</h3>
          <button
            className="flex items-center justify-center p-2 w-10 h-10 border border-[#FF8EA7] rounded-md text-[#FF8EA7] hover:bg-[#FF8EA7] hover:bg-opacity-20 text-lg disabled:cursor-not-allowed disabled:bg-[#202020]"
            onClick={increaseLimit}
            disabled={limit === 5}
          >
            +
          </button>
        </div>
        <p className="italic text-xs font-bold text-[#929292] pt-2">
          Each voter can have up-to 5 votes
        </p>
      </div>
    </main>
  );
};

export default CreatePoll;
