export interface Voters {
    [voterID: string]: string;
}

export interface Poll {
    id: string;
    topic: string;
    votesPerVoter: number;
    voters: Voters;
    adminID: string;
}