"use client";

import CircularProgress from "@mui/joy/CircularProgress";
import { useState } from "react";
import { MdNavigateNext } from "react-icons/md";
import { makeRequest } from "../api/api";
import { Poll } from "@/public/types/poll.types";
import { actions } from "@/public/state/state";
import { useRouter } from "next/navigation";

const Join = () => {
  const router = useRouter()

  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [apiError, setApiError] = useState("");

  const fieldValidator = (): boolean => {
    if (code.length < 1 || code.length > 6) {
      return false;
    }

    if (name.length < 1 || name.length > 25) {
      return false;
    }

    return true;
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value.toUpperCase());
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleJoinPoll = async () => {
    setLoading(true);
    setApiError("");

    const { data, error } = await makeRequest<{
        poll: Poll;
        accessToken: string;
    }>('/polls/join', {
        method: 'POST',
        body: JSON.stringify({
            pollID: code,
            name
        })
    })

    if (error && error.statusCode === 400){
        setApiError("All fields are required.")
    } else if (error && !error.statusCode) {
        setApiError("Unknown API Error")
    } else {
      actions.initializePoll(data.poll)
      actions.setPollAccessToken(data.accessToken)
      actions.initializeSocket()
        router.push(`/waiting`)
    }

    setLoading(false)
  }

  return (
    <main className="flex flex-col items-center justify-center gap-5">
        {
        apiError && (
          <p className="italic text-xs fon-bold text-red-600">{apiError}</p>
        )
      }
      <div className="flex items-center justify-between w-64">
        <h3 className="font-bold text-xl text-[#00F3F0]">Join Poll</h3>
        {/* JOIN POLL */}
        <div className="flex items-center gap-3">
          <button
            className="text-[#00F3F0] hover:text-black rounded-md border border-[#00F3F0] bg-[#00F3F0] bg-opacity-20 hover:bg-opacity-100 p-2 disabled:cursor-not-allowed disabled:hover:bg-opacity-20 disabled:hover:text-[#00F3F0] flex items-center justify-center"
            disabled={!fieldValidator()}
            onClick={handleJoinPoll}
          >
            {loading ? (
              <CircularProgress
                color="neutral"
                size="sm"
                thickness={1}
                variant="soft"
              />
            ) : (
              <MdNavigateNext />
            )}
          </button>
        </div>
      </div>
      {/* CODE */}
      <div className="flex flex-col justify-center gap-2">
        <label
          htmlFor="code"
          className="text-[#00F3F0] font-extrabold text-xs uppercase"
        >
          Poll Code
        </label>
        <input
          id="code"
          className="p-2 w-64 border border-[#00F3F0] rounded-md text-black uppercase placeholder:capitalize"
          type="text"
          placeholder="enter poll code here."
          maxLength={6}
          autoCapitalize="characters"
          onChange={handleCodeChange}
        />
      </div>
      {/* NAME */}
      <div className="flex flex-col justify-center gap-2">
        <label
          htmlFor="name"
          className="text-[#00F3F0] font-extrabold text-xs uppercase"
        >
          Name
        </label>
        <input
          id="name"
          className="p-2 w-64 border border-[#00F3F0] rounded-md text-black"
          type="text"
          placeholder="Your Name"
          maxLength={25}
          onChange={handleNameChange}
        />
      </div>
    </main>
  );
};

export default Join;
