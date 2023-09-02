import React from "react";

type TokenPayload = {
  iat: number;
  exp: number;
  sub: string;
  name: string;
  pollID: string;
};

export const getTokenPayload = (accessToken: string): TokenPayload =>
  JSON.parse(atob(accessToken.split(".")[1]));
