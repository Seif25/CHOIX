import { nanoid, customAlphabet } from "nanoid";

export const createPollID = customAlphabet(
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    6
)

export const createVoterID = () => nanoid();
export const createSuggestionID = () => nanoid(8);