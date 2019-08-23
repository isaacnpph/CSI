import axios from "axios";
import {
  GET_USER,
  ACCOUNT_ERROR,
  USER_LOADED,
  USER_DELETED,
  SESSION_CREATED,
  GET_SESSIONS,
  SESSION_DELETED,
  CLEAR_SESSION
} from "./types";

// get current user
export const getCurrentUser = () => async dispatch => {
  try {
    const res = await axios.get("/api/users/me");
    dispatch({ type: CLEAR_SESSION });
    dispatch({
      type: GET_USER,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: ACCOUNT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// edit personal details
export const editPersonalDetails = (formData, history) => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-type": "application/json"
      }
    };

    const res = await axios.put("/api/users/edit", formData, config);
    dispatch({
      type: GET_USER,
      payload: res.data
    });
    dispatch({
      type: USER_LOADED,
      payload: res.data
    });

    history.push("/account");
  } catch (err) {}
};

// delete user
export const deleteAccount = () => async dispatch => {
  if (
    window.confirm(
      "Are you sure you want to delete your account? This action can NOT be undone!"
    )
  ) {
    try {
      await axios.delete("/api/users");

      // dispatch({ type: CLEAR_USER });
      dispatch({ type: USER_DELETED });
    } catch (err) {
      dispatch({
        type: ACCOUNT_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};

// get sessions by user id
export const getSessions = () => async dispatch => {
  try {
    const res = await axios.get("/api/sessions/user");
    dispatch({
      type: GET_SESSIONS,
      payload: res.data
    });
  } catch (err) {
    if(err.response != undefined){
      dispatch({
        type: ACCOUNT_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
    else {
      dispatch({
        type: ACCOUNT_ERROR,
        payload: { msg: 'unknown', status: 400 }
      });
    }
  }
};

// create a session
export const createSession = formData => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-type": "application/json"
      }
    };

    const res = await axios.post("/api/sessions", formData, config);

    dispatch({
      type: SESSION_CREATED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: ACCOUNT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// delete a session
export const deleteSession = id => async dispatch => {
  if (
    window.confirm(
      "Are you sure you want to delete this session? This action can NOT be undone!"
    )
  ) {
    try {
      const res = await axios.delete(`/api/sessions/${id}`);
      dispatch({
        type: SESSION_DELETED,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: ACCOUNT_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};


export const updateDeleteSession = data => async dispatch => {
  try {
    dispatch({
      type: SESSION_DELETED,
      payload: data
    });
  } catch (err) {
    dispatch({
      type: ACCOUNT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}