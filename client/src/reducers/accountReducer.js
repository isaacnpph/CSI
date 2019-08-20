import {
  GET_USER,
  ACCOUNT_ERROR,
  CLEAR_USER,
  SESSION_CREATED,
  GET_SESSIONS,
  CLEAR_SESSIONS,
  SESSION_DELETED,
  USER_REMOVED_FROM_SESSION
} from "../actions/types";

const initialState = {
  user: null,
  sessions: [],
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_USER:
      return {
        ...state,
        user: payload,
        loading: false
      };
    case SESSION_CREATED:
      return {
        ...state,
        sessions: [payload, ...state.sessions],
        loading: true
      };
    case GET_SESSIONS:
      return {
        ...state,
        sessions: payload,
        loading: false
      };
    case CLEAR_SESSIONS:
      return {
        user: null,
        sessions: [],
        loading: true
      };
    case USER_REMOVED_FROM_SESSION:
    case SESSION_DELETED:
      return {
        ...state,
        sessions: state.sessions.filter(sessions => sessions._id !== payload)
      };
    case ACCOUNT_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case CLEAR_USER:
      return {
        ...state,
        user: null,
        sessions: [],
        loading: true
      };
    default:
      return state;
  }
}
