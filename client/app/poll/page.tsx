"use client";

import { GoCopy } from "react-icons/go";
import { FiUsers } from "react-icons/fi";
import { BsPencil } from "react-icons/bs"; 

const Poll = () => {
  return (
    <main className="flex flex-col items-center justify-center gap-5">
      <div className="flex items-center lg:justify-center w-64 lg:w-full">
        <h3 className="font-bold text-[100%] lg:text-2xl text-[#FAF774]">
          What Are We Eating Today?
        </h3>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between w-64">
          <h3 className="font-bold text-[100%] lg:text-2xl text-[#FAF774]">
            Y718BK
          </h3>
          <button className="text-[#FF8EA7] hover:text-black rounded-md border border-[#FF8EA7] bg-[#FF8EA7] bg-opacity-20 hover:bg-opacity-100 p-2">
            <GoCopy />
          </button>
        </div>
        <p className="italic text-xs font-bold text-[#929292] pt-2">
          Share the code with other voters.
        </p>
      </div>
      <div className="flex items-center justify-center gap-5">
        <button className="flex flex-col items-center justify-center gap-2 text-[#00EFFF] hover:text-black rounded-md border border-[#00EFFF] bg-[#00EFFF] bg-opacity-20 hover:bg-opacity-100 p-2 w-14">
          <FiUsers />
          <h3 className="text-xl">1</h3>
        </button>
        <button className="flex flex-col items-center justify-center gap-2 text-[#FF8EA7] hover:text-black rounded-md border border-[#FF8EA7] bg-[#FF8EA7] bg-opacity-20 hover:bg-opacity-100 p-2 w-14">
          <BsPencil />
          <h3 className="text-xl">0</h3>
        </button>
      </div>
      <p className="italic text-xs font-bold text-[#929292] pt-2">
          3 suggestions are needed to start the vote.
        </p>
        <button className="flex flex-col items-center justify-center gap-2 text-[#00EFFF] hover:text-black rounded-md border border-[#00EFFF] bg-[#00EFFF] bg-opacity-20 hover:bg-opacity-100 p-2 disabled:text-[#00EFFF] disabled:cursor-not-allowed disabled:bg-[#202020] w-40" disabled>
            Start Voting
        </button>
        <button className="flex flex-col items-center justify-center gap-2 text-[#FBFAEE] hover:text-black rounded-md border border-[#FBFAEE] bg-[#FBFAEE] bg-opacity-20 hover:bg-opacity-100 p-2 w-40">
            Leave Poll
        </button>
    </main>
  );
};

export default Poll;
