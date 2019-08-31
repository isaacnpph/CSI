import {
    SOCKET_INIT
} from "../actions/types";

const initialState = {
    socket_connected:false,
    socket: null,
}

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case SOCKET_INIT:
            return {
                ...state,
                socket:payload,
                socket_connected:true
            }

        default:
            return state;
    }
}