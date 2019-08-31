import React, { useState } from "react";
import { Toast } from "reactstrap";
import { connect } from "react-redux";
import Chat from "./Chat";
import { Button } from "semantic-ui-react";

const ChatLauncher = ({ socket, session }) => {
  const [show, setShow] = useState(false);

  const toggle = () => {
    setShow(!show);
  };

  return (
    <div className="chatButton">
      <Button circular icon="chat" onClick={() => toggle()} />
      <div className="wrapper">
        <Toast id="toastzz" isOpen={show}>
          <Chat socket={socket} session={session} />
        </Toast>
      </div>
    </div>
  );
};

export default connect()(ChatLauncher);
