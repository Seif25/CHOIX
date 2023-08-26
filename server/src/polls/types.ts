// Service Types
export type CreatePollFields = {
    topic: string;
    votesPerVoter: number;
    name: string;
}

export type JoinPollFields = {
    name: string;
    pollID: string;
}

export type RejoinPollFields = {
    pollID: string;
    voterID: string;
    name: string;
}
// Repository Types
export type CreatePollData = {
    pollID: string;
    topic: string;
    votesPerVoter: number;
    voterID: string;
}

export type AddVoterData = {
    pollID: string;
    voterID: string;
    name: string;
}