import { WsException } from "@nestjs/websockets";

export type WSExceptionType = "Bad Request" | "Unauthorized" | "Unknown";

export class WSException extends WsException {
  readonly type: WSExceptionType;

  constructor(type: WSExceptionType, message: string | object | unknown) {
    const error = {
      type,
      message,
    };
    super(error);
    this.type = type;
  }
}

export class WsBadRequestException extends WSException {
    constructor(message: string | object | unknown) {
        super("Bad Request", message);
    }
}

export class WsUnauthorizedException extends WSException {
    constructor(message: string | object | unknown) {
        super("Unauthorized", message);
    }
}

export class WsUnknownException extends WSException {
    constructor(message: string | object | unknown) {
        super("Unknown", message);
    }
}