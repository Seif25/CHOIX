type SuggestionID = string;

export type Voters = {
  [voterID: string]: string;
};

export type Suggestions = {
  [suggestionID: SuggestionID]: Suggestion;
};

export type Rankings = {
  [voterID: string]: SuggestionID[];
};

export type Poll = {
  id: string;
  topic: string;
  votesPerVoter: number;
  voters: Voters;
  adminID: string;
  votingStarted: boolean;
  suggestions: Suggestions;
  rankings: Rankings;
  results: Results;
  ended: boolean;
};

export type Suggestion = {
  voterID: string;
  text: string;
};

export type Results = Array<{
    suggestionID: SuggestionID;
    text: string;
    score: number;
  }>;
