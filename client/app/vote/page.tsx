"use client";

import { state, actions } from "@/public/state/state";
import Link from "next/link";
import { useState } from "react";
import { useSnapshot } from "valtio";

const Vote = () => {
  const currentState = useSnapshot(state);
  const [votesRemaining, setVotesRemaining] = useState(
    currentState.poll?.votesPerVoter ?? 0
  );
  const [rankings, setRankings] = useState<string[]>([]);

  const handleRankSuggestion = (suggestion: string) => {
    if (rankings.includes(suggestion)) {
      console.log("removing ", suggestion)
      setRankings(rankings.filter((r) => r !== suggestion));
      setVotesRemaining(votesRemaining + 1);
    }
    else if (!rankings.includes(suggestion) && votesRemaining > 0){
      setRankings([...rankings, suggestion]);
      setVotesRemaining(votesRemaining - 1);
    }
  };

  const handleSubmitVote = () => {
    console.log(rankings)
    actions.submitRankings(rankings)
    console.log(currentState.poll?.rankings)
  }

  return (
    <main className="flex flex-col items-center justify-center gap-5 pb-5">
      <div className="flex items-center lg:justify-center w-64 lg:w-full">
        <h3 className="font-bold text-[100%] lg:text-2xl text-[#FAF774]">
          {currentState.poll?.topic}
        </h3>
      </div>
      <div className="rounded-md bg-[#FF8EA7] bg-opacity-10 w-80 h-full">
        <div className="flex items-center justify-end w-80">
          <Link href="/">
            <button
              className="relative top-0 flex items-center justify-center text-[#FF8EA7] hover:text-black rounded-bl-md rounded-tr-md border border-[#FF8EA7] bg-[#FF8EA7] bg-opacity-20 hover:bg-opacity-100 p-2 w-7 h-7"
              // onClick={() => actions.leavePoll()}
              onClick={() => {
                setRankings([])
                setVotesRemaining(currentState.poll?.votesPerVoter ?? 0)
              }}
            >
              x
            </button>
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 pt-5">
          <h3 className="font-bold text-sm text-[#FF8EA7]">
            {`Choose Your Top ${currentState.poll?.votesPerVoter} Preferences`}
          </h3>
          <p className="text-xs text-[#929292] italic">
            {`You have ${votesRemaining} votes remaining`}
          </p>
        </div>
        <div className="flex flex-col justify-center gap-5 p-5">
          {Object.entries(currentState.poll?.suggestions || {}).map(
            (suggestion, index) => (
              <div
                className="flex items-center justify-center w-full h-11"
                key={`${suggestion[0]}`}
              >
                <button
                  className="p-2 w-[85%] border border-[#FF97AB] rounded-l-md text-[#FF97AB] hover:bg-[#FF97AB] hover:bg-opacity-20 h-full"
                  onClick={() => handleRankSuggestion(suggestion[0])}
                  disabled={votesRemaining === 0 && !rankings.includes(suggestion[0])}
                >
                  {suggestion[1].text}
                </button>
                <div className="rounded-r-md border border-[#FF97AB] flex items-center justify-center bg-[#FF97AB] bg-opacity-20 w-[15%] h-full">
                  <h3 className="text-lg text-[#FF97AB] h-full flex items-center justify-center">
                    {rankings.findIndex((r) => r === suggestion[0]) + 1}
                  </h3>
                </div>
              </div>
            )
          )}
          {/* Submit */}
          <div className="flex items-center justify-center w-full border-t">
            <button
              className="p-2 w-40 border border-[#FAF774] rounded-md text-[#FAF774] hover:bg-[#FAF774] hover:bg-opacity-20 mt-5"
              disabled={votesRemaining !== 0}
              onClick={handleSubmitVote}
            >
              Submit Vote
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Vote;
