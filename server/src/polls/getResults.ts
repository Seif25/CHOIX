import { Suggestions, Rankings, Results } from "shared";

export default (
  rankings: Rankings,
  suggestions: Suggestions,
  votesPerVoter: number
): Results => {
  /* 
***
    1. CALCULATE THE WEIGHT OF EACH VOTE 
****
*/

  const scores: { [suggestionID: string]: number } = {};

  Object.values(rankings).forEach((voterRanking) => {
    voterRanking.forEach((suggestionID, index) => {
      const voteWeight = votesPerVoter - index;

      scores[suggestionID] = (scores[suggestionID] ?? 0) + voteWeight;
    });
  });

/* 
***
    2. MERGE THE WEIGHT OF EACH VOTE WITH THE SUGGESTION TEXT & ID
****
*/

  const results = Object.entries(scores).map(([suggestionID, score]) => ({
    suggestionID,
    text: suggestions[suggestionID].text,
    score,
  }));

/* 
***
    3. SORT RANKINGS IN DESCENDING ORDER
****
*/

  results.sort((a, b) => b.score - a.score);

  return results
};
