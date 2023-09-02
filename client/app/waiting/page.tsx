"use client";

import { GoCopy } from "react-icons/go";
import { FiUsers } from "react-icons/fi";
import { BsPencil } from "react-icons/bs";
import { useRef, useState } from "react";
import { useSnapshot } from "valtio";
import { actions, state } from "@/public/state/state";
import { useCopyToClipboard } from "react-use";
import { useRouter } from "next/navigation";

const Waiting = () => {
  const router = useRouter()
  const currentState = useSnapshot(state);
  const [_copiedText, copyToClipboard] = useCopyToClipboard();
  const [suggest, setSuggest] = useState(false);
  const [voters, setVoters] = useState(false);
  const [newSuggestion, setNewSuggestion] = useState("");
  const newSuggestionRef = useRef(null);

  const handleOpenSuggest = () => {
    setSuggest(true);
  };
  const handleCloseSuggest = () => {
    setSuggest(false);
  };
  const handleOpenVoters = () => {
    setVoters(true);
  };
  const handleCloseVoters = () => {
    setVoters(false);
  };
  const handleSuggestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSuggestion(e.target.value);
  };
  const handleAddNewSuggestion = () => {
    actions.addSuggestion(newSuggestion);
    setNewSuggestion("");
    if (newSuggestionRef) {
      // @ts-ignore
      newSuggestionRef.current.value = "";
    }
  };
  const handleStartVote = () => {
    actions.startVote();
    router.push('/vote')
  }
  return (
    <main className="flex flex-col items-center justify-center gap-5">
      {/* <pre>
        <code>
          {
            JSON.stringify({x: currentState.isAdmin, y: currentState.canStartVote, z: currentState.isAdmin && currentState.canStartVote}, null ,2)
          }
        </code>
      </pre> */}
      {/* TOPIC */}
      <div className="flex items-center lg:justify-center w-64 lg:w-full">
        {!voters && (
          <h3 className="font-bold text-[100%] lg:text-2xl text-[#FAF774]">
            {currentState.poll?.topic}
          </h3>
        )}
      </div>
      {/* POLL INFORMATION */}
      {!suggest && !voters ? (
        <div className="flex flex-col items-center justify-center gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between w-64">
              <h3 className="font-bold text-[100%] lg:text-2xl text-[#FAF774]">
                {currentState.poll?.id}
              </h3>
              <button
                className="text-[#FF8EA7] hover:text-black rounded-md border border-[#FF8EA7] bg-[#FF8EA7] bg-opacity-20 hover:bg-opacity-100 p-2"
                onClick={() => copyToClipboard(currentState.poll?.id || "")}
              >
                <GoCopy />
              </button>
            </div>
            <p className="italic text-xs font-bold text-[#929292] pt-2">
              Share the code with other voters.
            </p>
          </div>
          <div className="flex items-center justify-center gap-5">
            <button
              className="flex flex-col items-center justify-center gap-2 text-[#00EFFF] hover:text-black rounded-md border border-[#00EFFF] bg-[#00EFFF] bg-opacity-20 hover:bg-opacity-100 p-2 w-14"
              onClick={handleOpenVoters}
            >
              <FiUsers />
              <h3 className="text-xl">{currentState.voterCount}</h3>
            </button>
            <button
              className="flex flex-col items-center justify-center gap-2 text-[#FF8EA7] hover:text-black rounded-md border border-[#FF8EA7] bg-[#FF8EA7] bg-opacity-20 hover:bg-opacity-100 p-2 w-14"
              onClick={handleOpenSuggest}
            >
              <BsPencil />
              <h3 className="text-xl">{currentState.suggestionCount}</h3>
            </button>
          </div>
          <p className="italic text-xs font-bold text-[#929292] pt-2 lowercase">
            {
              currentState.canStartVote ? currentState.isAdmin ? "You can start the vote now" : "Waiting on admin to start the voter" : `${currentState.poll?.votesPerVoter} suggestions are needed to start the vote.`
            }
          </p>
          {currentState.isAdmin && (
            <button
              className="flex flex-col items-center justify-center gap-2 text-[#00EFFF] hover:text-black rounded-md border border-[#00EFFF] bg-[#00EFFF] bg-opacity-20 hover:bg-opacity-100 p-2 disabled:text-[#00EFFF] disabled:cursor-not-allowed disabled:bg-[#202020] w-40"
              disabled={!currentState.canStartVote}
              onClick={handleStartVote}
            >
              Start Voting
            </button>
          )}
          <button
            className="flex flex-col items-center justify-center gap-2 text-[#FBFAEE] hover:text-black rounded-md border border-[#FBFAEE] bg-[#FBFAEE] bg-opacity-20 hover:bg-opacity-100 p-2 w-40"
            onClick={() => actions.leavePoll()}
          >
            Leave Poll
          </button>
        </div>
      ) : suggest && !voters ? (
        // SUGGESTIONS
        <div className="flex flex-col items-center justify-center gap-5 rounded-md bg-[#FAF774] bg-opacity-10 w-80 h-full">
          <div className="flex items-center justify-end w-80">
            <button
              className="relative top-0 flex items-center justify-center text-[#FAF774] hover:text-black rounded-bl-md rounded-tr-md border border-[#FAF774] bg-[#FAF774] bg-opacity-20 hover:bg-opacity-100 p-2 w-7 h-7"
              onClick={handleCloseSuggest}
            >
              x
            </button>
          </div>
          <div className="flex flex-col justify-center gap-2">
            <label
              htmlFor="suggestion"
              className="text-[#FAF774] font-extrabold text-xs uppercase"
            >
              Add a Suggestion
            </label>
            <div id="suggestion" className="w-64 flex items-center">
              <input
                className="p-2 w-[85%] border border-[#FAF774] rounded-l-md text-black"
                type="text"
                placeholder="McDonald's"
                onChange={handleSuggestionChange}
                ref={newSuggestionRef}
              />
              <button
                className="flex items-center justify-center text-[#FAF774] hover:text-black rounded-r-md border border-[#FAF774] bg-[#FAF774] bg-opacity-20 hover:bg-opacity-100 text-xl w-[15%] h-full"
                onClick={handleAddNewSuggestion}
              >
                +
              </button>
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 w-64 border-t">
            <h3 className="text-[#FAF774] font-extrabold text-xs uppercase pt-5">
              Suggestions by other voters
            </h3>
            <div className="flex flex-col items-start justify-center gap-2 pb-5">
              {Object.values(currentState.poll?.suggestions || {}).map(
                (suggestion, index) => (
                  <h3
                    className="text-[#565656] font-extrabold uppercase"
                    key={`suggestion-${index + 1}`}
                  >
                    {suggestion.text}
                  </h3>
                )
              )}
            </div>
          </div>
        </div>
      ) : (
        !suggest &&
        voters && (
          // VOTERS
          <div className="flex flex-col items-center justify-center rounded-md bg-[#FAF774] bg-opacity-10 w-80 h-full">
            <div className="flex items-center justify-end w-80">
              <button
                className="relative top-0 flex items-center justify-center text-[#FAF774] hover:text-black rounded-bl-md rounded-tr-md border border-[#FAF774] bg-[#FAF774] bg-opacity-20 hover:bg-opacity-100 p-2 w-7 h-7"
                onClick={handleCloseVoters}
              >
                x
              </button>
            </div>
            <div className="flex flex-col items-start gap-2 w-64">
              <h3 className="text-[#FAF774] font-extrabold text-lg uppercase pt-5">
                voters
              </h3>
              <div className="flex flex-col items-start justify-center gap-2 pb-5">
                {Object.values(currentState.poll?.voters || {}).map(
                  (voter, index) => (
                    <h3
                      className="text-[#565656] font-extrabold uppercase"
                      key={`voter-${index + 1}`}
                    >
                      {voter}
                    </h3>
                  )
                )}
              </div>
            </div>
          </div>
        )
      )}
    </main>
  );
};

export default Waiting;
