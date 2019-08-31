import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  getCurrentUser,
  getSessions,
  deleteAccount,
  updateDeleteSession
} from "../../actions/accountActions";
import { Segment, Button, Container, Header, Icon } from "semantic-ui-react";
import SessionList from "./SessionList";
import CreateSessionModal from "./CreateSessionModal";
import io from "socket.io-client";
import { setInitialSocket } from "../../actions/socketActions";

let socket;

const AccountBoard = ({
  getCurrentUser,
  getSessions,
  deleteAccount,
  updateDeleteSession,
  setInitialSocket,
  account: { sessions, loading, user },
  socketState,
  authentication
}) => {
  useEffect(() => {
    getCurrentUser();
    getSessions();

    if (!socketState.socket_connected) {
      socket = io.connect("http://localhost:5000", {
        query: "user_id=" + localStorage.getItem("user_id")
      });
      setInitialSocket(socket);
    } else {
      socket = socketState.socket;
    }

    socket.on("newUserAddedToSession", function(payload) {
      getSessions();
    });

    socket.on("sessionDeleted", function(payload) {
      updateDeleteSession(payload.deletedSession._id);
    });
  }, [
    getCurrentUser,
    getSessions,
    setInitialSocket,
    socketState.socket,
    socketState.socket_connected,
    updateDeleteSession
  ]);
  return sessions && user === null ? (
    <Container className="main container">
      <Header>Welcome {authentication.user && authentication.user.name}</Header>
      <CreateSessionModal />
      <Link
        style={{ marginLeft: "0.3rem", marginTop: "0.3rem" }}
        to="/edit-personal-details"
        className="ui button"
      >
        Edit Personal Details <Icon name="settings" />
      </Link>
      <Button
        style={{ marginLeft: "0.3rem", marginTop: "0.3rem" }}
        onClick={() => deleteAccount()}
      >
        Delete Account
      </Button>
    </Container>
  ) : (
    <Container className="main container">
      <Segment style={{ overflow: "auto", maxHeight: "80vh" }}>
        <Header>
          Welcome {authentication.user && authentication.user.name}
        </Header>
        <CreateSessionModal />
        <SessionList userSessions={sessions} user={user} loading={loading} />
      </Segment>
      <Link
        style={{ marginLeft: "0.3rem", marginTop: "0.3rem" }}
        to="/edit-personal-details"
        className="ui button"
      >
        Edit Personal Details <Icon name="settings" />
      </Link>
      <Button
        style={{ marginLeft: "0.3rem", marginTop: "0.3rem" }}
        onClick={() => deleteAccount()}
      >
        Delete Account
      </Button>
    </Container>
  );
};

AccountBoard.propTypes = {
  authentication: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  getCurrentUser: PropTypes.func.isRequired,
  getSessions: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  authentication: state.authenticationReducer,
  account: state.accountReducer,
  socketState: state.socketReducer
});

export default connect(
  mapStateToProps,
  {
    getCurrentUser,
    getSessions,
    deleteAccount,
    updateDeleteSession,
    setInitialSocket
  }
)(AccountBoard);
