import { Request } from "express"
import { Suggestion } from "shared";
import { Socket } from "socket.io";

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

export type AddVoterFields = {
    pollID: string;
    voterID: string;
    name: string;
}

export type RemoveVoterFields = {
    voterID: string;
    pollID: string;
}

export type AddSuggestionFields = {
    pollID: string;
    voterID: string;
    text: string;
}

export type SubmitRankingsFields = {
    pollID: string;
    voterID: string;
    rankings: string[];
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

export type AddSuggestionData = {
    pollID: string;
    suggestionID: string;
    suggestion: Suggestion
}

export type AddRankingData = {
    pollID: string;
    voterID: string;
    rankings: string[];
}

// Guard Types
export type AuthPayload = {
    voterID: string;
    pollID: string;
    name: string;
}

export type RequestWithAuth = Request & AuthPayload
export type SocketWithAuth = Socket & AuthPayload