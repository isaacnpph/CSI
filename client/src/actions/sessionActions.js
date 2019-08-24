import axios from "axios";
import {
  GET_SESSION,
  SESSION_ERROR,
  HIGHLIGHT_SEARCH,
  REMOVE_SEARCH,
  USER_INVITED,
  USER_REMOVED_FROM_SESSION,
  UPDATE_LIKES,
  COMMENT_ADDED,
  COMMENT_DELETED,
  GET_RESULTS,
  GET_NEXTPAGE,
  GET_PREVIOUSPAGE
} from "./types";

export const getSessionById = sessionId => async dispatch => {
  try {
    const res = await axios.get(`/api/sessions/session-by-id/${sessionId}`);

    dispatch({
      type: GET_SESSION,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: SESSION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// add a search result to the list of highlighted searches
export const highlightSearch = (
  title,
  snippet,
  link,
  sessionId
) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  const body = JSON.stringify({
    title,
    snippet,
    link,
    user_id: localStorage.getItem("user_id")
  });
  try {
    const res = await axios.put(
      `/api/sessions/highlightedQueries/${sessionId}`,
      body,
      config
    );

    dispatch({
      type: GET_SESSION,
      payload: res.data
    });
    dispatch({
      type: HIGHLIGHT_SEARCH,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: SESSION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//
export const highlightSearchUpdate = data => async dispatch => {
  dispatch({
    type: GET_SESSION,
    payload: data
  });
};

// remvoe a highlighted link
export const removeHighlightedSearch = (
  sessionId,
  searchId
) => async dispatch => {
  try {
    const res = await axios.delete(
      `/api/sessions/highlightedQueries/${sessionId}/${searchId}`
    );
    dispatch({
      type: GET_SESSION,
      payload: res.data
    });
    dispatch({
      type: REMOVE_SEARCH,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: SESSION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const removeHighlightedSearchUpdate = data => async dispatch => {
  try {
    dispatch({
      type: GET_SESSION,
      payload: data
    });
    dispatch({
      type: REMOVE_SEARCH,
      payload: data
    });
  } catch (err) {
    dispatch({
      type: SESSION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// invite a user to the session
export const inviteUser = (formData, sessionId) => async dispatch => {
  const config = {
    headers: {
      "Content-type": "application/json"
    }
  };
  const body = JSON.stringify(formData);

  try {
    const res = await axios.put(
      `/api/sessions/invitedUsers/${sessionId}`,
      body,
      config
    );

    dispatch({
      type: USER_INVITED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: SESSION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// remove user from the session/leave session
export const removeUser = (email, sessionId) => async dispatch => {
  try {
    const url = `http://localhost:3000/api/sessions/invitedUsers/remove/${sessionId}/${email}`;

    const res = await axios.delete(url);
    dispatch({
      type: USER_REMOVED_FROM_SESSION,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: SESSION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const removeUserUpdate = data => async dispatch => {
  try {
    dispatch({
      type: USER_REMOVED_FROM_SESSION,
      payload: data
    });
  } catch (err) {
    dispatch({
      type: SESSION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// add like
export const addLike = (sessionId, searchId) => async dispatch => {
  try {
    const url = `http://localhost:3000/api/sessions/like/${sessionId}/${searchId}`;
    const res = await axios.put(url);

    dispatch({
      type: UPDATE_LIKES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: SESSION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// add like
export const addLikeUpdate = data => async dispatch => {
  try {
    dispatch({
      type: UPDATE_LIKES,
      payload: data
    });
  } catch (err) {
    dispatch({
      type: SESSION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// remove like
export const removeLike = (sessionId, searchId) => async dispatch => {
  try {
    const url = `http://localhost:3000/api/sessions/unlike/${sessionId}/${searchId}`;
    const res = await axios.put(url);

    dispatch({
      type: UPDATE_LIKES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: SESSION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const removeLikeUpdate = data => async dispatch => {
  try {
    dispatch({
      type: UPDATE_LIKES,
      payload: data
    });
  } catch (err) {
    dispatch({
      type: SESSION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// add comment
export const addComment = (sessionId, searchId, formData) => async dispatch => {
  const config = {
    headers: {
      "Content-type": "application/json"
    }
  };
  try {
    const url = `http://localhost:3000/api/sessions/comment/${sessionId}/${searchId}`;
    const res = await axios.post(url, formData, config);
    dispatch({
      type: COMMENT_ADDED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: SESSION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const addCommentUpdate = data => async dispatch => {
  try {
    dispatch({
      type: COMMENT_ADDED,
      payload: data
    });
  } catch (err) {
    dispatch({
      type: SESSION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// delete a comment
export const removeComment = (
  sessionId,
  searchId,
  commentId
) => async dispatch => {
  try {
    const url = `http://localhost:3000/api/sessions/comment/${sessionId}/${searchId}/${commentId}`;
    const res = await axios.delete(url);
    dispatch({
      type: COMMENT_DELETED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: SESSION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const removeCommentUpdate = data => async dispatch => {
  try {
    dispatch({
      type: COMMENT_DELETED,
      payload: data
    });
  } catch (err) {
    dispatch({
      type: SESSION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// request links from google search api
export const googleSearchApi = (query, page) => async dispatch => {
  const config = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  };

  try {
    const res = await axios.get(
      `/api/sessions/googleApi/${query}/${page}`,
      config
    );

    dispatch({
      type: GET_RESULTS,
      payload: res.data.items
    });

    dispatch({
      type: GET_NEXTPAGE,
      payload: res.data.queries.nextPage[0].startIndex
    });

    if (res.data.queries.previousPage[0] !== null) {
      dispatch({
        type: GET_PREVIOUSPAGE,
        payload: res.data.queries.previousPage[0].startIndex
      });
    }
  } catch (err) {
    // dispatch({
    //   type: SESSION_ERROR,
    //   payload: { msg: err.response.statusText, status: err.response.status }
    // });
  }
};
