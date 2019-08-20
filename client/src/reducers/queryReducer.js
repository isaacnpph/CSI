import {
  QUERY_ADDED,
  QUERY_ERROR,
  GET_QUERIES_BY_SESSION_ID,
  CLEAR_QUERY
} from "../actions/types";

const initialState = {
  query: null,
  queries: [],
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_QUERIES_BY_SESSION_ID:
      return {
        ...state,
        queries: payload,
        loading: false
      };
    case QUERY_ADDED:
      return {
        ...state,
        query: payload,
        queries: [payload, ...state.queries],
        loading: false
      };
    case QUERY_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case CLEAR_QUERY:
      return {
        query: null,
        queries: [],
        loading: true
      };
    default:
      return state;
  }
}
