import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import {
  getCurrentUser,
  getSessions,
  deleteAccount,
  updateDeleteSession
} from "../../actions/accountActions";
import { Button } from "reactstrap";
import SessionList from "./SessionList";
import { Link } from "react-router-dom";
import io from 'socket.io-client';
import {
  setInitialSocket
} from "../../actions/socketActions";

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


    if(!socketState.socket_connected) {
        socket = io.connect('http://localhost:5000', {query:"user_id=" + localStorage.getItem('user_id')});
        setInitialSocket(socket);
      }
      else {
        socket = socketState.socket;
      }

      socket.on('newUserAddedToSession', function(payload) {
         getSessions();
      });

      socket.on('sessionDeleted', function(payload) {
        updateDeleteSession(payload.deletedSession._id);
     });
    
  }, [ sessions]);

  return loading && authentication.user === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <p>Welcome {authentication.user && authentication.user.name}</p>
      <SessionList sessions={sessions} user={user} loading={loading} />
      <Link
        style={{ marginLeft: "0.3rem", marginTop: "0.3rem" }}
        to="/edit-personal-details"
        className="btn btn-secondary btn-sm"
      >
        Edit Personal Details
      </Link>
      <Button
        size="sm"
        color="danger"
        style={{ marginLeft: "0.3rem", marginTop: "0.3rem" }}
        onClick={() => deleteAccount()}
      >
        Delete Account
      </Button>
    </Fragment>
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
  { getCurrentUser, getSessions, deleteAccount, updateDeleteSession, setInitialSocket }
)(AccountBoard);
