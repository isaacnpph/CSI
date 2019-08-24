import React, { Component, Fragment } from "react";
import { Button, Menu, Segment, Sidebar, Container } from "semantic-ui-react";
import PropTypes from "prop-types";
import ChatMessage from "./ChatMessage";

const ChatSideBar = ({ animation, direction, visible }) => (
  <Sidebar
    as={Menu}
    animation={animation}
    direction={direction}
    icon="labeled"
    vertical
    visible={visible}
    width="thin"
  >
    <ChatMessage />
  </Sidebar>
);

ChatSideBar.propTypes = {
  animation: PropTypes.string,
  direction: PropTypes.string,
  visible: PropTypes.bool
};

export default class ChatTransitions extends Component {
  state = {
    animation: "overlay",
    direction: "right",
    visible: false
  };

  handleAnimationChange = animation => () =>
    this.setState(prevState => ({ animation, visible: !prevState.visible }));

  handleDirectionChange = direction => () =>
    this.setState({ direction, visible: false });

  render() {
    const { animation, direction, visible } = this.state;
    return (
      <Fragment>
        <Container className="main container">
          <Sidebar.Pushable as={Segment}>
            <ChatSideBar
              animation={animation}
              direction={direction}
              visible={visible}
            />
            <Button onClick={this.handleAnimationChange("overlay")}>
              Chat
            </Button>

            <Sidebar.Pusher>
              <SessionView />
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </Container>
      </Fragment>
    );
  }
}
