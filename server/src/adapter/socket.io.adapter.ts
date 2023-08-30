import { INestApplicationContext, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { Server, ServerOptions } from "socket.io";
import { SocketWithAuth } from "../polls/types/types";
import { createTokenMiddleware } from "../middleware/token.middleware";

export class SocketIOAdapter extends IoAdapter{
    private readonly logger = new Logger(SocketIOAdapter.name);
    constructor(
        private app: INestApplicationContext,
        private configService: ConfigService
    ){
        super(app);
    }
    
    createIOServer(port: number, options?: ServerOptions): any {
        const clientPort = parseInt(this.configService.get("CLIENT_PORT"));

        const cors = {
            origin: [
                `http://localhost:${clientPort}`,
                new RegExp(`/^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):${clientPort}$/`),
            ]
        }

        this.logger.log("Configuring Socket.io with custom cors options", {cors})

        const optionsWithCORS: ServerOptions = {
            ...options,
            cors
        }

        const jwtService = this.app.get(JwtService);

        const server: Server = super.createIOServer(port, optionsWithCORS);
        server.of('polls').use(createTokenMiddleware(jwtService, this.logger));

        return server;
    }
}

