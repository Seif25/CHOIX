import Link from "next/link";

const Vote = () => {
  return (
    <main className="flex flex-col items-center justify-center gap-5 pb-5">
      <div className="flex items-center lg:justify-center w-64 lg:w-full">
        <h3 className="font-bold text-[100%] lg:text-2xl text-[#FAF774]">
          What Are We Eating Today?
        </h3>
      </div>
      <div className="rounded-md bg-[#FF8EA7] bg-opacity-10 w-80 h-full">
        <div className="flex items-center justify-end w-80">
          <Link href="/">
            <button className="relative top-0 flex items-center justify-center text-[#FF8EA7] hover:text-black rounded-bl-md rounded-tr-md border border-[#FF8EA7] bg-[#FF8EA7] bg-opacity-20 hover:bg-opacity-100 p-2 w-7 h-7">
              x
            </button>
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 pt-5">
          <h3 className="font-bold text-sm text-[#FF8EA7]">
            Choose Your Top 3 Preferences
          </h3>
          <p className="text-xs text-[#929292] italic">
            You have 3 votes remaining
          </p>
        </div>
        <div className="flex flex-col justify-center gap-5 p-5">
          <div className="flex items-center justify-center w-full h-11">
            <button className="p-2 w-[85%] border border-[#FF97AB] rounded-l-md text-[#FF97AB] hover:bg-[#FF97AB] hover:bg-opacity-20 h-full">
              {"Mcdonald's"}
            </button>
            <div className="rounded-r-md border border-[#FF97AB] flex items-center justify-center bg-[#FF97AB] bg-opacity-20 w-[15%] h-full">
              <h3 className="text-lg text-[#FF97AB] h-full flex items-center justify-center">
                1
              </h3>
            </div>
          </div>
          <div className="flex items-center justify-center w-full h-11">
            <button className="p-2 w-[85%] border border-[#FF97AB] rounded-l-md text-[#FF97AB] hover:bg-[#FF97AB] hover:bg-opacity-20 h-full">
              {"Five Guys"}
            </button>
            <div className="rounded-r-md border border-[#FF97AB] flex items-center justify-center bg-[#FF97AB] bg-opacity-20 w-[15%] h-full">
              <h3 className="text-lg text-[#FF97AB] h-full flex items-center justify-center">
                -
              </h3>
            </div>
          </div>
          <div className="flex items-center justify-center w-full h-11">
            <button className="p-2 w-[85%] border border-[#FF97AB] rounded-l-md text-[#FF97AB] hover:bg-[#FF97AB] hover:bg-opacity-20 h-full">
              {"Sushi"}
            </button>
            <div className="rounded-r-md border border-[#FF97AB] flex items-center justify-center bg-[#FF97AB] bg-opacity-20 w-[15%] h-full">
              <h3 className="text-lg text-[#FF97AB] h-full flex items-center justify-center">
                3
              </h3>
            </div>
          </div>
          <div className="flex items-center justify-center w-full h-11">
            <button className="p-2 w-[85%] border border-[#FF97AB] rounded-l-md text-[#FF97AB] hover:bg-[#FF97AB] hover:bg-opacity-20 h-full">
              {"Nando's"}
            </button>
            <div className="rounded-r-md border border-[#FF97AB] flex items-center justify-center bg-[#FF97AB] bg-opacity-20 w-[15%] h-full">
              <h3 className="text-lg text-[#FF97AB] h-full flex items-center justify-center">
                2
              </h3>
            </div>
          </div>
          <div className="flex items-center justify-center w-full h-11">
            <button className="p-2 w-[85%] border border-[#FF97AB] rounded-l-md text-[#FF97AB] hover:bg-[#FF97AB] hover:bg-opacity-20 h-full">
              {"Sides"}
            </button>
            <div className="rounded-r-md border border-[#FF97AB] flex items-center justify-center bg-[#FF97AB] bg-opacity-20 w-[15%] h-full">
              <h3 className="text-lg text-[#FF97AB] h-full flex items-center justify-center">
                -
              </h3>
            </div>
          </div>
          <div className="flex items-center justify-center w-full h-11">
            <button className="p-2 w-[85%] border border-[#FF97AB] rounded-l-md text-[#FF97AB] hover:bg-[#FF97AB] hover:bg-opacity-20 h-full">
              {"Chipotle"}
            </button>
            <div className="rounded-r-md border border-[#FF97AB] flex items-center justify-center bg-[#FF97AB] bg-opacity-20 w-[15%] h-full">
              <h3 className="text-lg text-[#FF97AB] h-full flex items-center justify-center">
                -
              </h3>
            </div>
          </div>
          {/* Submit */}
          <div className="flex items-center justify-center w-full border-t">
            <button
              className="p-2 w-40 border border-[#FAF774] rounded-md text-[#FAF774] hover:bg-[#FAF774] hover:bg-opacity-20 mt-5"
              disabled
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
