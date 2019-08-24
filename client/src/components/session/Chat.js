import React, { Fragment } from "react";
import { connect } from "react-redux";
// import PropTypes from "prop-types";
import ChatMessage from "./ChatMessage";
import { Input } from "semantic-ui-react";

const Chat = () => {
  return (
    <Fragment>
      <ChatMessage />
      <Input fluid action="Send" placeholder="Message" />
    </Fragment>
  );
};

// ChatMessage.propTypes = {};
export default connect()(Chat);
