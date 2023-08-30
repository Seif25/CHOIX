import { Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { SocketWithAuth } from "src/polls/types/types";

export const createTokenMiddleware = 
(
    jwtService: JwtService, logger: Logger
) => (socket: SocketWithAuth, next: any) => {
    const token = socket.handshake.auth.token || socket.handshake.headers['token'];

    logger.log(`Validating auth token, ${token}`);

    try {
        const payload = jwtService.verify(token);
        socket.voterID = payload.sub;
        socket.pollID = payload.pollID;
        socket.name = payload.name;
        next();
    } catch (e) {
        next(new Error("Invalid auth token"))
    }
}