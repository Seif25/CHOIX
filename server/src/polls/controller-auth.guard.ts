import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { RequestWithAuth } from "./types";

@Injectable()
export class ControllerAuthGuard implements CanActivate {
    private readonly logger = new Logger(ControllerAuthGuard.name);
    constructor(private readonly jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean>{
        const request: RequestWithAuth = context.switchToHttp().getRequest();

        this.logger.debug(`Checking if request is authorized...`, request.body);

        const { accessToken } = request.body;

        try {
            const payload = this.jwtService.verify(accessToken);

            request.voterID = payload.voterID;
            request.pollID = payload.pollID;
            request.name = payload.name;
            return true;
        } catch {
            throw new ForbiddenException("Invalid access token");
        }

        return false
    }
}