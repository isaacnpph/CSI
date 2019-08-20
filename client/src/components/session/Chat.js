import React, { Fragment } from "react";
import {
  Container,
  Button,
  Input,
  InputGroup,
  InputGroupAddon
} from "reactstrap";
import { connect } from "react-redux";
// import PropTypes from "prop-types";
import ChatMessage from "./ChatMessage";

const Chat = () => {
  return (
    <Fragment>
      <Container>
        <p>Chat</p>
        <ChatMessage />
        <InputGroup>
          <Input type="text" name="message" />
          <InputGroupAddon addonType="append">
            <Button color="secondary">Send</Button>
          </InputGroupAddon>
        </InputGroup>
      </Container>
    </Fragment>
  );
};

// Chat.propTypes = {};
export default connect()(Chat);
