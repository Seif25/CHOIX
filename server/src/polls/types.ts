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