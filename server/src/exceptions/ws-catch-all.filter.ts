import { ArgumentsHost, BadRequestException, ExceptionFilter, UnauthorizedException } from "@nestjs/common";
import { SocketWithAuth } from "src/polls/types/types";
import { WSException, WsBadRequestException, WsUnknownException } from "./ws-exceptions";

export class WSCatchAllFilter implements ExceptionFilter{
    catch(exception: Error, host: ArgumentsHost) {
        const socket: SocketWithAuth = host.switchToWs().getClient();

        if (exception instanceof BadRequestException) {
            const exceptionResponse = exception.getResponse() as any;

            const WsException = new WsBadRequestException(exceptionResponse['message'] ?? exceptionResponse ?? exception.name);
            socket.emit('exception', WsException.getError())
            
            return;
        }

        if (exception instanceof WSException) {
            socket.emit('exception', exception.getError())

            return;
        }

        const WsException = new WsUnknownException(exception.message ?? 'Unknown Error');
        socket.emit('exception', WsException.getError())

    }

}