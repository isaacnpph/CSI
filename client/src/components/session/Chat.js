import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import ChatMessage from "./ChatMessage";
import { Input, Container } from "semantic-ui-react";
import { getCurrentUser } from "../../actions/accountActions";

const Chat = ({ socket, session, getCurrentUser, account: { user } }) => {
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("new_chat_message", data => {
      if (session._id === data.session_id) {
        setChat(prevChat => {
          return [
            ...prevChat,
            {
              user_name: data.user_name,
              msg: data.msg
            }
          ];
        });
      }
    });
  }, [socket]);

  const onIconClick = e => {
    socket.emit("chat", {
      msg: e.currentTarget.parentNode.childNodes[0].value,
      session: session._id,
      user_name: user.name
    });
    e.currentTarget.parentNode.childNodes[0].value = "";
  };

  return (
    <Fragment>
      {/* <ChatMessage user={user} /> */}
      <Container>
        {chat.map((item, index) => (
          <ChatMessage user_name={item.user_name} key={index} msg={item.msg} />
        ))}
      </Container>
      <div className="bottom">
        <Input
          style={{ width: "350px" }}
          action={{ icon: "send", onClick: onIconClick }}
          placeholder="Message"
        />
      </div>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  account: state.accountReducer
});

export default connect(
  mapStateToProps,
  {
    getCurrentUser
  }
)(Chat);
