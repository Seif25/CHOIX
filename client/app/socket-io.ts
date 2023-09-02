import { AppActions, AppState } from "@/public/state/state";
import { Socket, io } from "socket.io-client";

export const socketIOUrl = `http://${process.env.API_HOST}:${process.env.API_PORT}/${process.env.POLLS_NAMESPACE}`

type CreateSocketOptions = {
    socketIOUrl: string;
    state: AppState;
    actions: AppActions
}

export const createSocketWithHandlers = ({
    socketIOUrl,
    state,
    actions
}: CreateSocketOptions): Socket => {
    const socket = io(
        socketIOUrl, {
            auth: {
                token: state.accessToken
            },
            transports: ['websocket', 'polling']
        }
    )
    socket.on('connect', () => {
        console.log(`Connected to ${socket.id}`)
        actions.setSocketConnected(socket.connected)
    })
    socket.on('connect_error', () => {
        actions.addWsError({
            type: "Connection Error",
            message: 'Failed to Connect to Poll',
        })
    })
    socket.on('exception', (error) => {
        console.log("WS Exception", error)
        actions.addWsError(error)
    })
    socket.on('poll_updated', (poll) => {
        console.log("Poll Updated")
        actions.updatePoll(poll)
    })

    return socket
}