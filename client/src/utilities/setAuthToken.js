import axios from "axios";

// A function that checks if there is a token in the local storage
// and if there is one in it the function adds it to a global header.
const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common["x-auth-token"] = token;
  } else {
    delete axios.defaults.headers.common["x-auth-token"];
  }
};

export default setAuthToken;
