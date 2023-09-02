"use client";

import Button from "@mui/joy/Button";

const Test = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-10 w-full h-full">
      <Button
        color="neutral"
        onClick={function () {}}
        variant="outlined"
        loading={false}
        className="uppercase"
      >
        Create New Poll
      </Button>
    </div>
  );
};

export default Test;
