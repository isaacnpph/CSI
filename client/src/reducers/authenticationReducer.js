import {
  USER_REGISTERED,
  USER_NOT_REGISTERED,
  USER_LOADED,
  AUTHORISATION_ERROR,
  LOGIN_SUCCESSFUL,
  LOGIN_UNSUCCESSFUL,
  LOGOUT,
  USER_DELETED
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload
      };
    case USER_REGISTERED:
    case LOGIN_SUCCESSFUL:
      localStorage.setItem("token", payload.token);
      localStorage.setItem("user_id", payload.user_id);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false
      };
    case USER_NOT_REGISTERED:
    case AUTHORISATION_ERROR:
    case LOGIN_UNSUCCESSFUL:
    case LOGOUT:
    case USER_DELETED:
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null
      };
    default:
      return state;
  }
}
