import {
    SOCKET_INIT
} from "./types"

export const setInitialSocket = (socket) => async dispatch => {
    
    dispatch({
        type: SOCKET_INIT,
        payload:socket
    });
};

