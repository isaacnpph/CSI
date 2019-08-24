import axios from "axios";
import {
  USER_REGISTERED,
  USER_NOT_REGISTERED,
  USER_LOADED,
  AUTHORISATION_ERROR,
  LOGIN_SUCCESSFUL,
  LOGIN_UNSUCCESSFUL,
  LOGOUT,
  CLEAR_USER,
  CLEAR_SESSION
} from "./types";
import setAuthToken from "../utilities/setAuthToken";

// Load User
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get("/api/auth");
    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTHORISATION_ERROR
    });
  }
};

// user registration
export const registerUser = ({ name, email, password }) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post("/api/users", body, config);
    dispatch({
      type: USER_REGISTERED,
      payload: res.data
    });
    dispatch(loadUser());
  } catch (err) {
    dispatch({
      type: USER_NOT_REGISTERED
    });
  }
};

// login user
export const loginUser = (email, password) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post("/api/auth", body, config);
    dispatch({
      type: LOGIN_SUCCESSFUL,
      payload: res.data
    });
    dispatch(loadUser());
  } catch (err) {
    dispatch({
      type: LOGIN_UNSUCCESSFUL
    });
  }
};

// logout
export const logout = () => dispatch => {
  dispatch({ type: CLEAR_SESSION });
  dispatch({ type: LOGOUT });
  dispatch({ type: CLEAR_USER });
};
