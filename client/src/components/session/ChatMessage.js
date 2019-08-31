import React, { Fragment } from "react";
import { connect } from "react-redux";

// import PropTypes from "prop-types";

const ChatMessage = ({ user_name, msg }) => {
  return (
    <Fragment>
      <br />
      <strong>{user_name}: </strong> {msg}
    </Fragment>
  );
};

// ChatMessage.propTypes = {};
export default connect()(ChatMessage);
