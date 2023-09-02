"use client";

import Link from "next/link";
import { useState } from "react";
import { MdNavigateNext } from "react-icons/md";
import { makeRequest } from "../api/api";
import { Poll } from "@/public/types/poll.types";
import { actions } from "@/public/state/state";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/joy/CircularProgress"

const CreatePoll = () => {
  const router = useRouter();

  const [limit, setLimit] = useState(1);
  const [topic, setTopic] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const fieldValidator = (): boolean => {
    if (topic.length < 1 || topic.length > 100) {
      return false;
    }

    if (name.length < 1 || name.length > 25) {
      return false;
    }

    if (limit < 1 || limit > 5) {
      return false;
    }

    return true;
  };

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

  const handleTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleCreatePoll = async () => {
    setLoading(true);
    setApiError("");

    const { data, error } = await makeRequest<{
      poll: Poll;
      accessToken: string;
    }>("/polls", {
      method: "POST",
      body: JSON.stringify({
        topic,
        name,
        votesPerVoter: limit,
      }),
    });

    if (error && error.statusCode === 400) {
      console.log("400 error", error);
      setApiError("Name & Poll Topic are both required");
    } else if (error && error.statusCode !== 400) {
      setApiError(error.messages[0]);
    } else {
      actions.initializePoll(data.poll);
      actions.setPollAccessToken(data.accessToken);
      actions.initializeSocket()
      router.push(`/waiting`);
    }
    if (data) {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center gap-5">
      {
        apiError && (
          <p className="italic text-xs fon-bold text-red-600">{apiError}</p>
        )
      }
      {/* Title */}
      <div className="flex items-center justify-between w-64">
        <h3 className="font-bold text-xl text-[#FF8EA7]">Create New Poll</h3>
        {/* START POLL */}
        <div className="flex items-center gap-3">
          <button
            className="text-[#FF8EA7] hover:text-black rounded-md border border-[#FF8EA7] bg-[#FF8EA7] bg-opacity-20 hover:bg-opacity-100 p-2 disabled:cursor-not-allowed disabled:hover:bg-opacity-20 disabled:hover:text-[#FF8EA7] flex items-center justify-center"
            disabled={!fieldValidator()}
            onClick={handleCreatePoll}
          >
            {loading ? <CircularProgress color="neutral" size="sm" thickness={1} variant="soft" /> : <MdNavigateNext />}
          </button>
        </div>
      </div>
      {/* TOPIC */}
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
          maxLength={100}
          onChange={handleTopicChange}
        />
      </div>
      {/* VOTER/ADMIN NAME */}
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
          maxLength={25}
          onChange={handleNameChange}
        />
      </div>
      {/* VOTES PER VOTER */}
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
          {/* DECREASE LIMIT */}
          <button
            className="flex items-center justify-center p-2 w-10 h-10 border border-[#FF8EA7] rounded-md text-[#FF8EA7] hover:bg-[#FF8EA7] hover:bg-opacity-20 text-lg disabled:cursor-not-allowed disabled:bg-[#202020]"
            onClick={decreaseLimit}
            disabled={limit === 1}
          >
            -
          </button>
          <h3 className="text-2xl text-[#FAF774] font-bold">{limit}</h3>
          {/* INCREASE LIMIT */}
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
