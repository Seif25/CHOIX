import { getTokenPayload } from "@/public/util";
import { Poll } from "shared/poll-types";
import { proxy, ref } from "valtio";
import { derive, subscribeKey } from "valtio/utils";
import { Socket } from "socket.io-client";
import { createSocketWithHandlers, socketIOUrl } from "@/app/socket-io";
import Cookies from "js-cookie";
import { nanoid } from "nanoid";

export enum AppPage {
  Welcome = "welcome",
  Create = "create",
  Join = "join",
  WaitingRoom = "waiting-room",
}

type Me = {
  id: string;
  name: string;
};

type WsError = {
  type: string;
  message: string;
};

type WsErrorUnique = WsError & {
  id: string;
};

export type AppState = {
  currentPage: AppPage;
  poll?: Poll;
  accessToken?: string;
  socket?: Socket;
  socketConnected: boolean;
  WsErrors: WsErrorUnique[];
  me?: Me;
  isAdmin: boolean;
  suggestionCount: number;
  voterCount: number;
  canStartVote: boolean;
};

const state = proxy<AppState>({
  socketConnected: false,
  WsErrors: [],
  currentPage: AppPage.Welcome,
  get me() {
    const accessToken = this.accessToken;

    if (!accessToken) return;

    const token = getTokenPayload(accessToken);

    return {
      id: token.sub,
      name: token.name,
    };
  },
  get isAdmin() {
    if (!this.me) {
      return false;
    }
    return this.me?.id === this.poll?.adminID;
  },
  get suggestionCount() {
    return Object.keys(this.poll?.suggestions || {}).length;
  },
  get voterCount() {
    return Object.keys(this.poll?.voters || {}).length;
  },
  get canStartVote() {
    const votesPerVoter = this.poll?.votesPerVoter ?? 100;
    return this.suggestionCount >= votesPerVoter;
  },
});

const actions = {
  setPage: (page: AppPage): void => {
    state.currentPage = page;
  },
  startOver: (): void => {
    actions.setPage(AppPage.Welcome);
  },
  initializePoll: (poll?: Poll): void => {
    state.poll = poll;
  },
  setPollAccessToken: (token?: string): void => {
    state.accessToken = token;
  },
  setSocketConnected: (connected: boolean): void => {
    state.socketConnected = connected;
  },
  getSocketConnected: (): boolean => {
    return state.socketConnected;
  },
  accessToken: (): boolean => {
    return !!state.accessToken;
  },
  getVotingStarted: (): boolean => {
    return state.poll?.votingStarted ?? false;
  },
  initializeSocket: async (): Promise<Socket> => {
    if (!state.socket) {
      console.log("Initializing new socket...");
      state.socket = ref(
        createSocketWithHandlers({
          socketIOUrl,
          state,
          actions,
        })
      );
    }
    if (!state.socket.connected) {
      console.log("Socket already initialized. Reconnecting...");
      state.socket.connect();
    }
    state.socketConnected = state.socket.connected;
    return state.socket;
  },
  updatePoll: (poll: Poll): void => {
    state.poll = poll;
  },
  addSuggestion: (suggestion: string): void => {
    state.socket?.emit("add_suggestion", { text: suggestion });
  },
  removeSuggestion: (id: string): void => {
    state.socket?.emit("remove_suggestion", id);
  },
  removeVoter: (id: string): void => {
    state.socket?.emit("remove_voter", id);
  },
  startVote: (): void => {
    state.socket?.emit("start_vote");
  },
  endPoll: (): void => {
    state.socket?.emit("end_poll");
  },
  deletePoll: (): void => {
    state.socket?.emit("delete_poll");
  },
  submitRankings: (rankings: string[]): void => {
    state.socket?.emit("submit_rankings", rankings);
  },
  leavePoll: (): void => {
    Cookies.remove("accessToken");
    state.socket?.disconnect();
    state.socket = undefined;
    state.poll = undefined;
    state.accessToken = undefined;
  },
  addWsError: (error: WsError): void => {
    state.WsErrors = [
      ...state.WsErrors,
      {
        ...error,
        id: nanoid(6),
      },
    ];
  },
  removeWsError: (id: string): void => {
    state.WsErrors = state.WsErrors.filter((error) => error.id !== id);
  },
};
subscribeKey(state, "accessToken", () => {
  if (state.accessToken) {
    Cookies.set("accessToken", state.accessToken);
  } else {
    Cookies.remove("accessToken");
  }
});

export type AppActions = typeof actions;

export { state, actions };
