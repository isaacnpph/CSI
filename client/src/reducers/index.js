import { combineReducers } from "redux";
import authenticationReducer from "./authenticationReducer";
import accountReducer from "./accountReducer";
import sessionReducer from "./sessionReducer";
import socketReducer from "./socketReducer";
import queryReducer from "./queryReducer";

export default combineReducers({
  authenticationReducer,
  accountReducer,
  sessionReducer,
  socketReducer,
  queryReducer
});
