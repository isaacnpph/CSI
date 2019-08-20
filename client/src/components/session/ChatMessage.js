import React, { Fragment } from "react";
import { connect } from "react-redux";
// import PropTypes from "prop-types";

const ChatMessage = () => {
  return (
    <Fragment>
      <p>Chat message</p>
    </Fragment>
  );
};

// ChatMessage.propTypes = {};
export default connect()(ChatMessage);
