import axios from "axios";
import { QUERY_ADDED, QUERY_ERROR, GET_QUERIES_BY_SESSION_ID } from "./types";

// add a query
export const addQuery = (keyword, sessionId) => async dispatch => {
  try {
    const res = await axios.post(`/api/queries/${sessionId}`, { keyword });
    dispatch({
      type: QUERY_ADDED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: QUERY_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// get queries by session id
export const getQueriesBySessionId = sessionId => async dispatch => {
  try {
    const res = await axios.get(`/api/queries/session_queries/${sessionId}`);
    dispatch({
      type: GET_QUERIES_BY_SESSION_ID,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: QUERY_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
