import React, { Fragment } from "react";
import { connect } from "react-redux";

// import PropTypes from "prop-types";

const ChatMessage = () => {
  return (
    <Fragment>
      <strong>User Name: </strong> message
    </Fragment>
  );
};

// ChatMessage.propTypes = {};
export default connect()(ChatMessage);
